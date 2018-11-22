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
      var array = JSON.parse(txtFile.responseText);
      ytransform = createTransform([0,300], [0, myCanvas.height]);
      xtransform = createTransform([2012, 2016], [0, 250]);

      var canvas = document.getElementById('myCanvas');
      var ctx = canvas.getContext('2d');

      var xpading = 30
      var ypading = 30

      ctx.beginPath();
      ctx.moveTo(xpading, 0);
      ctx.lineTo(xpading, myCanvas.height - ypading);
      ctx.lineTo(myCanvas.width + xpading, myCanvas.height - ypading);
      ctx.stroke();

      Object.keys(array).forEach(function(key) {
          ctx.fillText(key, 20 + xtransform(key), myCanvas.height - ypading + 20);
      });

      // ctx.textAlign = 'right';
      // ctx.textBaseline = 'middle';
      //
      // for(var i = 0; i < 300; i+= 10) {
      //     ctx.fillText(i, xpadding - 20, ytransform(i))
      // }


      // Create Graph Line
      ctx.beginPath();
      ctx.strokeSyle = '#f00';

      Object.keys(array).forEach(function(key) {
          xcoordinate = xtransform(key);
          ycoordinate =  300 - ytransform(array[key]);
          if(key == '2012') {
              ctx.moveTo(xpading + xcoordinate, ycoordinate - ypading);
          }
          else {
              ctx.lineTo(xpading + xcoordinate, ycoordinate - ypading);
          }
      });

      ctx.stroke();

      ctx.fillStyle = '#333';

      Object.keys(array).forEach(function(key) {
        ctx.beginPath();
        ctx.arc(xpading + xtransform(key), 300 - ytransform(array[key]) - ypading, 4, 0, Math.PI * 2, true);
        ctx.fill();
      });

      function createTransform(domain, range){
      /**
      Domain is a two-element array of the data bounds [domain_min, domain_max].
      Range is a two-element array of the screen bounds [range_min, range_max].
      */
          var domain_min = domain[0]
          var domain_max = domain[1]
          var range_min = range[0]
          var range_max = range[1]

          // formulas to calculate the alpha and the beta
          var alpha = (range_max - range_min) / (domain_max - domain_min)
          var beta = range_max - alpha * domain_max

          // returns the function for the linear transformation (y= a * x + b)
          return function(x){
            return alpha * x + beta;
          }
      }
    }
}

txtFile.open("GET", fileName);
txtFile.send()
