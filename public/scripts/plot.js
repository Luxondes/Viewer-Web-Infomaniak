import '../lib/plotly.min.js';

export function makePlot(i){

    let xArray1 = [];
    let xArray2 = [];
    let yArray1 = [];
    let yArray2 = [];

    for (let index = 0; index < numberY1; index++) {
      xArray1.push(index)
      yArray1.push(datlines1[index][i+3]);
    }
    for (let index = 0; index < numberY2; index++) {
      xArray2.push(index)
      yArray2.push(datlines2[index][i+3]);
    }
    console.log(datlines1,datlines2);

    var data = [{
      x: xArray1,
      y: yArray1,
      mode: "lines",
      type: "scatter",
    },
    {
      x: xArray2,
      y: yArray2,
      mode: "lines",
      type: "scatter"
    }];
    
    var layout = {
      width: 422,
      margin: {t: 40, r: 40, b: 40, l: 40},
      xaxis: {range: [Math.min(Math.min(...xArray1),Math.min(...xArray2))-1, Math.max(Math.max(...xArray1),Math.max(...xArray2))+1]},
        yaxis: {range: [Math.min(Math.min(...yArray1),Math.min(...yArray2))-1, Math.max(Math.max(...yArray1),Math.max(...yArray2))+1]}
    };
    
    Plotly.newPlot("plot", data, layout);
}