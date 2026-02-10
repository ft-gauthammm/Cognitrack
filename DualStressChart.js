function DualStressChart({ data }) {
  if (!data || data.length < 2) {
    return (
      <div className="glass-panel p-6 rounded-xl text-gray-400">
        Waiting for analytics data…
      </div>
    );
  }

  const WIDTH = 900;
  const HEIGHT = 300;
  const PADDING = 40;
  const MAX_Y = 10;

  const xStep = (WIDTH - PADDING * 2) / (data.length - 1);

  const scaleY = (value) =>
    HEIGHT - PADDING - (value / MAX_Y) * (HEIGHT - PADDING * 2);

  const blinkPath = data
    .map((d, i) => `${PADDING + i * xStep},${scaleY(d.blink)}`)
    .join(" ");

  const visualPath = data
    .map((d, i) => `${PADDING + i * xStep},${scaleY(d.visual)}`)
    .join(" ");

  return (
    <div className="glass-panel p-6 rounded-xl w-full">
      <h3 className="text-sm text-gray-400 mb-4">
        Blink Stress vs Visual Stress (0–10)
      </h3>

      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="w-full h-[320px]"
      >
        {/* grid */}
        {[0, 2, 4, 6, 8, 10].map((v) => (
          <line
            key={v}
            x1={PADDING}
            x2={WIDTH - PADDING}
            y1={scaleY(v)}
            y2={scaleY(v)}
            stroke="rgba(255,255,255,0.05)"
          />
        ))}

        {/* blink */}
        <polyline
          fill="none"
          stroke="#22d3ee"
          strokeWidth="2.5"
          points={blinkPath}
        />

        {/* visual */}
        <polyline
          fill="none"
          stroke="#a78bfa"
          strokeWidth="2.5"
          points={visualPath}
        />
      </svg>

      <div className="flex gap-6 text-xs mt-4 text-gray-400">
        <span className="flex items-center gap-2">
          <span className="w-4 h-1 bg-cyan-400"></span>
          Blink Stress
        </span>
        <span className="flex items-center gap-2">
          <span className="w-4 h-1 bg-purple-400"></span>
          Visual Stress
        </span>
      </div>
    </div>
  );
}

export default DualStressChart;
