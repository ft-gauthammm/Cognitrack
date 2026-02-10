let sessionSeconds = 0;
let timer = null;

window.startSession = () => {
  sessionSeconds = 0;
  window.currentSessionSeconds = 0;

  timer = setInterval(() => {
    sessionSeconds++;
    window.currentSessionSeconds = sessionSeconds;

    window.dispatchEvent(
      new CustomEvent("session-update", {
        detail: { seconds: sessionSeconds },
      })
    );
  }, 1000);
};

window.stopSession = () => {
  clearInterval(timer);
  timer = null;
};
