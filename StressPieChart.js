function StressPieChart({ blink, visual, healthy }) {
  const ref = React.useRef();

  React.useEffect(() => {
    const ctx = ref.current.getContext("2d");
    if (ref.current._chart) ref.current._chart.destroy();

    ref.current._chart = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: ["Blink", "Visual", "Healthy"],
        datasets: [{
          data: [blink, visual, healthy],
          backgroundColor: ["#22d3ee", "#a78bfa", "#22c55e"]
        }]
      },
      options: {
        cutout: "70%",
        plugins: { legend: { display: true } }
      }
    });
  }, [blink, visual, healthy]);

  return <canvas ref={ref} />;
}
export default StressPieChart;
