/**
Name: Jikke van den Ende
Student number: 10787593

This file contains the content of the script in the scatter.html.
When the page is loaded a graph will be drawn.
*/

function retrieveData() {
    var womenInScience = "http://stats.oecd.org/SDMX-JSON/data/MSTI_PUB/TH_WRXRS.FRA+DEU+KOR+NLD+PRT+GBR/all?startTime=2007&endTime=2015"
    var consConfFirst = "http://stats.oecd.org/SDMX-JSON/data/HH_DASH/FRA+DEU+KOR+NLD+PRT+GBR.COCONF.A/all?startTime=2007&endTime=2015"

    // var consConfSecond = "https://data.mprog.nl/course/10%20Homework/100%20D3%20Scatterplot/datasets/consconf.json"
    // var msti = "https://data.mprog.nl/course/10%20Homework/100%20D3%20Scatterplot/datasets/msti.json"
    // var patents = "https://data.mprog.nl/course/10%20Homework/100%20D3%20Scatterplot/datasets/patents.json"

    var requests = [d3.json(womenInScience), d3.json(consConfFirst)];

    Promise.all(requests).then(function(response) {
         console.log(response);
         dataMSTI = transformResponse(response[0]);
         dataConsConf = transformResponse(response[1]);
         console.log(dataMSTI);
         console.log(dataConsConf);
    }).catch(function(e){
         throw(e);
    });
};

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

                let tempString = string.split(":").slice(0, -1);
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
