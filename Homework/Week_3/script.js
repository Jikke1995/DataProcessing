/**
Name: Jikke van den Ende
Student number: 10787593

This file contains the content of the script in the linegraph.html.
It creates a linegraph over time for given data.
*/

var fileName = "data.json";
var txtFile = new XMLHttpRequest();
txtFile.onreadystatechange = function() {
    if (txtFile.readyState === 4 && txtFile.status == 200) {

      // Store data
      var array = JSON.parse(txtFile.responseText);

      // Create Canvas
      var canvas = document.getElementById('myCanvas');
      var ctx = canvas.getContext('2d');

      // Create variables
      var xpadding = 60;
      var ypadding = 20;
      var graph_height = 200;
      var graph_width = 300;
      var label_extra = 20;
      var maxY = maximum_value(array);

      // Create dialog
      ctx.beginPath();
      ctx.moveTo(xpadding, ypadding);
      ctx.lineTo(xpadding, graph_height + ypadding);
      ctx.lineTo(xpadding + graph_width, graph_height + ypadding);
      ctx.stroke();

      // Create functions to calculate the coordinates of data point in canvas
      ytransform = createTransform([0,maxY], [ypadding, graph_height + ypadding]);
      xtransform = createTransform([2012, 2016], [xpadding, graph_width]);

      // Give labels (years) to x-axis
      Object.keys(array).forEach(function(key) {
          ctx.fillText(key,xtransform(key) + label_extra, graph_height + ypadding + label_extra);
      });
      ctx.stroke();

      // Label total x-axis
      ctx.fillText("Year", xpadding + graph_width / 2, myCanvas.height - ypadding - label_extra);

      // Label y-axis
      ctx.textAlign = "right"
      ctx.textBaseline = "middle";
      for(var i = 0; i < 300; i += 40) {
          ctx.fillText(i, xpadding - 10, ytransform(maxY - i));
      }


      // Iterate over datapoints and draw lines between the coordinates in canvas
      Object.keys(array).forEach(function(key) {
          xcoordinate = xtransform(key);
          ycoordinate = ytransform(maxY - array[key]);
          if(key == '2012') {
              console.log(xcoordinate);
              console.log(ycoordinate);
              ctx.strokeStyle = 'blue'
              ctx.beginPath();
              ctx.moveTo(xcoordinate + label_extra + 10, ycoordinate);
          }
          else {
              console.log(xcoordinate);
              console.log(maxY - ycoordinate);
              ctx.lineTo(xcoordinate + label_extra + 10, ycoordinate);
          }
      });
      ctx.stroke();

      // Draw points at any datapoint
      ctx.fillStyle = 'blue';
      Object.keys(array).forEach(function(key) {
          ctx.beginPath();
          ctx.arc(xtransform(key) + label_extra + 10, ytransform(maxY - array[key]), 4, 0, Math.PI * 2, true);
          ctx.fill();
      });
      ctx.stroke();

      // Label total y-axis
      ctx.fillStyle = 'black'
      ctx.translate(12, ypadding + (graph_height / 2));
      ctx.rotate(-0.5 * Math.PI);
      ctx.fillText("Women graduated", xpadding - label_extra - 10, 0);




      /**
      Function to calculate the coordinates of datapoints in a given domain
      (the minimum and maximum value of the datapoint) and the range of a
      canvas.
      */
      function createTransform(domain, range){

          var domain_min = domain[0];
          var domain_max = domain[1];
          var range_min = range[0];
          var range_max = range[1];

          // formulas to calculate the alpha and the beta
          var alpha = (range_max - range_min) / (domain_max - domain_min);
          var beta = range_max - alpha * domain_max;

          // returns the function for the linear transformation (y= a * x + b)
          return function(x){
            return alpha * x + beta;
          }
      }

      /**
      This function calculates the highest datapoint value
      */
      function maximum_value(array) {

          var max_value = 0;

          Object.keys(array).forEach(function(key) {
            if(array[key] > max_value) {
              max_value = array[key];
            }
          });

          return max_value;
      }


    }
}

txtFile.open("GET", fileName);
txtFile.send()
