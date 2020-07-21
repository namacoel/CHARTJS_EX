/* onload 참고 코드 */
/*
1.
window.onload = function (e) {
  console.log("onload");
  console.log(e);
};

2.
window.addEventListener("DOMContentLoaded", function (e) {
  console.log("DOMContentLoaded");
  console.log(e);
  console.log(e.currentTarget); // 이렇게 하면 3번 처럼 윈도우 객체를 받아오네..
});

3.
(function (e) {
  console.log("func");
  console.log(e);
})(this);

*/
/* 참고 : 페이지 로딩 이벤트 핸들러 차이 (성능/ 실행 시점 차이)
   1. window.onload = function(){...}; // 
   2. $(document).ready(function() {...});
   3. window.addEventListener('DOMContentLoaded', function() {...}); //이건 2번(jquery)과 동일
   - 1번의 경우 현재 호출 되고 있는 페이지에서 DOM뿐만아니라 리소스 호출도 완료되었을 경우에 실행이 됩니다.
   - 2, 3번 항목의 경우에는 리소스와 상관없이 DOM만 생성되어도 호출이 됩니다.
*/

var chartColors = {
  red: "rgb(255, 99, 132)",
  orange: "rgb(255, 159, 64)",
  yellow: "rgb(255, 205, 86)",
  green: "rgb(75, 192, 192)",
  blue: "rgb(54, 162, 235)",
  purple: "rgb(153, 102, 255)",
  grey: "rgb(201, 203, 207)",
};

var color = Chart.helpers.color;
var colorNames = Object.keys(chartColors);

var MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

var _barChart = "";
var _barChartData = {};
_barChartData = {
  /* 
  // labels: ["5월"],
  datasets: [
    {
      label: "사업장1",
      data: [12],
      backgroundColor: ["rgba(255, 99, 132, 0.2)"],
      borderColor: ["rgba(255, 99, 132, 1)"],
      borderWidth: 1,
    },
  ], */
};

var dataset1 = {
  // label: "사업장1",
  data: [12],
  backgroundColor: ["rgba(255, 99, 132, 0.2)"],
  borderColor: ["rgba(255, 99, 132, 1)"],
  borderWidth: 1,
};

var dataset2 = {
  // label: "사업장2",
  data: [100],
  backgroundColor: ["rgba(54, 162, 235, 0.2)"],
  borderColor: ["rgba(54, 162, 235, 1)"],
  borderWidth: 1,
};

var Samples = {};
Samples.utils = {
  // Adapted from http://indiegamr.com/generate-repeatable-random-numbers-in-js/
  srand: function (seed) {
    this._seed = seed;
  },

  rand: function (min, max) {
    var seed = this._seed;
    min = min === undefined ? 0 : min;
    max = max === undefined ? 1 : max;
    this._seed = (seed * 9301 + 49297) % 233280;
    return min + (this._seed / 233280) * (max - min);
  },

  numbers: function (config) {
    var cfg = config || {};
    var min = cfg.min || 0;
    var max = cfg.max || 1;
    var from = cfg.from || [];
    var count = cfg.count || 8;
    var decimals = cfg.decimals || 8;
    var continuity = cfg.continuity || 1;
    var dfactor = Math.pow(10, decimals) || 0;
    var data = [];
    var i, value;

    for (i = 0; i < count; ++i) {
      value = (from[i] || 0) + this.rand(min, max);
      if (this.rand() <= continuity) {
        data.push(Math.round(dfactor * value) / dfactor);
      } else {
        data.push(null);
      }
    }

    return data;
  },

  labels: function (config) {
    var cfg = config || {};
    var min = cfg.min || 0;
    var max = cfg.max || 100;
    var count = cfg.count || 8;
    var step = (max - min) / count;
    var decimals = cfg.decimals || 8;
    var dfactor = Math.pow(10, decimals) || 0;
    var prefix = cfg.prefix || "";
    var values = [];
    var i;

    for (i = min; i < max; i += step) {
      values.push(prefix + Math.round(dfactor * i) / dfactor);
    }

    return values;
  },

  months: function (config) {
    var cfg = config || {};
    var count = cfg.count || 12;
    var section = cfg.section;
    var values = [];
    var i, value;

    for (i = 0; i < count; ++i) {
      value = MONTHS[Math.ceil(i) % 12];
      values.push(value.substring(0, section));
    }

    return values;
  },

  color: function (index) {
    return COLORS[index % COLORS.length];
  },

  transparentize: function (color, opacity) {
    var alpha = opacity === undefined ? 0.5 : 1 - opacity;
    return Color(color).alpha(alpha).rgbString();
  },
};

