function getAIInsight(level, index, seconds) {
  // Fatigue awareness
  const longSession = seconds > 1200; // 20 minutes

  if (level === "HIGH") {
    return {
      title: "High Cognitive Stress Detected",
      message:
        "Your blink behavior and prolonged screen engagement indicate elevated cognitive stress.",
      solutions: [
        "Take a 2–5 minute break away from the screen",
        "Follow the 20-20-20 rule (look 20 feet away for 20 seconds)",
        "Blink consciously for 30 seconds",
        "Reduce on-screen brightness or clutter"
      ],
      tone: "critical"
    };
  }

  if (level === "MEDIUM") {
    return {
      title: "Moderate Cognitive Load",
      message:
        "Your focus is sustained, but signs of cognitive strain are emerging.",
      solutions: [
        "Take a short pause in the next 5–10 minutes",
        "Relax your eyes and shoulders",
        "Hydrate and blink more frequently"
      ],
      tone: "warning"
    };
  }

  // LOW
  return {
    title: "Healthy Cognitive Load",
    message:
      longSession
        ? "You're maintaining good cognitive balance despite a long session."
        : "Your cognitive load is within a healthy range.",
    solutions: [
      "Keep up the good work",
      "Maintain your current workflow"
    ],
    tone: "positive"
  };
}
