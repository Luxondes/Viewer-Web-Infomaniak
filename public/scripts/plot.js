import '../lib/plotly.min.js';

export function makePlot(dat, i, numberX, numberY){

    let lx = [];
    let ly = [];
    for (let index = 0; index < numberY; index++) {
        lx.push(index)
        ly.push(dat[index][i+3]);
    }


    var trace = {
        x: [0, 1, 2, 3, 4, 5, 6, 7, 8],
        y: [8, 7, 6, 5, 4, 3, 2, 1, 0],
        type: 'scatter'
    };
        
    var data = [trace];
    
    var layout = {
        xaxis: {
        type: 'log',
        autorange: true
        },
        yaxis: {
        type: 'log',
        autorange: true
        }
    };
    
    Plotly.newPlot('plot', data, layout);
}