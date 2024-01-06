---
title: Style Analysis
author: ''
date: '2023-10-01'
slug: []
categories: []
tags: []
description: ~
jobDate: 2023
work: []
techs:
- Python
designs:
- Highcharts
thumbnail: /2023-10-01-style-analysis/5.png
projectUrl: ~

---

The goal of the project was to explain the returns of a fund by established indices.

By conducting  style analysis, investors and portfolio managers can make informed decisions about the suitability of their portfolios for different market conditions. It offers static and dynamic perspective, acknowledging that market environments change over time, and portfolios need to be adaptable to deliver consistent performance.



## Startegic Style Analysis


In this analysis covering 60 months, we explore the performance of a unique investment fund. This fund strategically combines a 50% stake in the MSCI World Index with another 50% in the Bloomberg Aggregate Bond Index, both hedged into Euros. By examining its performance, we aim to understand how this blend of global equity and fixed-income exposure, along with currency hedging, shapes the fund's overall strategy and returns.   
Compared to OLS regression, which minimizes the sum of squared differences, style analysis aims to minimize the tracking error volatility (TEV). Moreover, it has no intercepts, and poses positive weights constraints. Thus, style analysis is a specialized method tailored for assessing and attributing the performance of investment portfolios to different styles. This is crucial in finance for understanding the underlying drivers of portfolio returns and making informed investment decisions.   
The following code shows error volatilitly minimazitaion process for the selected indices with the weight connstarints. As a result, positive optimized weights will be assigned to each of the indices, showing how similar their style is to the fund.


```r
# Create DataFrame
df = pd.DataFrame(x_selected)

#list of weights
num_indices = len(selected_indices)

# Initialize weights
initial_weight = 1 / num_indices
initialized_weights = [initial_weight] * num_indices

# Calculate style returns and errors with initialized weights
df['style_returns'] = 
    (x_selected * initialized_weights).sum(axis=1)
df['errors'] = y - df['style_returns']

# Function to calculate EV
def EV(weights, x, y):
    style_returns = np.dot(x, weights)
    errors = y - style_returns
    return np.var(errors)

# Constraint: sum of weights is 1
constraint = ({'type': 'eq',
               'fun': lambda w: np.sum(w) - 1})

# Bounds: each weight should be between 0 and 1
bounds = [(0, 1) for _ in range(num_indices)]

# Initial guess for weights
initial_guess = initialized_weights

# Perform optimization
result = minimize(EV, initial_guess,
                  args=(x_selected.values, y), 
                  method='SLSQP', bounds=bounds,
                  constraints=constraint)

# Extract optimized weights
optimized_weights = result.x

# Apply optimized weights to calculate
# style returns and errors
df['optimized_style_returns'] =
(x_selected * optimized_weights).sum(axis=1)
df['optimized_errors'] = y - df['optimized_style_returns']

#R-squared
FV = np.var(y)
EV_opt = EV(optimized_weights, x_selected.values, y)
r_squared=1-(EV_opt/FV)

# Create a DataFrame with optimized weights
# and corresponding index names
optimized_weights_df = pd.DataFrame(
    {'Indices': selected_indices,
     'Optimized_Weight': optimized_weights})

```


<script src="https://code.highcharts.com/highcharts.js"></script>
<script src="https://code.highcharts.com/modules/exporting.js"></script>
<script src="https://code.highcharts.com/modules/export-data.js"></script>
<script src="https://code.highcharts.com/modules/accessibility.js"></script>

<figure class="highcharts-figure">
    <div id="container"></div>
    <p class="highcharts-description">
    </p>
</figure>

<style>
.highcharts-figure,
.highcharts-data-table table {
    min-width: 320px;
    max-width: 800px;
    margin: 1em auto;
}

.highcharts-data-table table {
    font-family: Verdana, sans-serif;
    border-collapse: collapse;
    border: 1px solid #ebebeb;
    margin: 10px auto;
    text-align: center;
    width: 100%;
    max-width: 500px;
}

