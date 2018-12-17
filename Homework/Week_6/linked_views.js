/**
Name: Jikke van den Ende
Student number: 10787593
This file contains the script for the linked views HTML. It creates a datamap
of the world, which shows (for countries with available data) the alcohol
consumption per country for the year 2015. When clicked on a country, a barchart
is shown which shows the alcohol consumption over multiple years for that
country.
*/

window.onload = function() {

    d3v5.json("data.json").then(function(data){
        showInfo();
        createMap(data);
    });

};

function createDataDatamap(data) {
    /**
    This function prepares the data that the Datamap can use,
    so a dictionary with only the datapoints from the year 2015.
    */
    dataDatamap = {}
    Object.keys(data).forEach(function(key) {
      datapoint = {};
        datapoint["alc_con"] = data[key]["2015"];
        dataDatamap[key] = datapoint;
    });

    return dataDatamap;
}

function makeBarChart(data, country) {
    /**
    This function creates a barchart given a dataset and the name of the
    country the barchart needs to be for.
    */

    var chart_width = 400;
    var chart_height = 300;
    var padding = (100 / 2);
    var barpadding = 2;

    var svg = d3v5.select("#barchart")
              .append("svg")
              .attr("id", "SVG")
              .attr("width", 500)
              .attr("height", 400)
              .attr("transform", "translate(225, 30)");

    // Stores the needed data into usable arrays
    var country_info = data[country];
    var values = [];
    var years = [];
    Object.keys(country_info).forEach(function(key) {
        values.push(country_info[key]);
        years.push(key);
    });

    // Calculates highest datapoint for country
    var max = Math.round(maxValue(values));

    // Create the sscale function for the x values of the bars
    var xScale = d3v5.scaleTime()
                    .domain([new Date(years[0], 0), new Date((years[years.length - 1]), 0)])
                    .range([0, chart_width]);

    // Create the scale funtion for the y values of the bars
    var yScale = d3v5.scaleLinear()
                    .domain([0, max + 6])
                    .range([0, chart_height]);

    // Create the scale functin for the y-axis
    var yScaleAxis = d3v5.scaleLinear()
                        .domain([0, max + 6])
                        .range([chart_height, 0]);

    // Create bars for barchart
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

                // Makes sure that the tooltip doesn't partly disappear
                if (xPosition < 2) {
                    xPosition = 2;
                }
                if (xPosition + 260 > 500) {
                    xPosition = 500 - 262
                }

                var yPosition = d3v5.mouse(this)[1] - 70;
                tip.attr("transform", "translate(" + xPosition + "," + yPosition + ")");
                tip.select("text").text("Alcohol consumption: " + d + ", Year: " + years[i]);
              });

    //Add x-axis
    var x_axis = svg.append("g")
                    .attr("class", "x-axis")
                    .attr("transform", "translate(" + padding + "," + (chart_height + padding) + ")")
                    .call(d3v5.axisBottom(xScale).ticks(values.length))
                    .selectAll("text")
                    .attr("x", 4)
                    .style("text-anchor", "middle");

    //Add y-axis
    var y_axis = svg.append("g")
                    .attr("class", "y axis")
                    .attr("transform", "translate(" + padding + "," + padding + ")")
                    .call(d3v5.axisLeft(yScaleAxis))

    // Add x-axis label
    svg.append("text")
        .attr("class", "x-label")
        .attr("transform","translate(" + (padding + chart_width / 2)  + "," + (padding + chart_height + padding - 10) + ")")
        .style("text-achor", "middle")
        .text("Year");

    // Add y-axis label
    svg.append("text")
        .attr("class", "y-label")
        .attr("transform","rotate(-90)")
        .attr("y", padding / 2)
        .attr("x", 0 - (chart_height / 2) - padding - 70)
        .style("text-achor", "middle")
        .text("Litres per capita");

    // Add title for barchart
    svg.append("text")
        .attr("class", "title")
        .attr("transform", "translate(" + padding + "," + (padding / 2 + 9) +")")
        .text("Alcohol consumption over years (" + country + ")");
}

