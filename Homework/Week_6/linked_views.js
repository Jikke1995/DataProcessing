/**
Name: Jikke van den Ende
Student number: 10787593
*/

window.onload = function() {

    d3v5.json("data.json").then(function(data){
        console.log(data);
        createMap(data);
        makeBarChart(data, 'LUX');
    });

};

function createDataDatamap(data) {
  dataDatamap = {}
  Object.keys(data).forEach(function(key) {

      dataDatamap[key] = data[key]["2015"];
  });

  return dataDatamap;
}

function makeBarChart(data, country) {

    var chart_width = 400;
    var chart_height = 300;
    var padding = (100 / 2);
    var barpadding = 2;

    var svg = d3v5.select("#barchart")
              .append("svg")
              .attr("width", 500)
              .attr("height", 400)
              .attr("transform", "translate(100, 100)");

    var country_info = data[country];
    var values = [];
    var years = [];
    Object.keys(country_info).forEach(function(key) {
        values.push(country_info[key]);
        years.push(key);
    });

    // Create the sscale function for the x values of the bars
    var xScale = d3v5.scaleTime()
                    .domain([new Date(years[0], 0), new Date((years[years.length - 1]), 0)])
                    .range([0, chart_width]);

    // Create the scale funtion for the y values of the bars
    var yScale = d3v5.scaleLinear()
                    .domain([0, 20])
                    .range([0, chart_height]);

    // Create the scale functin for the y-axis
    var yScaleAxis = d3v5.scaleLinear()
                        .domain([0, 20])
                        .range([chart_height, 0]);

    var rectangles = svg.selectAll("rect")
                        .data(values)
                        .enter()
                        .append("rect")

    var tip = createToolTip(svg);

    rectangles.attr("x", function(d, i) {
                  return padding + barpadding + i * (chart_width / values.length);
              })
              .attr("y", function(d) { return padding + chart_height - yScale(d);})
              .attr("fill", function(d) { return "rgb(252,141,89)" })
              .attr("width", chart_width / values.length - barpadding)
              .attr("height", function(d) { return yScale(d); })
              .on('mouseover', function(d,i) {
                  tip.style("display", null)
              })
              .on('mouseout', function(d) {
                  tip.style("display", "none")
                  d3v5.select(this).attr("fill", function(d) {
                  return "rgb(252,141,89)"
                });
              })
              .on('mousemove', function(d, i) {
                d3v5.select(this).attr("fill", "rgb(252,223,89)")
                tip.style("display", null);
                var xPosition = d3v5.mouse(this)[0] - 100;
                var yPosition = d3v5.mouse(this)[1] - 70;
                tip.attr("transform", "translate(" + xPosition + "," + yPosition + ")");
                tip.select("text").text("Alcohol consumption: " + d + ", Year: " + years[i]);
              });

    //Add x-axis
    var x_axis = svg.append("g")
                    .attr("class", "x axis")
                    .attr("transform", "translate(" + padding + "," + (chart_height + padding) + ")")
                    .call(d3v5.axisBottom(xScale))
                    .selectAll("text")
                    .attr("x", 4)
                    .style("text-anchor", "middle");

    //Add y-axis
    var y_axis = svg.append("g")
                    .attr("class", "y axis")
                    .attr("transform", "translate(" + padding + "," + padding + ")")
                    .call(d3v5.axisLeft(yScaleAxis))

    svg.append("text")
        .attr("class", "x-label")
        .attr("transform","translate(" + (padding + chart_width / 2)  + "," + (padding + chart_height + padding - 10) + ")")
        .style("text-achor", "middle")
        .text("Year");
}

function createMap(data) {

  dataset = createDataDatamap(data)
  console.log(dataset);

  var map = new Datamap({
    element: document.getElementById('container'),
    // data: {
    //   return dataset
    // },
    geographyConfig: {
        popupTemplate: function(geo, dataset) {
            return ['<div class="hoverinfo"><strong>',
                    geo.properties.name,
                     // ': ' + dataset["AUS"],
                    '</strong></div>'].join('');
        }
    }
  });
}

function createToolTip(svg) {
  var tip = svg.append("g")
                .attr("class", "tooltip")
                .style("display", "none")

  // Append a rect to the tooltip
  tip.append("rect")
      .attr("width", 260)
      .attr("position", "absolute")
      .attr("height", 20)
      .attr("fill", "white")
      .style("opacity", 0.5);

  // Append the possibility for a piece of text for the tooltip
  tip.append("text")
      .attr("x", 20)
      .attr("dy", "1.2em")
      .attr("position", "absolute")
      .style("text-achor", "middle")
      .attr("font-size", "12px")
      .attr("font-weight", "bold")

  return tip;

}

function getData() {
    var alcohol_consumption = "data.json";
    d3v5.json("data.json").then(function(data){
        console.log(data);
        console.log(data["AUS"]["2015"])
    });
}
