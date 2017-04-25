var request = require('request');
var http = require('https');

var getUrl = 'https://www.googleapis.com/calendar/v3/calendars/swtmercies%40gmail.com/events?maxResults=10&orderBy=startTime&singleEvents=true&timeMin=2017-04-23T18%3A31%3A44%2B00%3A00';

var options = {
        host: 'googleapis.com',
        path: '/calendar/v3/swtmercies%40gmail.com/primary/events?maxResults=10&orderBy=startTime&singleEvents=true&timeMin=2017-04-23T18%3A31%3A44%2B00%3A00',
        method: 'GET',
    };

    var req = http.request(options, res => {
        res.setEncoding('utf8');
        var returnData = "";
        console.log("This is the callback?");

        res.on('data', chunk => {
            returnData = returnData + chunk;
        });

        res.on('end', () => {
            // we have now received the raw return data in the returnData variable.
            // We can see it in the log output via:
            // console.log(JSON.stringify(returnData))
            // we may need to parse through it to extract the needed data
            console.log("returnData: "+returnData);

        });

    });
    
    req.end();
    