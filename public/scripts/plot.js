import '../lib/plotly.min.js';

export function makePlot(i, axe){

    let xArray1 = [];
    let xArray2 = [];
    let yArray1 = [];
    let yArray2 = [];

    if (axe == "x") {
      for (let index = numberY1*i ; index < numberY1*(i+1) ; index++) {
        xArray1.push(datlines1[index][1]);
        yArray1.push(datlines1[index][3]);
      }
      for (let index = numberY2*i ; index < numberY2*(i+1) ; index++) {
        xArray2.push(datlines2[index][1]);
        yArray2.push(datlines2[index][3]);
      }
    }

    if (axe == "y") {
      for (let index = 0 ; index < numberX1 ; index++){
        xArray1.push(datlines1[(index*numberY1)+i][0]);
        yArray1.push(datlines1[(index*numberY1)+i][3]);
      }
      for (let index = 0 ; index < numberX2 ; index++){
        xArray2.push(datlines2[(index*numberY2)+i][0]);
        yArray2.push(datlines2[(index*numberY2)+i][3]);
      }
    }

    console.log(xArray1);
    console.log(yArray1);

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