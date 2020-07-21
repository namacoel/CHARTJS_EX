var chartData = {
  labels: ["January", "February", "March", "April", "May", "June"],
  datasets: [
    {
      fillColor: "#79D1CF",
      strokeColor: "#79D1CF",
      data: [60, 80, 81, 56, 55, 40],
    },
  ],
};

var ctx = document.getElementById("myChart1").getContext("2d");
var myLine = new Chart(ctx).Line(chartData, {
  showTooltips: false,
  onAnimationComplete: function () {
    var ctx = this.chart.ctx;
    ctx.font = this.scale.font;
    ctx.fillStyle = this.scale.textColor;
    ctx.textAlign = "center";
    ctx.textBaseline = "bottom";

    this.datasets.forEach(function (dataset) {
      dataset.points.forEach(function (points) {
        ctx.fillText(points.value, points.x, points.y - 10);
      });
    });
  },
});

var ctx = document.getElementById("myChart2").getContext("2d");
var myBar = new Chart(ctx).Bar(chartData, {
  showTooltips: false,
  onAnimationComplete: function () {
    var ctx = this.chart.ctx;
    ctx.font = this.scale.font;
    ctx.fillStyle = this.scale.textColor;
    ctx.textAlign = "center";
    ctx.textBaseline = "bottom";

    this.datasets.forEach(function (dataset) {
      dataset.bars.forEach(function (bar) {
        ctx.fillText(bar.value, bar.x, bar.y - 5);
      });
    });
  },
});
