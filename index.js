var Alexa = require('alexa-sdk');
var request = require('request');
var http = require('https');
var fs = require('fs');

require('calendar_functions');

exports.handler = function(event, context, callback) {
    var alexa = Alexa.handler(event, context);  
    var token = event.session.user.accessToken;
    alexa.appId = 'amzn1.ask.skill.9f36c0ef-da89-4328-84eb-5ef4b3508db6';
    
    var states = {
        STARTMODE: '_STARTMODE',
        WAITSEEALLINLIST: '_WAITSEEALLINLIST',
        NODOLIST: '_NODOLIST',
    }
    
    var newSessionHandlers = {
         // This will short-cut any incoming intent or launch requests and route them to this handler.
        'NewSession': function() {
            if (!token) {
                console.log("access token does not exist");
                this.emit(':tell', 'You do not have a google calendar linked. Please go to the Calendar Do List skill in your amazon mobile app and link to your google account.');
            } else {
                this.handler.state = states.STARTMODE;
                this.emit(':ask', 'Thank you for using Calender Do List. What would you like to do?', 'Ask What do I have to do today or add something to my do list.');
            }
        }
    };
    
    var startModeHandlers = Alexa.CreateStateHandler(states.STARTMODE, {
        
        // Equivalent to the Start Mode NewSession handler
        'NewSession': function() {
            
            this.handler.state = '';
            this.emitWithState('NewSession'); 
        },
        'peekDoListIntent': function() {
            
            //Take a look at the first few items on the do list.
            var doList = [];
            
            
            console.log("Before requests");
            var getUrl = 'https://www.googleapis.com/calendar/v3/calendars/primary/events?maxResults=10&orderBy=startTime&singleEvents=true&timeMin=2017-04-23T18%3A31%3A44%2B00%3A00';
            
            var options = {
                url: getUrl,
                method: 'GET',
                headers: {
                    Authorization: 'Bearer '+token,
                }
            };
            
            let myPromise = new Promise((resolve,reject) => {
                request(options, function (error, response, body) {
                    console.log('error:', error);  
                    console.log('statusCode:', response && response.statusCode);  
                    console.log('body:', body);  
                    resolve("this is done!");
                });
            });
            
            myPromise.then((successMessage) => {
                console.log("successMessage: "+successMessage); 
                if( doList.length > 4 ) {
                    this.handler.state = states.WAITSEEALLINLIST;
                    this.emit(':ask', 'You have 8 things on your to-do list. The first 3 are: Wash Dishes, Clean Shower, and Cook Lunches. Would you like to hear the rest?', "Say yes to hear the rest, or no to cancel.");
                } else if ( doList.length > 0 ) {
                    this.emit(':tell', 'You have 4 things on your to-do list: Wash Dishes, Clean Shower, vacuum, and Cook Lunches.');
                } else {
                    this.handler.state = states.NODOLIST;
                    this.emit(':ask', 'You do not have a do list on todays date. Would you like to create one?', 'Say Yes to create a do list on todays calendar, or no to cancel.');
                }
            });
            
            
        },
        'allDoListIntent': function() {
            //Take a look at all the items on the do list.
            var doList = [];
            /*
                Logic for getting do list from calendar.
            */
            this.emit(':tell', 'You have 4 things on your to-do list: Wash Dishes, Clean Shower, vacuum, and Cook Lunches.');

        },
        'addToDoListIntent': function() {
            this.emit(':tell', 'Something has been added to your do list.');
        },
        'completeDoListIntent': function() {
            this.emit(':tell', 'Something has been completed on your do list.');
        },
        'HelpIntent': function() {
            this.emit(':tell', 'Ask What do I have to do today or add something to my do list.');
        },
        'Unhandled': function() {
            this.emit(':ask', 'Ask What do I have to do today or add something to my do list.', 'Ask What do I have to do today or add something to my do list.');
        }
        
    });
    
    var waitSeeAllInListHandlers = Alexa.CreateStateHandler(states.WAITSEEALLINLIST, {
        // Equivalent to the Start Mode NewSession handler
        'NewSession': function () {
            this.handler.state = '';
            this.emitWithState('NewSession'); 
        },
        'yesIntent': function() {
            /* 
                Logic to create new do list on calendar
            */
            this.emit(':tell', 'Take Dog for a walk, put medication on the cat, call your mom, play video games, and bother becca.');
        },
        'noIntent': function() {
            this.emit(':tell', 'Thank you for using calendar do list');
        },
        'Unhandled': function() {
            var message = "Say yes to hear the rest of your items on the to do list, or no to cancel. "
            this.emit(':ask', message, message);
        }
    });
    
    var noDoListHandlers = Alexa.CreateStateHandler(states.NODOLIST, {
        // Equivalent to the Start Mode NewSession handler
        'NewSession': function () {
            this.handler.state = '';
            this.emitWithState('NewSession'); 
        },
        'yesIntent': function() {
            /* 
                Logic to create new do list on calendar
            */
            this.emit(':tell', 'A new do list has been created for you on todays calendar');
        },
        'noIntent': function() {
            this.emit(':tell', 'Thank you for using calendar do list');
        },
        'Unhandled': function() {
            var message = "Say yes to create a new do list, or no to cancel."
            this.emit(':ask', message, message);
        } 
    });
    
    alexa.registerHandlers(newSessionHandlers, startModeHandlers, waitSeeAllInListHandlers, noDoListHandlers);
    alexa.execute();
};