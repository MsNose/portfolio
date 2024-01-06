// pie.js

// Check if the highcharter library is available, if not, load it
if (typeof Highcharts === 'undefined') {
  var script = document.createElement('script');
  script.src = 'https://code.highcharts.com/highcharts.js';
  script.onload = function() {
    // Once Highcharts is loaded, run the code to generate the chart
    generateHighchart();
  };
  document.head.appendChild(script);
} else {
  // Highcharts is already loaded, directly run the code to generate the chart
  generateHighchart();
}

// Function to generate the Highchart
function generateHighchart() {
  // Your Highcharts code here
  <div id="optimizedWeightsChart" style="min-width: 310px; height: 400px; margin: 0 auto"></div>

<script src="https://code.highcharts.com/highcharts.js"></script>
<script src="https://code.highcharts.com/modules/exporting.js"></script>
<script src="https://code.highcharts.com/modules/export-data.js"></script>
<script src="https://code.highcharts.com/modules/accessibility.js"></script>

<script>
// Check if the highcharter library is available, if not, load it
if (typeof Highcharts === 'undefined') {
  var script = document.createElement('script');
  script.src = 'https://code.highcharts.com/highcharts.js';
  script.onload = function() {
    // Once Highcharts is loaded, run the code to generate the chart
    generateHighchart();
  };
  document.head.appendChild(script);
} else {
  // Highcharts is already loaded, directly run the code to generate the chart
  generateHighchart();
}

// Function to generate the Highchart
function generateHighchart() {
  // Your data
  var data = [{
    Indices: "LE57TREU Index",
    Optimized_Weight: 3.573870e-01
  }, {
    Indices: "MXUS Index",
    Optimized_Weight: 3.431106e-01
  }, {
    Indices: "MXEUG Index",
    Optimized_Weight: 8.546427e-02
  }, {
    Indices: "I00163EU Index",
    Optimized_Weight: 8.541785e-02
  }, {
    Indices: "I31914EU Index",
    Optimized_Weight: 8.339464e-02
  }, {
    Indices: "MSERP Index",
    Optimized_Weight: 4.263598e-02
  }, {
    Indices: "I00001EU Index",
    Optimized_Weight: 2.589715e-03
  }, {
    Indices: "I00039EU Index",
    Optimized_Weight: 2.907976e-16
  }, {
    Indices: "I04276EU Index",
    Optimized_Weight: 1.990585e-16
  }, {
    Indices: "MXGB Index",
    Optimized_Weight: 0.000000e+00
  }];

  // Create a responsive pie chart
  Highcharts.chart('optimizedWeightsChart', {
    chart: {
      type: 'pie'
    },
    title: {
      text: 'Departamental Strength of the Company'
    },
    subtitle: {
      text: 'Optimized Weights'
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: 'pointer',
        dataLabels: {
          enabled: true,
          format: '<b>{point.name}</b>: {point.percentage:.1f}%'
        }
      }
    },
    series: [{
      name: 'Optimized Weights',
      data: data
    }],
    responsive: {
      rules: [{
        condition: {
          maxWidth: 500
        },
        chartOptions: {
          legend: {
            enabled: false
          }
        }
      }]
    }
  });
}
</script>


  // Example:
  Highcharts.chart('optimizedWeightsChart', {
    // Highcharts configuration options
    // ...
  });
}
