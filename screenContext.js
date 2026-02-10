let interactionCount = 0;

// Interaction signals
["mousemove", "keydown", "wheel"].forEach(evt => {
  document.addEventListener(evt, () => interactionCount++);
});

function inferScreenContext({
  blinkRate,
  baselineBlink = 16,
  sessionSeconds,
  stressLevel
}) {
  if (stressLevel === "LOW") return null;

  const interactionDensity =
    sessionSeconds > 0 ? interactionCount / sessionSeconds : 0;

  // Reset after every inference window
  interactionCount = 0;

  // Heavy visual focus (reading, coding, design)
  if (blinkRate < baselineBlink * 0.7 && interactionDensity < 0.3) {
    return "Sustained visual focus detected (reading, coding, or design work)";
  }

  // Multitasking / tab switching
  if (interactionDensity > 1.2 && blinkRate < baselineBlink * 0.8) {
    return "High interaction rate detected (possible multitasking or frequent tab switching)";
  }

  // Fatigue from long exposure
  if (sessionSeconds > 900 && blinkRate < baselineBlink * 0.6) {
    return "Extended continuous screen exposure causing cognitive fatigue";
  }

  return "Increased cognitive load inferred from attention patterns";
}

window.inferScreenContext = inferScreenContext;
