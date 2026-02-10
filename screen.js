let activeSeconds = 0;
let activeInterval = null;

function handleVisibility() {
  if (document.visibilityState === "visible") {
    activeInterval = setInterval(() => {
      activeSeconds += 1;
      window.dispatchEvent(
        new CustomEvent("screen-update", {
          detail: { seconds: activeSeconds }
        })
      );
    }, 1000);
  } else {
    clearInterval(activeInterval);
  }
}

document.addEventListener("visibilitychange", handleVisibility);