.highcharts-data-table caption {
    padding: 1em 0;
    font-size: 1.2em;
    color: #555;
}

.highcharts-data-table th {
    font-weight: 600;
    padding: 0.5em;
}

.highcharts-data-table td,
.highcharts-data-table th,
.highcharts-data-table caption {
    padding: 0.5em;
}

.highcharts-data-table thead tr,
.highcharts-data-table tr:nth-child(even) {
    background: #f8f8f8;
}

.highcharts-data-table tr:hover {
    background: #f1f7ff;
}

</style>

<script>
(function (H) {
    H.seriesTypes.pie.prototype.animate = function (init) {
        const series = this,
            chart = series.chart,
            points = series.points,
            {
                animation
            } = series.options,
            {
                startAngleRad
            } = series;

        function fanAnimate(point, startAngleRad) {
            const graphic = point.graphic,
                args = point.shapeArgs;

            if (graphic && args) {

                graphic
                    // Set inital animation values
                    .attr({
                        start: startAngleRad,
                        end: startAngleRad,
                        opacity: 1
                    })
                    // Animate to the final position
                    .animate({
                        start: args.start,
                        end: args.end
                    }, {
                        duration: animation.duration / points.length
                    }, function () {
                        // On complete, start animating the next point
                        if (points[point.index + 1]) {
                            fanAnimate(points[point.index + 1], args.end);
                        }
                        // On the last point, fade in the data labels, then
                        // apply the inner size
                        if (point.index === series.points.length - 1) {
                            series.dataLabelsGroup.animate({
                                opacity: 1
                            },
                            void 0,
                            function () {
                                points.forEach(point => {
                                    point.opacity = 1;
                                });
                                series.update({
                                    enableMouseTracking: true
                                }, false);
                                chart.update({
                                    plotOptions: {
                                        pie: {
                                            innerSize: '40%',
                                            borderRadius: 8
                                        }
                                    }
                                });
                            });
                        }
                    });
            }
        }

        if (init) {
            // Hide points on init
            points.forEach(point => {
                point.opacity = 0;
            });
        } else {
            fanAnimate(points[0], startAngleRad);
        }
    };
}(Highcharts));

Highcharts.chart('container', {
    chart: {
        type: 'pie'
    },
    title: {
        text: 'Overview of Optimized Weights',
        align: 'left'
    },
    subtitle: {
        text: 'R²: 0.8641',
        align: 'left'
    },
    tooltip: {
        pointFormat: '<b>{point.percentage:.1f}%</b>'
    },
    accessibility: {
        point: {
            valueSuffix: '%'
        }
    },
    plotOptions: {
        pie: {
            allowPointSelect: true,
            borderWidth: 2,
            cursor: 'pointer',
            dataLabels: {
                enabled: true,
                format: '<b>{point.name}</b>',
                distance: 20
            }
        }
    },
    colors: ['#003f5c', '#444e86', '#955196', '#dd5182', '#ff6e54', '#ffa600'],

    series: [{
        // Disable mouse tracking on load, enable after custom animation
        enableMouseTracking: false,
        animation: {
            duration: 2000
        },
        colorByPoint: true,
        data: [
            { name: 'LE57TREU Index', y: 3.573870e-01 },
            { name: 'MXUS Index', y: 3.431106e-01 },
            { name: 'MXEUG Index', y: 8.546427e-02 },
            { name: 'I00163EU Index', y: 8.541785e-02 },
            { name: 'I31914EU Index', y: 8.339464e-02 },
            { name: 'MSERP Index', y: 4.263598e-02 },
            // Group small values together
            { name: 'Other', y: 0, color: 'gray', dataLabels: { enabled: false } }
        ]
    }]
});

</script>





The chosen indices explain all togather 86.4% of the variance in the fund returns. This is mostly thanks to the and indices, which togather represent 70% of the weights. This means that the investment styles of LE57TREU and MXUS align the most with the fund’s overall investment style.Afterwards the indices, focusing more on the emerging markets and the Pacific region are filling the remaining gaps, leaving the United Kingdom insignificant.