// _barChartData.labels = ["테스트"];

window.addEventListener("DOMContentLoaded", function (e) {
  console.log("페이지 로딩 (DOMContentLoaded)");
  console.log(e.currentTarget); // window 객체

  // 데이터셋 생성

  var ctx = document.getElementById("barChart");
  _barChart = new Chart(ctx, {
    type: "bar",
    data: _barChartData,
    options: {
      responsive: true,
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Chart.js Bar Chart",
      },
    },
  });

  document.getElementById("btnRandomizeData").addEventListener("click", function () {
    var zero = Math.random() < 0.2 ? true : false;
    _barChartData.datasets.forEach(function (dataset) {
      dataset.data = dataset.data.map(function () {
        return zero ? 0.0 : randomScalingFactor();
      });
    });
    _barChart.update();
  });

  //var colorNames = Object.keys(chartColors);
  document.getElementById("btnAddDataset").addEventListener("click", function () {
    var colorName = colorNames[_barChartData.datasets.length % colorNames.length];
    var dsColor = chartColors[colorName];

    var newDataset = {};

    newDataset.label = "사업장" + (_barChartData.datasets.length + 1);
    newDataset.backgroundColor = color(dsColor).alpha(0.5).rgbString();
    newDataset.borderColor = dsColor;
    newDataset.borderWidth = 1;
    newDataset.data = [];

    /** 데이터셋.데이터 세팅하기 */
    for (var index = 0; index < _barChartData.labels.length; ++index) {
      newDataset.data.push(randomScalingFactor());
    }

    _barChartData.datasets.push(newDataset);
    _barChart.update();
  });

  /** 데이터셋 추가하기 */
  document.getElementById("btnRemoveDataset").addEventListener("click", function () {
    _barChartData.datasets.pop();
    _barChart.update();
  });

  /** 데이터 추가하기 */
  document.getElementById("btnAddData").addEventListener("click", function () {
    if (_barChartData.datasets.length > 0) {
      var month = MONTHS[_barChartData.labels.length % MONTHS.length];
      _barChartData.labels.push(month);
    }

    for (var index = 0; index < _barChartData.datasets.length; ++index) {
      _barChartData.datasets[index].data.push(randomScalingFactor());
    }

    _barChart.update();
  });

  document.getElementById("btnRemoveData").addEventListener("click", function () {
    _barChartData.labels.splice(-1, 1); // remove the label first

    _barChartData.datasets.forEach(function (dataset) {
      dataset.data.pop();
    });

    _barChart.update();
  });

  /** 모든 클릭 이벤트 로그 출력 */
  document.addEventListener("click", function (e) {
    console.log(e.srcElement.id + "." + e.type);
  });

  /** 랜덤 수 발생 */
  window.randomScalingFactor = function () {
    return Math.round(Samples.utils.rand(1, 100));
  };

  /** 테스트 버튼 */
  /*   document.getElementById("btnTest").addEventListener("click", function () {
    document.getElementById("btnAddDataset").click();
    document.getElementById("btnAddDataset").click();
    document.getElementById("btnAddDataset").click();
    document.getElementById("btnAddDataset").click();
    document.getElementById("btnAddDataset").click();
    document.getElementById("btnAddDataset").click();
    document.getElementById("btnAddDataset").click();
  }); */

  // Initialization
  // 시드생성
  Samples.utils.srand(Date.now());

  // 최초 데이터
  // document.getElementById("btnAddDataset").click();
  // document.getElementById("btnAddDataset").click();
});
