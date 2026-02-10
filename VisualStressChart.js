function VisualStressChart({ data }) {
  const ref = React.useRef();

  React.useEffect(() => {
    if (!ref.current || data.length === 0) return;

    const ctx = ref.current.getContext("2d");

    if (ref.current._chart) ref.current._chart.destroy();

    ref.current._chart = new Chart(ctx, {
      type: "line",
      data: {
        labels: data.map((_, i) => i),
        datasets: [{
          label: "Visual Stress",
          data: data.map(d => d.value),
          borderColor: "#a78bfa",
          tension: 0.3,
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: { min: 0, max: 10 }
        }
      }
    });
  }, [data]);

  return <canvas ref={ref} className="w-full h-[320px]" />;
}
export default VisualStressChart;
