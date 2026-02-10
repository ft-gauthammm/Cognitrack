// Important: DO NOT remove this `ErrorBoundary` component.
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#0f172a] text-white">
          <div className="text-center p-8 glass-panel rounded-xl">
            <h1 className="text-2xl font-bold text-red-500 mb-4">
              System Critical Error
            </h1>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-[var(--primary-color)] rounded-lg"
            >
              Reboot System
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function App() {
  const [activeTab, setActiveTab] = React.useState("dashboard");

  /* ================= METRICS ================= */
  const [avgBlinkRate, setAvgBlinkRate] = React.useState(16);
  const [totalBlinks, setTotalBlinks] = React.useState(0);
  const [blinkStressIndex, setBlinkStressIndex] = React.useState(0);

  const [cognitiveLoad, setCognitiveLoad] = React.useState("LOW");
  const [analysisResult, setAnalysisResult] = React.useState(null);

  const [isTracking, setIsTracking] = React.useState(false);
  const [sessionSeconds, setSessionSeconds] = React.useState(0);

  /* ================= ANALYTICS ================= */
  const [blinkStressTimeline, setBlinkStressTimeline] = React.useState([]);

  /* ================= BLINK EVENTS ================= */
  React.useEffect(() => {
    const handler = (e) => {
      if (!isTracking) return;

      const { avgBlinkRate, totalBlinks, blinkIndex } = e.detail;

      setAvgBlinkRate(avgBlinkRate);
      setTotalBlinks(totalBlinks);

      const derivedBlinkIndex =
        typeof blinkIndex === "number"
          ? blinkIndex
          : avgBlinkRate <= 4 ? 9
          : avgBlinkRate <= 8 ? 7
          : avgBlinkRate <= 12 ? 5
          : avgBlinkRate <= 16 ? 3
          : 2;

      setBlinkStressIndex(derivedBlinkIndex);
    };

    window.addEventListener("blink-update", handler);
    return () => window.removeEventListener("blink-update", handler);
  }, [isTracking]);

  /* ================= SESSION TIMER ================= */
  React.useEffect(() => {
    const handler = (e) => setSessionSeconds(e.detail.seconds);
    window.addEventListener("session-update", handler);
    return () => window.removeEventListener("session-update", handler);
  }, []);

  /* ================= FUSION + ANALYTICS ================= */
  React.useEffect(() => {
    if (!isTracking) return;

    let level =
      blinkStressIndex >= 8
        ? "HIGH"
        : blinkStressIndex >= 5
        ? "MEDIUM"
        : "LOW";

    setCognitiveLoad(level);

    setAnalysisResult({
      stressLevel: level,
      index: blinkStressIndex,
      suggestion:
        level === "HIGH"
          ? "Take a short break and rest your eyes."
          : level === "MEDIUM"
          ? "Slow down and blink consciously."
          : "You're doing well. Maintain your pace.",
      explanation:
        level === "HIGH"
          ? "Severe blink suppression detected."
          : level === "MEDIUM"
          ? "Moderate blink-based cognitive strain detected."
          : "Blink behavior within healthy range.",
      reason:
        avgBlinkRate <= 4
          ? "Severe blink suppression (hyperfocus)"
          : "",
    });

    // ✅ Blink timeline logging (analytics)
    setBlinkStressTimeline((prev) => [
      ...prev.slice(-59),
      { t: Date.now(), value: blinkStressIndex },
    ]);
  }, [blinkStressIndex, isTracking]);

  /* ================= START / STOP ================= */
  const handleStartTracking = async () => {
    setIsTracking(true);
    setSessionSeconds(0);
    setTotalBlinks(0);
    setBlinkStressTimeline([]);

    if (window.startSession) window.startSession();
    if (window.startBlinkTracking) await window.startBlinkTracking();
  };

  const handleStopTracking = () => {
    setIsTracking(false);
    if (window.stopSession) window.stopSession();
    if (window.stopBlinkTracking) window.stopBlinkTracking();
  };

  /* ================= UI ================= */
  return (
    <div className="h-screen w-full flex bg-transparent relative overflow-hidden">
      <div className="absolute inset-0 bg-black/40 pointer-events-none"></div>

      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="flex-1 flex flex-col">
        <Header />

        <main className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* ================= DASHBOARD ================= */}
          {activeTab === "dashboard" && (
            <>
              <button
                onClick={isTracking ? handleStopTracking : handleStartTracking}
              >
                {isTracking ? "Stop Tracking" : "Start Tracking"}
              </button>

              <EyeWidget blinkRate={avgBlinkRate} setBlinkRate={() => {}} />

              <div>
                <div className="text-xs text-gray-400 uppercase">
                  Total Blinks
                </div>
                <div className="text-3xl font-bold">
                  {totalBlinks}
                </div>
              </div>

              <ScreenWidget
                screenLoad={cognitiveLoad}
                setScreenLoad={() => {}}
                reason={analysisResult?.reason || ""}
                setReason={() => {}}
              />

              <StressAnalysis
                result={analysisResult}
                isAnalyzing={isTracking}
              />
            </>
          )}

          {/* ================= ANALYTICS ================= */}
          {activeTab === "analytics" && (
            <div className="glass-panel p-8 rounded-xl min-h-[520px]">
              <h2 className="text-lg font-semibold text-white mb-6">
                Blink Stress Over Time
              </h2>

              {blinkStressTimeline.length > 0 ? (
                <BlinkStressChart data={blinkStressTimeline} />
              ) : (
                <p className="text-sm text-gray-400">
                  Start tracking to see blink stress analytics.
                </p>
              )}
            </div>
          )}

        </main>
      </div>
    </div>
  );
}

/* ================= RENDER ================= */
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);