## Rolling Style Analysis

Strategic Style Analysis is useful for long-term strategic planning, understanding the core investment styles of a portfolio, and assessing its alignment with the investor's objectives. However, to  gain a dynamic perspective, Rolling Style Analysis is the ideal approach. Rolling Style Analysis examines style dynamics over shorter, rolling periods. Thus, it is more sensitive to changes in style composition over time, making it useful for detecting shifts in investment strategy and allows for adaptability to changing market conditions and provides a more dynamic view of how a portfolio's style exposures evolve. In this case a 36 months rolling period, referred to as windows.   
Therfore, the base of the code is the similar to the strategic part, but the effective weights depend now also on the window size.


```r
# Function to get effective weights and optimized EV
# for a rolling window

def get_effective_weights_and_EV(x, y, window_size):
    effective_weights_list = []
    optimized_EV_list = []
    r_squared_list = []

    for i in range(len(x) - window_size + 1):
        # Extract data for the current window
        x_window = x.iloc[i:i+window_size]
        y_window = y.iloc[i:i+window_size]

        # Initialize weights
        num_indices = len(x_window.columns)
        initial_weight = 1 / num_indices
        initialized_weights = [initial_weight 
        for _ in range(num_indices)]

        # Constraint: sum of weights is 1
        constraint = ({'type': 'eq',
                       'fun': lambda w: np.sum(w) - 1})

        # Bounds: each weight should be between 0 and 1
        bounds = [(0, 1) for _ in   
                  range(len(initialized_weights))]

        # Initial guess for weights
        initial_guess = initialized_weights

        # Perform optimization for the current window
        result = minimize(EV, initial_guess,
                          args=(x_window.values, y_window),
                          method='SLSQP', bounds=bounds,
                          constraints=constraint)

        # Extract optimized weights and EV
        optimized_weights = result.x
        optimized_EV = EV(optimized_weights,
                          x_window.values,
                          y_window)

        # Calculate FV for the current window
        current_FV = np.var(y_window)

        effective_weights_list.append(optimized_weights)
        optimized_EV_list.append(optimized_EV)
        r_squared_list.append(1 - (optimized_EV / current_FV))

    return pd.DataFrame(effective_weights_list,
                        columns=x.columns),
                        optimized_EV_list, 
                        r_squared_list

# Set the rolling window size
window_size = 36

# Get effective weights and Rsquared for each rolling window
effective_weights_df, optimized_EV_list, r_squared_list = 
get_effective_weights_and_EV(x_selected,  y, window_size)

```



<script src="https://code.highcharts.com/highcharts.js"></script>
<script src="https://code.highcharts.com/modules/series-label.js"></script>
<script src="https://code.highcharts.com/modules/exporting.js"></script>
<script src="https://code.highcharts.com/modules/export-data.js"></script>
<script src="https://code.highcharts.com/modules/accessibility.js"></script>
<figure class="highcharts-figure">
<div id="container2"></div>
<p class="highcharts-description">

</p>
</figure>

<style>
.highcharts-figure,
.highcharts-data-table table {
    min-width: 310px;
    max-width: 800px;
    margin: 1em auto;
}

#container2 {
    height: 620px;
}

.highcharts-data-table table {
    font-family: Verdana, sans-serif;
    border-collapse: collapse;
    border: 1px solid #ebebeb;
    margin: 10px auto;
    text-align: center;
    width: 100%;
    max-width: 500px;
}

.highcharts-data-table caption {
    padding: 1em 0;
    font-size: 1.2em;
    color: #555;
}

.highcharts-data-table th {
    font-weight: 600;
    padding: 0.5em;
}

.highcharts-data-table td,
.highcharts-data-table th,
.highcharts-data-table caption {
    padding: 0.5em;
}

.highcharts-data-table thead tr,
.highcharts-data-table tr:nth-child(even) {
    background: #f8f8f8;
}

