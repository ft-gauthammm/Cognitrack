function HistoryChart({ data }) {
  const canvasRef = React.useRef(null);
  const chartRef = React.useRef(null);

  React.useEffect(() => {
    if (!canvasRef.current) return;

    if (chartRef.current) {
      chartRef.current.destroy();
    }

    chartRef.current = new Chart(canvasRef.current, {
      type: "line",
      data: {
        labels: data.map(d => d.time),
        datasets: [
          {
            label: "Blink Rate (BPM)",
            data: data.map(d => d.bpm),
            borderColor: "#8b5cf6",
            backgroundColor: "rgba(139,92,246,0.15)",
            fill: true,
            tension: 0.35,
            pointRadius: 2,
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            min: 5,
            max: 25,
            ticks: { color: "#9ca3af" },
            grid: { color: "rgba(255,255,255,0.05)" }
          },
          x: {
            ticks: { color: "#9ca3af" },
            grid: { display: false }
          }
        },
        plugins: {
          legend: { display: false },
          annotation: {
            annotations: {
              normalZone: {
                type: "box",
                yMin: 15,
                yMax: 20,
                backgroundColor: "rgba(34,197,94,0.1)"
              }
            }
          }
        }
      }
    });

    return () => chartRef.current?.destroy();
  }, [data]);

  return (
    <div className="glass-panel rounded-2xl p-6 h-[300px]">
      <h3 className="text-sm font-bold text-gray-300 uppercase mb-4">
        Blink Rate Trend
      </h3>
      <canvas ref={canvasRef} />
    </div>
  );
}
