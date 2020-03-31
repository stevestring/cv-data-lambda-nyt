var csv = require('csvtojson');
let fs = require("fs");
let path = require("path");
const https = require("https");
// const url = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_19-covid-Confirmed.csv';
const url = 'https://raw.githubusercontent.com/nytimes/covid-19-data/master/us-states.csv';

module.exports.handler = (event, context, callback) => {
        let response;
        // To debug your problem
        var usJson = {"Province/State":"United States","Country/Region":"US","Lat":"47.4009","Long":"-121.4905","TimeSeries":{"1/22/20":"0","1/23/20":"0","1/24/20":"0","1/25/20":"0","1/26/20":"0","1/27/20":"0"}};
        https.get(url, function(res) {
            var body = '';
        
            res.on('data', function(chunk) {
              body += chunk;
            });
        
            res.on('end', function() {
              var data = body;
              var newString =  data.toString();

              var statesJson = {};

              var inputArray = newString.split('\n');
              // var filteredArray = inputArray.filter(function (rowString) {
              //   return (rowString.split(",")[0] === '"1"');
              // });

              var stateLineItem;  
              var state;
              for (let i=1;i<inputArray.length;i++)
              {

                stateLineItem = inputArray[i].split(',');
                state = stateLineItem[1].replace(/ /g,'').toLowerCase();
                // statesJson.push (stateLineItem[1]);

                if(!statesJson.hasOwnProperty(state)){
                    statesJson[state]=[];
                }

                statesJson[state].push( {date:stateLineItem[0], confirmed: stateLineItem[3]});

              }    

              response = {
                      statusCode: 200,
                      headers: {
                          'Content-Type': 'application/json',
                          'Access-Control-Allow-Origin': '*' 
                      },
                      body: JSON.stringify(statesJson)                   
                      };
              context.succeed(response);
                    
            
    });
    }).on('error', function(err) {
      console.log("Something went wrong");
      console.log(err);
    });
        
        

};

