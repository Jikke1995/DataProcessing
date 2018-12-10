/**
Name: Jikke van den Ende
Student number: 10787593
*/

window.onload = function() {
    createMap();

    d3v5.json("data.json").then(function(data){
        console.log(data);
        console.log(data["AUS"]["2015"])
        makeBarChart(data, 'BEL');
    });

};

function makeBarChart(data, country) {

    var chart_width = 400;
    console.log(chart_width);
    var chart_height = 300;
    var padding = (100 / 2);
    var barpadding = 2;

    var svg = d3v5.select("#barchart")
              .append("svg")
              .attr("width", 500)
              .attr("height", 400)

    var country_info = data[country];
    var values = [];
    var years = [];
    Object.keys(country_info).forEach(function(key) {
        values.push(country_info[key]);
        years.push(key);
    });

    console.log(values);
    console.log(years);
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

    rectangles.attr("x", function(d, i) {
                  return padding + barpadding + i * (chart_width / values.length);
              })
              .attr("y", function(d) { return padding + chart_height - yScale(d);})
              .attr("fill", function(d) { return "rgb(3,0, " + (d * 10) + ")"})
              .attr("width", chart_width / values.length - barpadding)
              .attr("height", function(d) { return yScale(d); });

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
        .attr("transform","translate(" + (padding + chart_width / 2)  + "," + (padding + chart_height + padding - 10) + ")")
        .style("text-achor", "middle")
        .text("Year");
}

function createMap() {
  var map = new Datamap({
    element: document.getElementById('container'),
    // bubblesConfig: {
    //   popupTemplate: function(geography, data) {
    //
    //     return
    //   }
    // }
  });
}

function getData() {
    var alcohol_consumption = "data.json";
    d3v5.json("data.json").then(function(data){
        console.log(data);
        console.log(data["AUS"]["2015"])
    });
}
