import '../lib/plotly.min.js';

export function makePlot(dat, i, numberX, numberY){

    let xArray = [];
    let yArray = [];
    for (let index = 0; index < numberY; index++) {
      xArray.push(index)
      yArray.push(dat[index][i+3]);
    }
    
    var data = [{
      x: xArray,
      y: yArray,
      mode: "lines",
      type: "scatter"
    }];
    
    var layout = {
      width: 422,
      margin: {t: 40, r: 40, b: 40, l: 40},
      xaxis: {range: [Math.min(...xArray)-1, Math.max(...xArray)+1]},
      yaxis: {range: [Math.min(...yArray)-1, Math.max(...yArray)+1]}
    };
    
    Plotly.newPlot("plot", data, layout);
}