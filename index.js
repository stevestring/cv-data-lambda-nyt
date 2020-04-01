const https = require("https");
// const url = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_19-covid-Confirmed.csv';
const url = 'https://raw.githubusercontent.com/nytimes/covid-19-data/master/us-states.csv';

module.exports.handler = (event, context, callback) => {
        let response;
        // To debug your problem
        var usJson = [];
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


              statesJson["unitedstates"]=[];

              for (let i=1;i<inputArray.length;i++)
              {

                stateLineItem = inputArray[i].split(',');
                state = stateLineItem[1].replace(/ /g,'').toLowerCase();
                // statesJson.push (stateLineItem[1]);

                if(!statesJson.hasOwnProperty(state)){
                    statesJson[state]=[];
                }

                statesJson[state].push( {date:stateLineItem[0], confirmed: stateLineItem[3]});
                
                var x = findElement(usJson, "date", stateLineItem[0]);
                if (x===undefined)
                {
                    usJson.push({date:stateLineItem[0], confirmed: stateLineItem[3]});
                } 
                else
                {
                    x.confirmed = parseInt(x.confirmed) + parseInt(stateLineItem[3]);
                }

              }    
              
              statesJson["unitedstates"] = usJson;

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
        
    function findElement(arr, propName, propValue) {
      for (var i=0; i < arr.length; i++)
        if (arr[i][propName] == propValue)
          return arr[i];
    
      // will return undefined if not found; you could return a default instead
    }

};

