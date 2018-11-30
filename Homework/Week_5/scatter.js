/**
Name: Jikke van den Ende
Student number: 10787593

This file contains the content of the script in the scatter.html.
When the page is loaded a graph will be drawn.
*/


function retrieveData() {
    var womenInScience = "http://stats.oecd.org/SDMX-JSON/data/MSTI_PUB/TH_WRXRS.FRA+DEU+KOR+NLD+PRT+GBR/all?startTime=2007&endTime=2015"
    var consConf = "http://stats.oecd.org/SDMX-JSON/data/HH_DASH/FRA+DEU+KOR+NLD+PRT+GBR.COCONF.A/all?startTime=2007&endTime=2015"

    var requests = [d3.json(womenInScience), d3.json(consConf)];

    Promise.all(requests).then(function(response) {
         dataMSTI = transformResponse(response[0]);
         dataConsConf = transformResponse(response[1]);
         data = combineData(dataMSTI, dataConsConf);
         console.log(data);
         dataset = getDatapoints2007(data);
         console.log(dataset);
         scatterplot = scatterplotData(dataset);

    }).catch(function(e){
         throw(e);
    });

};

function getDatapoints2007(data) {
    var data2007 = data["2007"];
    var dataset = []
    Object.keys(data2007).forEach(function(d) {
        datapoints = []
        datapoints.push(data2007[d]["datapoint ConCof"]);
        datapoints.push(data2007[d]["datapoint MSTI"])
        dataset.push(datapoints);
    });

    return dataset;
}

function scatterplotData(dataset) {
    var svg_width = 600;
    var svg_height = 300;
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
                .attr("height", svg_height);

    var xAxis =svg.append("g")
                  .attr("class", "x axis")
                  .attr("transform", "translate(" + svgpadding_width + "," + (window_height + svgpadding_height) + ")")
                  .call(d3.axisBottom(xScale))

    svg.append("text")
        .attr("transform","translate(" + (svgpadding_width + (window_width / 2)) + "," + (window_height + svgpadding_height + 40) + ")")
        .style("text-achor", "middle")
        .text("MSTI");

    var yAxis = svg.append("g")
                    .attr("class", "y axis")
                    .attr("transform", "translate(" + svgpadding_width + "," + svgpadding_height + ")")
                    .call(d3.axisLeft(yScaleAxis));

    svg.append("text")
        .attr("transform","rotate(-90)")
        .attr("y", svgpadding_width / 2 )
        .attr("x", 0 - (window_height / 2) - svgpadding_height - 60)
        .style("text-achor", "middle")
        .text("Consumer Confidence");

    svg.selectAll("circle")
        .data(dataset)
        .enter()
        .append("circle")
        .attr("cx", function(d) { return (svgpadding_width + xScale(d[1])); })
        .attr("cy", function(d) { return (yScale(d[0]) - svgpadding_height); })
        .attr("r", 5)
}

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
    retrieveData();
    console.log('Yes, you can!');
};
