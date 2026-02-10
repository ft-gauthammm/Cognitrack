import cv2
import numpy as np
import tkinter as tk
from PIL import ImageGrab
import threading
import time

from flask import Flask, jsonify
from threading import Lock


# ---------------- FLASK DATA BRIDGE ----------------
app = Flask(__name__)
data_lock = Lock()

latest_stress = {
    "timestamp": None,
    "stress": 0,
    "color": "#34D399"
}


@app.route("/stress")
def get_stress():
    with data_lock:
        return jsonify(latest_stress)


@app.route("/")
def status_page():
    with data_lock:
        stress = latest_stress["stress"]
        color = latest_stress["color"]
        timestamp = latest_stress["timestamp"]

    if timestamp is None:
        time_str = "Waiting for first reading..."
    else:
        time_str = time.strftime("%H:%M:%S", time.localtime(timestamp))

    return f"""
    <html>
        <head>
            <title>Stress Sensor Status</title>
            <meta http-equiv="refresh" content="1">
            <style>
                body {{
                    background: #121212;
                    color: white;
                    font-family: Arial, sans-serif;
                    padding: 20px;
                }}
                .box {{
                    padding: 20px;
                    border-radius: 12px;
                    background: #1e1e1e;
                    width: 260px;
                }}
                .dot {{
                    width: 20px;
                    height: 20px;
                    border-radius: 50%;
                    background: {color};
                    display: inline-block;
                    margin-right: 10px;
                }}
            </style>
        </head>
        <body>
            <div class="box">
                <h2>Local Stress Feed</h2>
                <p>
                    <span class="dot"></span>
                    Stress Level: <b>{stress}/10</b>
                </p>
                <p>Last Update: {time_str}</p>
            </div>
        </body>
    </html>
    """


# ---------------- VISUAL LOAD TRACKER ----------------
class VisualLoadTracker:
    def __init__(self, root):
        self.root = root
        self.enabled = True

        self.BASELINE_EDGE = 1.5
        self.BASELINE_TEXT = 1.2
        self.load_history = []

        self.root.title("Visual Load HUD")
        self.root.geometry("280x170+10+10")
        self.root.attributes("-topmost", True)
        self.root.configure(bg="#121212")

        self.meter_lbl = tk.Label(
            root, text="LOAD: --", fg="white",
            bg="#121212", font=("Impact", 26)
        )
        self.meter_lbl.pack(pady=(8, 4))

        self.desc_lbl = tk.Label(
            root, text="ANALYZING VISUAL LOAD",
            fg="#777", bg="#121212", font=("Arial", 9)
        )
        self.desc_lbl.pack()

        threading.Thread(
            target=self.analyze_loop,
            daemon=True
        ).start()


    def estimate_text_density(self, gray):
        thresh = cv2.adaptiveThreshold(
            gray, 255,
            cv2.ADAPTIVE_THRESH_MEAN_C,
            cv2.THRESH_BINARY_INV,
            17, 4
        )

        kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (3, 3))
        morph = cv2.morphologyEx(thresh, cv2.MORPH_CLOSE, kernel)

        contours, _ = cv2.findContours(
            morph, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE
        )

        text_pixels = 0
        h, w = gray.shape

        for cnt in contours:
            _, _, cw, ch = cv2.boundingRect(cnt)
            area = cw * ch

            if (
                area > 150 and
                0.4 < (cw / max(ch, 1)) < 10 and
                ch < h * 0.2
            ):
                text_pixels += area

        return (text_pixels / (h * w)) * 100


    # ---------------- MAIN LOOP ----------------
    def analyze_loop(self):
        while True:
            if not self.enabled:
                time.sleep(0.5)
                continue

            screen = np.array(ImageGrab.grab())

            # 🧠 IMPORTANT FIX: Crop out top UI (tabs, bookmarks)
            h, w, _ = screen.shape
            crop_top = int(h * 0.12)     # remove top 12%
            screen = screen[crop_top:h, 0:w]

            gray = cv2.cvtColor(screen, cv2.COLOR_RGB2GRAY)

            v = np.median(gray)
            sigma = 0.33
            lower = int(max(0, (1.0 - sigma) * v))
            upper = int(min(255, (1.0 + sigma) * v))

            edges = cv2.Canny(gray, lower, upper)
            edge_density = np.mean(edges > 0) * 100
            text_density = self.estimate_text_density(gray)

            edge_excess = max(0, edge_density - self.BASELINE_EDGE)
            text_excess = max(0, text_density - self.BASELINE_TEXT)

            edge_load = np.log1p(edge_excess) / np.log1p(8)
            text_load = np.log1p(text_excess) / np.log1p(5)

            edge_load = np.clip(edge_load, 0, 1)
            text_load = np.clip(text_load, 0, 1)

            raw_load = 0.35 * edge_load + 0.65 * text_load
            perceived = raw_load ** 1.4

            self.load_history.append(perceived)
            self.load_history = self.load_history[-6:]
            smoothed = np.mean(self.load_history)

            score = int(np.clip(10 * smoothed, 1, 10))

            self.root.after(
                0, self.update_ui,
                score, edge_density, text_density
            )

            time.sleep(2)


    def update_ui(self, score, edge_d, text_d):
        if score >= 8:
            color = "#FF4444"
        elif score >= 4:
            color = "#FBDE24"
        else:
            color = "#34D399"

        with data_lock:
            latest_stress["timestamp"] = time.time()
            latest_stress["stress"] = score
            latest_stress["color"] = color

        self.meter_lbl.config(text=f"LOAD: {score}/10", fg=color)
        self.desc_lbl.config(
            text=f"Edges: {edge_d:.2f}% | Text: {text_d:.2f}%"
        )


# ---------------- MAIN ----------------
if __name__ == "__main__":
    threading.Thread(
        target=lambda: app.run(
            host="127.0.0.1",
            port=5000,
            debug=False,
            use_reloader=False
        ),
        daemon=True
    ).start()

    root = tk.Tk()
    VisualLoadTracker(root)
    root.mainloop()
