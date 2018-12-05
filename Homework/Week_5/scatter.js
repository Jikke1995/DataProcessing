/**
Name: Jikke van den Ende
Student number: 10787593

This file contains the content of the script in the scatter.html.
When the page is loaded a graph will be drawn.
Used links:
https://bl.ocks.org/anonymous/7a65777a1e310b76aca5d499e967c467
*/

function getDataPoints(data, year) {
  var dataset = data[year];
  var set = []
  Object.keys(dataset).forEach(function(d) {
      datapoints = []
      datapoints.push(dataset[d]["datapoint ConCof"]);
      datapoints.push(dataset[d]["datapoint MSTI"])
      set.push(datapoints);
  });
  return set;
}

function updateGraph(data, year) {
    var datapoints = getDataPoints(data, year);
    console.log(datapoints);
    scatterplotData(data, datapoints);
}


function scatterplotData(data, datapoints) {

    var dataset = datapoints;

    console.log(data);
    console.log(dataset);

    var svg_width = 800;
    var svg_height = 500;
    var window_width = 400;
    var window_height = 200;
    var svgpadding_width = (svg_width - window_width) / 2;
    var svgpadding_height = (svg_height - window_height) / 2;

    var xScale = d3.scaleLinear()
                    .domain([0, 50])
                    .range([0, window_width]);

    var yScale = d3.scaleLinear()
                    .domain([95,102])
                    .range([0, window_height])

    var yScaleAxis = d3.scaleLinear()
                    .domain([95,102])
                    .range([window_height, 0])

    var svg = d3.select("body")
                .append("svg")
                .attr("width", svg_width)
                .attr("height", svg_height)

    svg.append("text")
        .attr("class", "title")
        .attr("transform", "translate(20," + (svgpadding_height / 2 - 20) + ")")
        .style("text-achor", "middle")
        .text("Scatterplot of MSTI and Consumer Confidence Data");

    var xAxis =svg.append("g")
                  .attr("class", "x-axis")
                  .attr("transform", "translate(" + (svgpadding_width / 2) + "," + (window_height + svgpadding_height) + ")")
                  .call(d3.axisBottom(xScale))

    var xLabel = svg.append("text")
                    .attr("transform","translate(" + (svgpadding_width / 2 + (window_width / 2)) + "," + (window_height + svgpadding_height + 40) + ")")
                    .style("text-achor", "middle")
                    .text("MSTI");

    var yAxis = svg.append("g")
                    .attr("class", "y-axis")
                    .attr("transform", "translate(" + (svgpadding_width / 2 ) + "," + svgpadding_height + ")")
                    .call(d3.axisLeft(yScaleAxis));

    svg.append("text")
        .attr("transform","rotate(-90)")
        .attr("y", svgpadding_width / 2 - 50 )
        .attr("x", 0 - (window_height / 2) - svgpadding_height - 70)
        .style("text-achor", "middle")
        .text("Consumer Confidence");

    var colors = ['#66c2a5','#fc8d62','#8da0cb','#e78ac3','#a6d854','#ffd92f'];

    var colorLegendG = svg.append("g")
                          .attr("transform", "translate(" + (svgpadding_width + window_width + 50) + "," + (svgpadding_height / 2 + 20) +  ")");

    colorLegendG.append("text")
                .attr("class", "legend-label")
                .attr("x", 0)
                .attr("y", -30)
                .text("Countries");

    var countries = ["France", "Germany", "Korea", "Netherlands", "Portugal", "United Kingdom"];

    var colorScale = d3.scaleOrdinal()
                        .domain(countries)
                        .range(colors)


    var colorLegend = d3.legendColor()
                        .scale(colorScale)
                        .shape('circle');

    svg.selectAll("circle")
        .data(dataset)
        .enter()
        .append("circle")
        .attr("cx", function(d) { return (svgpadding_width / 2 + xScale(d[1])); })
        .attr("cy", function(d) { return window_height + svgpadding_height - yScale(d[0]); })
        .attr("r", "4")
        .attr("fill", function(d, i) {
            return colors[i];
        });

    colorLegendG.call(colorLegend)
                .selectAll('.cell text')
                .attr("dy", "0.1em");

    var years = ["2007", "2008", "2009", "2010", "2011", "2012", "2013", "2014", "2015"];

    d3.select('#x-axis-menu')
      .selectAll('li')
      .data(years)
      .enter()
      .append('li')
      .text(function(d) { return d; })
      .classed('selected', function(d) {
        return d === xLabel;
      })
      .on('click', function(d) {
        updateGraph(data, d);
        console.log(d);
        console.log("hoi");
      });

};


