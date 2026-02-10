let chart;

function initChart() {
  const ctx = document.getElementById("blinkChart").getContext("2d");

  chart = new Chart(ctx, {
    type: "line",
    data: {
      labels: [],
      datasets: [{
        label: "Blink Rate",
        data: [],
        borderColor: "#60a5fa",
        tension: 0.4
      }]
    },
    options: {
      animation: false,
      scales: { y: { min: 0, max: 30 } }
    }
  });
}

function updateChart(blinkRate) {
  const time = new Date().toLocaleTimeString();

  chart.data.labels.push(time);
  chart.data.datasets[0].data.push(blinkRate);

  if (chart.data.labels.length > 15) {
    chart.data.labels.shift();
    chart.data.datasets[0].data.shift();
  }

  chart.update();
}
