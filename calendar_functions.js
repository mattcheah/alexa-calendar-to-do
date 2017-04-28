var request = require('request');

module.exports = {

//Get Today's start - used for finding a do list on today's calendar
  getTodayStart: function() {
      var d = new Date();
      d.setUTCHours(d.getUTCHours()-7);
      var start = new Date(d.getFullYear(), d.getMonth(), d.getUTCDate());
      return module.exports.toTimestamp(start);
  },
  
  
  
  
  // Get Today's end/tomorrow's start. Used for finding a do list on today's calendar
  getTomorrowStart: function() {
      var d = new Date();
      d.setUTCHours(d.getUTCHours()-7);
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
            + pad(d.getUTCSeconds())+'-07:00';
  },
  
  // Returns an array of calendars that the user can write to.
  getAllCalendars: function() {
      return new Promise(function(resolve, reject) {

          var options = {
              url: 'https://www.googleapis.com/calendar/v3/users/me/calendarList?minAccessRole=writer',
              method: 'GET',
              headers: {
                  Authorization: 'Bearer '+global.token,
              }
          };
          
          request(options, function (error, response, body) {
               
              if (error) {
                 reject("Error GETing calendar list data from the Google Calendar API");  
              } else {
                 var ids = [];
                 console.log("successfully made GET request: ", body);

                 var allCalendars = JSON.parse(body).items;
                 for(var i=0; i<allCalendars.length; i++) {
                     ids.push(allCalendars[i].id);
                 }
                 resolve(ids);
              }
          });
       
      });
  },
  
  getTodaysEvents: function(allCalendars) {
       
      var url1 = 'https://www.googleapis.com/calendar/v3/calendars/';
      var url2 = '/events?orderBy=startTime&singleEvents=true&timeMax='+encodeURI(module.exports.getTomorrowStart())+'&timeMin='+encodeURI(module.exports.getTodayStart());
              
      var options = {
          url: "",
          method: 'GET',
          headers: {
              Authorization: 'Bearer '+global.token,
          }
      };
      
      var allDayEvents = [];
      var promisesArray = [];

      // Go through all the calendars and make a request to google to get the events from that calendar. 
      console.log("all calendars: ", allCalendars);
      for (var i = 0; i < allCalendars.length; i++) {
          
          var nestPromise = new Promise((resolve, reject) => {
              options.url = url1+allCalendars[i]+url2; 
              request(options, function (error, response, body) {
               
                  if (error) {
                    reject("Error returning data from the Google Calendar API");  
                  } else {
                     //console.log("successfully made request and returned body: ", body);
                     var events = JSON.parse(body).items;
                     resolve(events);
                  }
              });
           
          });
          
          promisesArray.push(nestPromise);

      }

      return Promise.all(promisesArray)
  },
  
  sortTodaysEvents: function(eventsArray) {
   
      
      
      return new Promise(function(resolve,reject) {
          var events = [];
          //console.log("EventsArray: ",eventsArray);
           console.log("EventsArray: ", eventsArray);
          for(var i = 0; i <eventsArray.length; i++) {
              //console.log("eventsArray["+i+"]: "+JSON.stringify(eventsArray[i]));
              events = events.concat(eventsArray[i]);
          }
          //console.log("events: ", events);
       
          events.sort(function compare(a, b) {
              if (a.start.dateTime < b.start.dateTime) {
                  return -1;
              }
              if (a.start.dateTime > b.start.dateTime) {
                  return 1;
              }
              return 0;
          });
          resolve(events);
      });
  },
  
  getAllDoListItems: function(events) {
      return new Promise(function(resolve,reject) {
       
          var doList = "noDoList";
           console.log("events: ", events);
          for(var i = 0; i < events.length; i++) {
              if (events[i].summary == "Do" || events[i].summary == "do") {
                  console.log("description of do event: "+events[i].description);
                  if (events[i].description) {
                      console.log("events description is something.")
                      doList = events[i].description.split("\n");
                      break;
                  } else {
                      console.log("events description is nothing. ")
                      doList = "emptyDoList";
                      break;
                  }
              }
          }
          console.log("resolving do list: "+doList);
          resolve(doList);
          
      });
  },
  
  getDoListEvent: function(events) {
      return new Promise(function(resolve,reject) {
       
          var doList = "";
          console.log("events: ", events);
          for(var i = 0; i < events.length; i++) {
              if (events[i].summary == "Do" || events[i].summary == "do") {
                  doList = events[i];
              }
          }
          if (doList == "") {
              resolve(0);
          }
          
          resolve(doList);
      });
  },
  
  getDoListItems: function(doList) {
      return new Promise(function(resolve, reject) {
       
          var doneItems = ["done", "--", "complete", "completed", "finished"];
       
          for (var i=0; i<doList.length; i++) {
              if(doneItems.includes(doList[i])) {
                  doList.splice(i);
                  break;
              } else if (doList[i] == "") {
                  doList.splice(i, 1);
                  i--;
              }
          }
          
          resolve(doList);
          
      });
      
  },
  
  insertItemInDoList: function(doList, item) {
      return new Promise(function(resolve,reject) {
          var id = doList.id;
          var calendar = doList.creator.email;
          var doListString = "";
          
          if (doList.description) {
              doList = doList.description.split("\n");
              var doneItems = ["done", "--", "complete", "completed", "finished"];
              
               
              for (var i=0; i<doList.length; i++) {
                  if (doneItems.includes(doList[i])) {
                      doList.splice(i, 0, item);
                      break;
                  } 
              }
              doListString = doList.join("\n"); 
          } else {
              doListString = item;
          }
          
          var url1 = 'https://www.googleapis.com/calendar/v3/calendars/'
          var url2 = '/events/';

          var options = {
              url: (url1 + calendar + url2 + id),
              method: 'PATCH',
              headers: {
                  Authorization: 'Bearer '+global.token,
              },
              body: {
                  description: doListString,
              },
              json:true
          }; 
          
          request(options, function (error, response, body) {
               
              if (error) {
                reject("Error PATCHing data to the Google Calendar API");  
              } else {
                 console.log("successfully made PATCH request");
                 console.log("body: "+body);
                 console.log("response: "+JSON.stringify(response));
                 console.log("error: "+error);
                 
                 resolve();
              }
          });

      });
      
  },
  
  createDoList: function() {
      return new Promise(function(resolve, reject) {
          var url = 'https://www.googleapis.com/calendar/v3/calendars/primary/events/quickAdd?text=Do';

          var options = {
              url: url,
              method: 'POST',
              headers: {
                  Authorization: 'Bearer '+global.token,
              }
          };
          
          request(options, function (error, response, body) {
              if (error) {
                  reject("Error POSTing data to the Google Calendar API");  
              } else {
                  console.log("successfully made POST request to create do list");
                  resolve();
              }
          });
      });
  },
  
  doListToString: function(doList, number) {
      var itemsList = "";
      if(number) {
          var length = number;
      } else {
          var length = doList.length;
      }
      
      for (var i=0;i<length;i++) {
          if (i == length-2) {
              itemsList += (doList[i]+", and ");
          } else {
              itemsList += (doList[i]+", ");
          }
      }
      return itemsList;
  },
  
  eventListToString: function(eventList, number) {
      var itemsList = "";
      if(number) {
          var length = number;
      } else {
          var length = eventList.length;
      }
      
      for (var i=0;i<length;i++) {
          if (i == length-2) {
              itemsList += (eventList[i].summary+", and ");
          } else {
              itemsList += (eventList[i].summary+", ");
          }
      }
      return itemsList;
  },
  
  
  
};