.highcharts-data-table tr:hover {
    background: #f1f7ff;
}

</style>

<script>
Highcharts.chart('container2', {
    chart: {
        type: 'area'
    },
    title: {
        useHTML: true,
        text: 'Overview of Optimized Weights',
        align: 'left'
    },
    subtitle: {
        text: '36 months rolling',
        align: 'left'
    },
    accessibility: {
        point: {
            valueDescriptionFormat: '{index}. {point.category}, {point.y:,.1f} billions, {point.percentage:.1f}%.'
        }
    },
    yAxis: [{
        labels: {
            format: '{value}%'
        },
        title: {
            enabled: false
        }
    }, {
        title: {
            text: '',
            style: {
                color: Highcharts.getOptions().colors[10] // Use a color from the default Highcharts color palette
            }
        },
        labels: {
            format: '{value}',
            style: {
                color: Highcharts.getOptions().colors[10] // Use a color from the default Highcharts color palette
            }
        },
        opposite: true,
        max: 1 // Set the maximum value of the second y-axis to 1 (corresponding to 100%)
    }],
    xAxis: {
        title: {
            text: 'Rolling Time' // X-axis title
        }
    },
    tooltip: {
        pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.percentage:.1f}%</b>',
        split: true
    },
    plotOptions: {
        series: {
            pointStart: 1
        },
        area: {
            stacking: 'percent',
            marker: {
                enabled: false
            }
        }
    },
    colors: ['#380d61', '#511761', '#692161', '#993461', '#ab4563', '#bd5665', '#e17869', '#e9854f', '#f09135', '#ffaa00'],
    series: [{
        name: 'I00039EU',
        data: [1.77E-15, 2.32E-16, 5.38E-16, 7.49E-16, 0, 0, 0, 2.00E-16, 1.33E-15, 7.87E-16, 1.83E-15, 0, 6.72E-16, 1.29E-15, 0, 0, 0, 0, 0.034172723, 1.82E-18, 0.069569816, 0.045446342, 0, 5.04E-17, 5.33E-17
        ]
    }, {
        name: 'I31914EU',
        data: [0.043948923, 0.062600767, 0.06362058, 0.060840249, 0.033425113, 0.032352527, 0.058543177, 0.119091657, 0.126086679, 0.111974503, 0.119378594, 0.142524944, 0.105384355, 0.063274999, 0.095164286, 0.067567655, 0.075873674, 0.053732213, 0.046888772, 0.100829182, 0.081760326, 0.066457538, 0.119523965, 0.116107717, 0.085656448
        ]
    }, {
        name: 'I00001EU',
        data: [0, 2.51E-16, 0, 0, 0, 2.04E-16, 1.47E-16, 4.20E-16, 0, 0, 4.12E-16, 2.29E-16, 0, 0.071707974, 0.043670979, 4.02E-16, 4.08E-16, 2.37E-16, 1.65E-16, 2.63E-17, 0, 0, 0, 0, 0.032207647]
    }, {
        name: 'LE57TREU ',
        data: [0.510126, 0.501998106, 0.50218981, 0.507361985, 0.527004492, 0.528485797, 0.493105655, 0.43147598, 0.423418803, 0.434391229, 0.435455281, 0.41097431, 0.435964121, 0.406841111, 0.4012063, 0.35726057, 0.3517178, 0.359271357, 0.230640351, 0.35388699, 0.360182524, 0.308352512, 0.143997871, 0.132223973, 0.145910483]
    }, {
        name: 'I00163EU',
        data: [0, 0, 0, 0, 0, 2.70E-17, 1.06E-16, 6.06E-17, 2.70E-17, 1.31E-16, 0, 0, 3.47E-17, 0, 0.005526771, 0.125237857, 0.121202582, 0.157556217, 0.182998326, 0.062269402, 0.033818907, 0.120142823, 0.197316676, 0.22533854, 0.22164787]
    }, {
        name: 'I04276EU',
        data: [1.19E-15, 9.47E-16, 2.12E-16, 0, 0, 0, 0, 7.42E-16, 1.15E-15, 0, 6.57E-16, 0, 2.35E-16, 1.16E-15, 0, 6.32E-16, 2.72E-16, 0, 4.28E-17, 0, 4.94E-17, 0, 2.68E-17, 2.63E-17, 2.49E-18]
    }, {
        name: 'MXEUG',
        data: [2.71E-16, 0, 0, 0, 0.005032791, 5.96E-17, 0, 0.024407775, 0.022899001, 0.025907952, 0.03858976, 0.036827842, 0.007342419, 0, 8.96E-17, 0.018129715, 0.01978641, 0.018160217, 0.061595409, 0.090864926, 0.127003133, 0.144534996, 0.164458325, 0.176447843, 0.199688236]
    }, {
        name: 'MXUS',
        data: [0.433047948, 0.421385511, 0.426593458, 0.410116495, 0.433474028, 0.423993409, 0.436554543, 0.422614026, 0.427595517, 0.427726316, 0.406576365, 0.409580547, 0.411563156, 0.37968855, 0.399845247, 0.372426543, 0.371766616, 0.371514466, 0.371736358, 0.31980228, 0.280621215, 0.282715715, 0.263296567, 0.255977502, 0.254298568]
    }, {
        name: 'MSERP',
        data: [0.004717653, 0, 5.43E-17, 0, 0.001063577, 0.015168267, 0.011796625, 0.002410562, 0, 0, 0, 9.24E-05, 0.039745949, 0.078487365, 0.054586417, 0.05937766, 0.059652918, 0.039765531, 0.071968061, 0.072347221, 0.04704408, 0.032350073, 0.100884458, 0.071332273, 0.060590749]
    }, {
        name: 'MXGB',
        data: [0.008159452, 0.014015616, 0.007596152, 0.021681271, 4.08E-17, 4.05E-16, 3.90E-16, 0, 0, 0, 0, 4.41E-17, 0, 0, 0, 0, 0, 0, 0, 0, 1.21E-17, 3.63E-18, 0.010522138, 0.022572151, 0]
    }]
});
    

