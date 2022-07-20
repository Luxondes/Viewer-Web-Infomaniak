import '../lib/plotly.min.js';

export function makePlot(dat, i, numberX, numberY){

    let lx = [];
    let ly = [];
    for (let index = 0; index < numberY; index++) {
        lx.push(index)
        ly.push(dat[index][i+3]);
    }


    var xArray = [50,60,70,80,90,100,110,120,130,140,150];
    var yArray = [7,8,8,9,9,9,10,11,14,14,15];
    
    // Define Data
    var data = [{
      x: xArray,
      y: yArray,
      mode: "lines",
      type: "scatter"
    }];
    
    // Define Layout
    var layout = {
      width: 422,
      margin: {t: 30, r: 30, b: 30, l: 30},
      xaxis: {range: [40, 160]},
      yaxis: {range: [5, 16]}
    };
    
    // Display using Plotly
    Plotly.newPlot("plot", data, layout);
}