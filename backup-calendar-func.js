var request = require('request');

module.exports = {

//Get Today's start - used for finding a do list on today's calendar
  getTodayStart: function() {
      var d = new Date();
      var start = new Date(d.getFullYear(), d.getMonth(), d.getDate());
      return module.exports.toTimestamp(start);
  },
  
  
  // Get Today's end/tomorrow's start. Used for finding a do list on today's calendar
  getTomorrowStart: function() {
      var d = new Date();
      d.setDate(d.getDate()+1);
      var start = new Date(d.getFullYear(), d.getMonth(), d.getDate());
      return module.exports.toTimestamp(start);
  },
  
  
  // Change the date generated to RFC 3339 Timestamp for Google Calendar API
  toTimestamp: function(d) {
      function pad(n){return n<10 ? '0'+n : n}
       return d.getUTCFullYear()+'-'
            + pad(d.getUTCMonth()+1)+'-'
            + pad(d.getUTCDate())+'T'
            + pad(d.getUTCHours())+':'
            + pad(d.getUTCMinutes())+':'
            + pad(d.getUTCSeconds())+'Z';
  },
  
  // Returns an array of calendars that the user can write to.
  getAllCalendars: function(callback) {
      var apiResponse = 
      {
       "kind": "calendar#calendarList",
       "etag": "\"p324bnfnpn2ut60g\"",
       "nextSyncToken": "CIi7vvm4vdMCEhRtYXR0LmNoZWFoQGdtYWlsLmNvbQ==",
       "items": [
        {
         "kind": "calendar#calendarListEntry",
         "etag": "\"1427898515542000\"",
         "id": "classydeer@gmail.com",
         "summary": "Classy Deer Schedule",
         "timeZone": "America/Los_Angeles",
         "colorId": "8",
         "backgroundColor": "#272424",
         "foregroundColor": "#ffffff",
         "accessRole": "writer",
         "defaultReminders": [
         ]
        },
        {
         "kind": "calendar#calendarListEntry",
         "etag": "\"1450583798939000\"",
         "id": "matt.cheah@gmail.com",
         "summary": "matt.cheah@gmail.com",
         "timeZone": "America/Los_Angeles",
         "colorId": "15",
         "backgroundColor": "#9fc6e7",
         "foregroundColor": "#000000",
         "selected": true,
         "accessRole": "owner",
         "defaultReminders": [
          {
           "method": "popup",
           "minutes": 10
          }
         ],
         "notificationSettings": {
          "notifications": [
           {
            "type": "eventCreation",
            "method": "email"
           },
           {
            "type": "eventChange",
            "method": "email"
           },
           {
            "type": "eventCancellation",
            "method": "email"
           },
           {
            "type": "eventResponse",
            "method": "email"
           }
          ]
         },
         "primary": true
        },
        {
         "kind": "calendar#calendarListEntry",
         "etag": "\"1478288463090000\"",
         "id": "rstl50tbc18nufacn3p90nksjc@group.calendar.google.com",
         "summary": "Greatest Couples Small Group",
         "timeZone": "America/Los_Angeles",
         "colorId": "4",
         "backgroundColor": "#fa573c",
         "foregroundColor": "#000000",
         "selected": true,
         "accessRole": "reader",
         "defaultReminders": [
         ]
        },
        {
         "kind": "calendar#calendarListEntry",
         "etag": "\"1474485540350000\"",
         "id": "swtmercies@gmail.com",
         "summary": "Becca Cheah",
         "timeZone": "America/Los_Angeles",
         "colorId": "24",
         "backgroundColor": "#a47ae2",
         "foregroundColor": "#000000",
         "selected": true,
         "accessRole": "writer",
         "defaultReminders": [
         ]
        },
        {
         "kind": "calendar#calendarListEntry",
         "etag": "\"1450583799796000\"",
         "id": "#contacts@group.v.calendar.google.com",
         "summary": "Contacts",
         "timeZone": "America/Los_Angeles",
         "colorId": "12",
         "backgroundColor": "#fad165",
         "foregroundColor": "#000000",
         "accessRole": "reader",
         "defaultReminders": [
         ]
        },
        {
         "kind": "calendar#calendarListEntry",
         "etag": "\"1450583798026000\"",
         "id": "en.usa#holiday@group.v.calendar.google.com",
         "summary": "Holidays in United States",
         "timeZone": "America/Los_Angeles",
         "colorId": "9",
         "backgroundColor": "#7bd148",
         "foregroundColor": "#000000",
         "selected": true,
         "accessRole": "reader",
         "defaultReminders": [
         ]
        },
        {
         "kind": "calendar#calendarListEntry",
         "etag": "\"1448923580556000\"",
         "id": "nba_9_%47olden+%53tate+%57arriors#sports@group.v.calendar.google.com",
         "summary": "Golden State Warriors",
         "timeZone": "America/Los_Angeles",
         "colorId": "6",
         "backgroundColor": "#ffad46",
         "foregroundColor": "#000000",
         "selected": true,
         "accessRole": "reader",
         "defaultReminders": [
         ]
        },
        {
         "kind": "calendar#calendarListEntry",
         "etag": "\"1442599135513000\"",
         "id": "nhl_18_%53an+%4aose+%53harks#sports@group.v.calendar.google.com",
         "summary": "San Jose Sharks",
         "timeZone": "America/Los_Angeles",
         "colorId": "7",
         "backgroundColor": "#42d692",
         "foregroundColor": "#000000",
         "selected": true,
         "accessRole": "reader",
         "defaultReminders": [
         ]
        }
       ]
      };       
      var calendars = apiResponse.items;
  
      var ids = [];
      
      for(var i = 0; i < calendars.length; i++) {
          var c = calendars[i];
          if (c.kind == "calendar#calendarListEntry" && (c.accessRole == "writer" || c.accessRole == "owner")) {
              ids.push(c.id);
          }
      }
      
      callback(ids);
  },
  
  getTodaysEvents: function(allCalendars, callback) {
      
      var url1 = 'https://www.googleapis.com/calendar/v3/calendars/';
      var url2 = '/events?orderBy=startTime&singleEvents=true&timeMax='+encodeURI(module.exports.getTomorrowStart())+'&timeMin='+encodeURI(module.exports.getTodayStart());
              
      var options = {
          url: "",
          method: 'GET',
          headers: {
              Authorization: 'Bearer '+global.token,
          }
      };
      
      var eventsArray = [];
      var allDayEvents = [];
      
      // Go through all the calendars and make a request to google to get the events from that calendar. 
      for (var i = 0; i < allCalendars.length; i++) {
       
          options.url = url1+allCalendars[i]+url2;
          request(options, function (error, response, body) {
           
              if (error) {
                reject("Error returning data from the Google Calendar API");  
              } else {
                 console.log("successfully made request and returned body: ", body);
                 var events = JSON.parse(body).items;
                 for(var j = 0; j < events.length; j++) {
                     if (events[j].start.date) {
                         allDayEvents.push(events.splice(j, 1)[0]);
                     } else {
                         eventsArray.push(events.splice(j, 1)[0]);
                     }
                 }
              }
          });
      }
      
      eventsArray.sort(function compare(a, b) {
          if (a.start.dateTime < b.start.dateTime) {
              return -1;
          }
          if (a.start.dateTime > b.start.dateTime) {
              return 1;
          }
          return 0;
      });
      
      callback(eventsArray);
  },
  
  getAllDoListItems: function() {
      var events = getTodaysEvents();
      var doList = "";
      for(var i = 0; i < events.length; i++) {
          if (events[i].summary == "Do" || events[i].summary == "do") {
              doList = events[i].description;
          }
      }
      if (doList == "") {
          return 0;
      }
      return doList.split('\n');
  },
  
  getDoListItems: function() {
      var doList = getAllDoListItems();
      
      var doneListIndex = doList.indexOf("done");
      var dashListIndex = doList.indexOf("--");
      var completeListIndex = doList.indexOf("complete");
      var completedListIndex = doList.indexOf("completed");
  
      var doneIndices = [["done", doneListIndex], ["dash", dashListIndex], ["complete", completeListIndex], ["completed", completedListIndex]];
      var indices = [];
      for(var i = 0; i < doneIndices.length; i++) {
          if (doneIndices[i][1] > -1) {
              indices.push(doneIndices[i]);
          }
      }
  
      indices.sort(function(a,b) {
          return a[1] - b[1];
      }); 
      
      doList.splice(indices[0][1]);
      
      //But eventually get rid of all whitespace too.
      return doList;
      
  }
};