//script pour création et affichage du graphe
import '../lib/plotly.min.js';

export function makePlot(i, axe){

    // tableaux des valeurs en abscisse et ordonné pour les deux data
    let xArray1 = [];
    let xArray2 = [];
    let yArray1 = [];
    let yArray2 = [];

    // affectation des lignes du dat à mettre sur le graphe en fonction de l'axe x
    if (axe == "x") {
      for (let index = lines_number_Y_1*i ; index < lines_number_Y_1*(i+1) ; index++) {
        xArray1.push(data_tab_1[index][1]);
        yArray1.push(data_tab_1[index][3]);
      }
      for (let index = lines_number_Y_2*i ; index < lines_number_Y_2*(i+1) ; index++) {
        xArray2.push(data_tab_2[index][1]);
        yArray2.push(data_tab_2[index][3]);
      }
    }

    // affectation des lignes du dat à mettre sur le graphe en fonction de l'axe y
    if (axe == "y") {
      for (let index = 0 ; index < lines_number_X_1 ; index++){
        xArray1.push(data_tab_1[(index*lines_number_Y_1)+i][0]);
        yArray1.push(data_tab_1[(index*lines_number_Y_1)+i][3]);
      }
      for (let index = 0 ; index < lines_number_X_2 ; index++){
        xArray2.push(data_tab_2[(index*lines_number_Y_2)+i][0]);
        yArray2.push(data_tab_2[(index*lines_number_Y_2)+i][3]);
      }
    }

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