</script>







<figure class="highcharts-figure">
<div id="r2Container"></div>
<p class="highcharts-description">

</p>
</figure>

<script>

Highcharts.chart('r2Container', {
    chart: {
        type: 'line'
    },
    title: {
        text: 'R² Values Over Time',
        align: 'left'
    },
    xAxis: {
        title: {
            text: 'Rolling Time'
        }
    },
    yAxis: {
        title: {
            text: 'R²'
        },
        labels: {
            format: '{value}' // D
        }
    },
    tooltip: {
        pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y:.4f}</b><br/>'
    },
    series: [{
        name: 'R²',
        color: '#380d61',
        data: [0.887637054213982, 0.8877011544478849, 0.8893914869239011, 
               0.8713920795217971, 0.8665540946770064, 0.8679043900554069, 
               0.8692618080938903, 0.8636292674059939, 0.8537008922721883, 
               0.8651509826300484, 0.8766494608118417, 0.8765565849152005, 
               0.8855102098710597, 0.8736283372886974, 0.8704095128028273,
               0.8703170437866761, 0.8722239322596772, 0.8685778868775915,
               0.8977930477888213, 0.8729195475342553, 0.8679203330957813, 
               0.860990109592243, 0.8860318848282231, 0.889069449817989, 
               0.8815811147382123]
    }]
});


</script>



As the graph shows, the main predictors over time are the **LE57TREU** and **MXUS** indices, in harmony with the findings of the the strategic analysis. Together with the **I31914EU** index these three seem to have a stable significant presence. However, the role of the other indices are rather fluctuating, and they just appear in the second half of the rolling. The complexity of predicting the fund with these indices is represented with the path of the r-squared over time, which is rather volatile. But after having a closer look it is clear that the r-square moves between 85% and 90%, which implies trustworty results.




