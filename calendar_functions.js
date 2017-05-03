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
                 reject("Error GETting calendar list data from the Google Calendar API");  
              } else {
                 var ids = [];
                 //console.log("successfully made GET request: ", body);

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
     //console.log("all calendars: ", allCalendars);
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
          //console.log("EventsArray: ", eventsArray);
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
          var eventTitles = ["do", , "to-do", "to do", "do list", "todo"];
          var doList = "noDoList";
          //console.log("events: ", events);
          for(var i = 0; i < events.length; i++) {
              if (eventTitles.includes(events[i].summary.toLowerCase())) {
                  //console.log("description of do event: "+events[i].description);
                  if (events[i].description) {
                      //console.log("events description is something.")
                      doList = events[i].description.split("\n");
                      break;
                  } else {
                      //console.log("events description is nothing. ")
                      doList = "emptyDoList";
                      break;
                  }
              }
          }
         //console.log("resolving do list: "+doList);
          resolve(doList);
          
      });
  },
  
  getDoListEvent: function(events) {
      return new Promise(function(resolve,reject) {
          var eventTitles = ["do", , "to-do", "to do", "do list", "todo", "do:"];
          var doList = "";
          //console.log("events: ", events);
          for(var i = 0; i < events.length; i++) {
              if (eventTitles.includes(events[i].summary.toLowerCase())) {
                  doList = events[i];
              }
          }
          
          resolve(doList);
          
      });
  },
  
  getDoListItems: function(doList) {
      return new Promise(function(resolve, reject) {
       
          var doneItems = ["done", "done:", "--", "complete", "completed", "finished"];
          for (var i=0; i<doList.length; i++) {
              if(doneItems.includes(doList[i].toLowerCase())) {
                  doList.splice(i);
                  break;
              } else if (doList[i] == "") {
                  doList.splice(i, 1);
                  i--;
              }
          }
         //console.log("Do list from getDoListItems: "+doList);
          if (doList == "") {
              resolve("emptyDoList");
          } else {
            resolve(doList);
          }
          
      });
      
  },
  
  insertItemInDoList: function(doList, item) {
      return new Promise(function(resolve,reject) {
          var id = doList.id;
          var calendar = doList.creator.email;
          var doListString = "";
          
          if (doList.description) {
              doList = doList.description.split("\n");
              doList.unshift(item);
              doListString = doList.join("\n"); 
          } else {
              doListString = item+"\n\ndone:";
          }
          
         //console.log("DoListString: "+doListString);
          
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
                //console.log("successfully made PATCH request");
                //console.log("body: "+body);
                //console.log("response: "+JSON.stringify(response));
                //console.log("error: "+error);
                 
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
                 //console.log("successfully made POST request to create do list");
                  resolve();
              }
          });
      });
  },
  
  completeItemInList:function(doList, item) {
      return new Promise(function(resolve,reject) {
          var id = doList.id;
          var calendar = doList.creator.email;
          var doListString = "";
          var edited = false;
          
          if (doList.description) {
              var edited = false;
              doList = doList.description.split("\n");
              
              var doneIndex = module.exports.getDoneIndex(doList); 
              if (doneIndex == -1) {
                 doList.push("\n", "done");
                 edited = true;
              }
              

              if (typeof item == "number") {
                  item--;
                  
                  if (item >= doneIndex ) {
                    reject("Item is already marked as done.");                    
                  } else if (typeof doList[item] == "undefined") {
                    reject("There is no list item number "+(item+1)+" on the list.");
                  } else {
                    doList = module.exports.removeEmptyLines(doList);
                    doList.push(doList.splice(item, 1));
                    edited = true;
                  }
                  
              } else {
                console.log("Item is: "+item);
                for(var i = 0; i<doList.length; i++) {
                    if (doList[i].toLowerCase() == item.toLowerCase()) {
                        console.log("Match! "+doList[i].toLowerCase());
                        console.log("Before dolist: "+doList);
                        doList.splice(i, 1);
                        doList.push(item);
                        console.log("After dolist: "+doList);
                        edited = true;
                        break;
                    }
                }
              }
              
              
              if (edited == true) {
                  doListString = doList.join("\n"); 
                 //console.log("Do list string: "+doListString);
              
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
                         //console.log("successfully made PATCH request");
                         //console.log("body: "+body);
                         //console.log("response: "+JSON.stringify(response));
                         //console.log("error: "+error);
                         
                         resolve();
                      }
                  });
              } else {
                  reject("noItemFound");
              }
              
          } else {
              reject("There are no items in your do list.");
          }
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
  
  getDoneIndex: function(doList) {
      var doneItems = ["done", "done:", "--", "complete", "completed", "finished"];
      for(var i = 0; i<doList.length; i++) {
          if (doneItems.includes(doList[i].toLowerCase())) {
              return i;
          }
      }
      return -1;
  },
  
  removeEmptyLines: function(doList) {
      for(var i = 0; i<doList.length; i++) {
          if (doList[i] == "") {
              doList.splice(i, 1);
              i--;
          }
      }
      return doList;
  },
  
  
  
};