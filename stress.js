window.addEventListener("blink-update", (e) => {
  const { blinkRate } = e.detail;

  let stressLevel = "LOW";
  if (blinkRate < 10) stressLevel = "HIGH";
  else if (blinkRate < 15) stressLevel = "MEDIUM";

  window.dispatchEvent(new CustomEvent("stress-update", {
    detail: {
      stressLevel,
      index:
        stressLevel === "HIGH" ? 85 :
        stressLevel === "MEDIUM" ? 60 : 25
    }
  }));
});