function updateBarchart(data, country) {
    /**
    This function updates the SVG which contains the barchart. It deletes the
    current barchart and creates a new one with new data.
    */
    d3v5.select("#SVG").remove();
    makeBarChart(data, country);
}

function showInfo(data, country) {
    /**
    This function creates the part where the title, information, sources
    and personal information is stored.
    */

    d3v5.select("#information")
        .append("h3")
        .text("Alcohol consumption");

    d3v5.select("#information")
        .append("p")
        .text("Jikke van den Ende, 10787593")

    d3v5.select("#information")
        .append("p")
        .text("All over the world people drink alcohol. It's often seen as a "
              + "way to relax, socialize or celebrate, but drinking too much "
              + "or drinking as a way of dealing with feelings of anxiety or "
              + "depression has negative consequences (Mental Health America, "
              + "2018). Alcohol also contributes to death and disability "
              + "through accidents and injuries, assault, violence, homicide "
              + "and suicide (OECD, 2017). A lot of people don't realise this "
              + "is a world-wide problem, and the over-all alcohol consumption "
              + "is really high. This visualisation of the world shows the "
              + "the consumption of alcohol for most of the countries for the "
              + "latest available data, for now 2015. By clicking on a country "
              + "where data is available a barchart will appear which shows "
              + "the alcohol consumption over time for a given amount of "
              + "years. For this visualisation alcohol consumption is measured "
              + "in litres per capita (people aged 15 years and older).");

    d3v5.select("#information")
        .append("p")
        .text("Sources: ")
        .append("a")
        .attr("href", "http://www.mentalhealthamerica.net/conditions/alcohol-use-and-abuse-what-you-should-know")
        .html("Mental Health America")
        .append("text")
        .text(", ")
        .append("a")
        .attr("href", "https://data.oecd.org/healthrisk/alcohol-consumption.htm")
        .html("OECD Health Statistics");
}

function createMap(data) {
  /**
  This function creates a map of the world which shows the alcohol consumption
  for most of the countries for the year 2015.
  */

  dataset = createDataDatamap(data)

  Object.keys(dataset).forEach(function(country) {
    dataset[country]["fillKey"] = "DATA AVAILABLE"
  });

  var map = new Datamap({
    element: document.getElementById('container'),
    height: 400,
    width: 900,
    fills: {
        "DATA AVAILABLE": "#ABDDA4",
        defaultFill: "#556e52"
    },
    data: dataset,
    geographyConfig: {
        popupTemplate: function(geo, data) {
          if(dataset[geo.id] !== undefined) {
              return ['<div class="hoverinfo"><strong>',
                    geo.properties.name,
                    '</strong>',
                     ': ' + dataset[geo.id]["alc_con"],
                    '</div>'].join('');
          }
              return ['<div class="hoverinfo"><strong>',
                    geo.properties.name,
                    '</strong>',
                    ': no data available',
                    '</div>'].join('');
        },
        highlightFillColor: function(data) {
          if(data.fillKey) {
            return '#FC8D59';
          }
          return "#556e52"
        },
        highlightBorderColor: function(data) {
          if(data.fillKey) {
            'rgba(250, 15, 160, 0.2)'
          }
        }
    },
    done: function(datamap) {
        datamap.svg.selectAll('.datamaps-subunit').on('click', function(geography) {
            if(data[geography.id] !== undefined){
                updateBarchart(data, geography.id);
            }
        });
    }
  });
  map.legend({defaultFillName: 'NO DATA AVAILABLE:', legendTitle: 'MAP LEGEND'});

}


function createToolTip(svg) {
  /**
  This function creates a Tooltip (default display: not shown) that can contain text.
  */
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

function maxValue(array) {
    /**
    This function transforms the array of strings in an array of floats,
    and returns the highest float in this array.
    */

    float_values = [];
    array.forEach(function(d) {
        p = parseFloat(d);
        float_values.push(p);
    });

    var max_value = 0;

    Object.keys(float_values).forEach(function(key) {
      if(float_values[key] > max_value) {
        max_value = float_values[key];
      }
    });

    return max_value;
}
