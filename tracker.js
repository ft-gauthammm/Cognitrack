/* ======================================================
   BLINK + COGNITIVE TRACKER (CORRECTED)
====================================================== */

let camera = null;
let faceMesh = null;
let videoEl = null;

/* ================= SESSION ================= */
let totalBlinks = 0;
let blinkTimestamps = [];
let sessionStart = null;

/* ================= EAR ================= */
let baselineEAR = null;
let calibrationSamples = [];
let calibrationStart = null;
let smoothEAR = null;

/* ================= BLINK STATE ================= */
let eyeClosed = false;
let closeStart = 0;

/* ================= STRESS PERSISTENCE ================= */
let lastStressLevel = "LOW";
let lastStressChange = 0;
const STRESS_HOLD_MS = 5000;

/* ================= CONSTANTS ================= */
const CALIBRATION_TIME = 2000;
const EAR_SMOOTH = 0.6;

const BLINK_MIN = 30;
const BLINK_MAX = 400;
const EAR_SCALE = 0.80;

/* ================= LANDMARKS ================= */
const LEFT_EYE = [33, 160, 158, 133, 153, 144];
const RIGHT_EYE = [362, 385, 387, 263, 373, 380];

/* ================= HELPERS ================= */
const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);

function eyeEAR(lm, eye) {
  const v1 = dist(lm[eye[1]], lm[eye[5]]);
  const v2 = dist(lm[eye[2]], lm[eye[4]]);
  const h = dist(lm[eye[0]], lm[eye[3]]);
  return (v1 + v2) / (2 * h);
}

/* ================= STRESS MODEL ================= */
function computeStress(blinkRate, seconds) {
  if (seconds < 8) return "LOW";

  if (blinkRate <= 6) return "HIGH";
  if (blinkRate <= 12) return "MEDIUM";
  return "LOW";
}

/* ================= EMIT ================= */
function emitBlinkUpdate(now) {
  blinkTimestamps = blinkTimestamps.filter(t => now - t < 60000);

  const instantBPM = blinkTimestamps.length;
  const sessionSeconds = Math.max(
    Math.floor((now - sessionStart) / 1000),
    1
  );

  const avgBlinkRate =
    sessionSeconds >= 60
      ? Math.round((totalBlinks / sessionSeconds) * 60)
      : instantBPM;

  window.dispatchEvent(
    new CustomEvent("blink-update", {
      detail: {
        avgBlinkRate,
        totalBlinks
      }
    })
  );

  emitStress(avgBlinkRate, sessionSeconds);
}

function emitStress(blinkRate, seconds) {
  let stressLevel = computeStress(blinkRate, seconds);
  const now = Date.now();

  // 🔒 HOLD stress level to avoid flicker
  if (
    lastStressLevel !== "LOW" &&
    stressLevel === "LOW" &&
    now - lastStressChange < STRESS_HOLD_MS
  ) {
    stressLevel = lastStressLevel;
  }

  if (stressLevel !== lastStressLevel) {
    lastStressLevel = stressLevel;
    lastStressChange = now;
  }

  const index =
    stressLevel === "HIGH" ? 85 :
    stressLevel === "MEDIUM" ? 55 : 25;

  const reason =
    stressLevel === "LOW"
      ? null
      : stressLevel === "HIGH"
      ? "Prolonged blink suppression indicates intense visual focus."
      : "Moderate blink reduction suggests sustained mental effort.";

  window.dispatchEvent(
    new CustomEvent("stress-update", {
      detail: {
        stressLevel,
        index,
        suggestion:
          stressLevel === "HIGH"
            ? "Take a short break and relax your eyes."
            : stressLevel === "MEDIUM"
            ? "Blink consciously and slow down."
            : "You're doing well.",
        explanation:
          stressLevel === "HIGH"
            ? "Very low blink rate is strongly linked to high cognitive load."
            : stressLevel === "MEDIUM"
            ? "Blink behavior indicates sustained concentration."
            : "Blink behavior is within a healthy range.",
        reason
      }
    })
  );
}

/* ================= CORE LOOP ================= */
function onResults(results) {
  if (!results.multiFaceLandmarks?.length) return;

  const lm = results.multiFaceLandmarks[0];
  const ear =
    (eyeEAR(lm, LEFT_EYE) + eyeEAR(lm, RIGHT_EYE)) / 2;

  smoothEAR =
    smoothEAR === null
      ? ear
      : EAR_SMOOTH * ear + (1 - EAR_SMOOTH) * smoothEAR;

  const now = Date.now();

  if (!baselineEAR) {
    if (!calibrationStart) calibrationStart = now;
    calibrationSamples.push(smoothEAR);

    if (now - calibrationStart >= CALIBRATION_TIME) {
      baselineEAR =
        calibrationSamples.reduce((a, b) => a + b, 0) /
        calibrationSamples.length;
    }
    return;
  }

  const CLOSED_EAR = baselineEAR * EAR_SCALE;

  if (smoothEAR < CLOSED_EAR) {
    if (!eyeClosed) {
      eyeClosed = true;
      closeStart = now;
    }
  } else {
    if (eyeClosed) {
      const duration = now - closeStart;

      if (duration >= BLINK_MIN && duration <= BLINK_MAX) {
        totalBlinks++;
        blinkTimestamps.push(now);
        emitBlinkUpdate(now);
      }

      eyeClosed = false;
    }
  }
}

/* ================= START / STOP ================= */
window.startBlinkTracking = async function () {
  totalBlinks = 0;
  blinkTimestamps = [];
  sessionStart = Date.now();

  baselineEAR = null;
  calibrationSamples = [];
  calibrationStart = null;
  smoothEAR = null;
  eyeClosed = false;

  videoEl = document.createElement("video");
  videoEl.style.display = "none";
  document.body.appendChild(videoEl);

  faceMesh = new FaceMesh({
    locateFile: f =>
      `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${f}`,
  });

  faceMesh.setOptions({
    maxNumFaces: 1,
    refineLandmarks: true,
    minDetectionConfidence: 0.6,
    minTrackingConfidence: 0.6,
  });

  faceMesh.onResults(onResults);

  camera = new Camera(videoEl, {
    onFrame: async () => {
      await faceMesh.send({ image: videoEl });
    },
    width: 640,
    height: 480,
  });

  await camera.start();
};

window.stopBlinkTracking = function () {
  if (camera) camera.stop();
  if (videoEl) videoEl.remove();
  camera = null;
};