function combineData(data1, data2) {

    // set up output object, an object of objects of objects, each containing
    // two datapoints, and the indicaters of those datapoints
    var data_dict = {};
    var start_year = 2007;
    var end_year = 2016;

    data2.forEach(function(d) {
      var result = data1.filter(function(s) {
        return s["Country"] === d["Country"] && s["time"] === d["time"];
      });
      delete d["Frequency"];
      d["datapoint ConCof"] = d["datapoint"];
      delete d["datapoint"];
      d["Indicator ConCof"] = d["Indicator"];
      delete d["Indicator"];
      d["Indicator MSTI"] = (result[0] !== undefined) ? result[0]["MSTI Variables"] : null
      d["datapoint MSTI"] = (result[0] !== undefined) ? result[0]["datapoint"] : null
    });

    data2.forEach(function(d) {
      for(var i = start_year; i < end_year; i++) {
        country = {}
        data2.forEach(function(s) {
          if(s["time"] == i) {
            country[s["Country"]] = s;
            data_dict[i] = country;
          };
        });
      };
    })

    // Return the finished product!
    return data_dict;
}

function transformResponse(data) {

    // access data property of the response
    let dataHere = data.dataSets[0].series;

    // access variables in the response and save length for later
    let series = data.structure.dimensions.series;
    let seriesLength = series.length;

    // set up array of variables and array of lengths
    let varArray = [];
    let lenArray = [];

    series.forEach(function(serie){
        varArray.push(serie);
        lenArray.push(serie.values.length);
    });

    // get the time periods in the dataset
    let observation = data.structure.dimensions.observation[0];

    // add time periods to the variables, but since it's not included in the
    // 0:0:0 format it's not included in the array of lengths
    varArray.push(observation);

    // create array with all possible combinations of the 0:0:0 format
    let strings = Object.keys(dataHere);

    // set up output array, an array of objects, each containing a single datapoint
    // and the descriptors for that datapoint
    let dataArray = [];

    // for each string that we created
    strings.forEach(function(string){
        // for each observation and its index
        observation.values.forEach(function(obs, index){
            let data = dataHere[string].observations[index];
            if (data != undefined){

                // set up temporary object
                let tempObj = {};

                let tempString = string.split(":");
                tempString.forEach(function(s, indexi){
                    tempObj[varArray[indexi].name] = varArray[indexi].values[s].name;
                });

                // every datapoint has a time and ofcourse a datapoint
                tempObj["time"] = obs.name;
                tempObj["datapoint"] = data[0];
                dataArray.push(tempObj);
            }
        });
    });

    // return the finished product!
    return dataArray;
}




window.onload = function() {
  d3.select("body").append("h3").text("Scatterplot");
  d3.select("body").append("p").text("Jikke van den Ende, 10787593");
  d3.select("body").append("b").text("Data sources:");
  d3.select("body").append("div").html("<a href ='https://stats.oecd.org/SDMX-JSON/data/MSTI_PUB/TH_WRXRS.FRA+DEU+KOR+NLD+PRT+GBR/all?startTime=2007&endTime=2015'>MSTI values</a>");
  d3.select("body").append("div").html("<a href ='https://stats.oecd.org/SDMX-JSON/data/HH_DASH/FRA+DEU+KOR+NLD+PRT+GBR.COCONF.A/all?startTime=2007&endTime=2015'>Consumer confidence values</a>");
  d3.select("body").append("br");

  var womenInScience = "http://stats.oecd.org/SDMX-JSON/data/MSTI_PUB/TH_WRXRS.FRA+DEU+KOR+NLD+PRT+GBR/all?startTime=2007&endTime=2015"
  var consConf = "http://stats.oecd.org/SDMX-JSON/data/HH_DASH/FRA+DEU+KOR+NLD+PRT+GBR.COCONF.A/all?startTime=2007&endTime=2015"

  var requests = [d3.json(womenInScience), d3.json(consConf)];

  Promise.all(requests).then(function(response) {
       dataMSTI = transformResponse(response[0]);
       dataConsConf = transformResponse(response[1]);
       data = combineData(dataMSTI, dataConsConf);
       console.log(data);
       datapoints = getDataPoints(data, "2007");
       console.log(datapoints);
       scatterplot = scatterplotData(data, datapoints);

  }).catch(function(e){
       throw(e);
  });
};
