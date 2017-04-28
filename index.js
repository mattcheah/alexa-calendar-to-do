var Alexa = require('alexa-sdk');
//var request = require('request');
//var fs = require('fs');
var calendar = require('calendar_functions');

exports.handler = function(event, context, callback) {
    var alexa = Alexa.handler(event, context);  
    global.token = event.session.user.accessToken;

    alexa.appId = 'amzn1.ask.skill.9f36c0ef-da89-4328-84eb-5ef4b3508db6';
    
    var states = {
        STARTMODE: '_STARTMODE',
        WAITSEEALLINLIST: '_WAITSEEALLINLIST',
        NODOLIST: '_NODOLIST',
        WAITADDITEM: '_WAITADDITEM'
    }
    
    var newSessionHandlers = {
         // This will short-cut any incoming intent or launch requests and route them to this handler.
        'NewSession': function() {
            if (!global.token) {
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
            
            global.alexa = (this);
            
            calendar.getAllCalendars()
            .then(calendar.getTodaysEvents)
            .then(calendar.sortTodaysEvents)
            .then(calendar.getAllDoListItems)
            .then(calendar.getDoListItems)
            .then(function(doList) {

                var myPromise = new Promise(function(resolve,reject) {
                    
                    if( doList == "noDoList" ) {
                        global.alexa.handler.state = states.NODOLIST;
                        global.alexa.emit(':ask', 'You do not have a do list on todays date. Would you like to create one?', 'Say Yes to create a do list on todays calendar, or no to cancel.');
                    } else if ( doList == "emptyDoList") {
                        global.alexa.handler.state = states.WAITADDITEM;
                        global.alexa.emit(':ask', 'You have nothing on your to do list. Would you like to add an item to your do list?', "Say yes to add an item, or no to cancel.");
                    } else if (doList.length > 7) {
                        var length = doList.length;
                        var itemsList = calendar.doListToString(doList, 7);
                        global.alexa.emit(':ask', 'You have '+length+' things on your to-do list. The first 7 are: '+itemsList+'. Would you like to hear the rest?', 'Say yes to hear the rest, or no to cancel.');
                    } else if ( doList.length > 0 ) {
                        var length = doList.length;
                        var itemsList = calendar.doListToString(doList);
                        
                        global.alexa.emit(':tell', 'You have '+length+' things on your to-do list: ' + itemsList);
                    }
                    resolve;
                });
                
                return myPromise;
                
            })
            .catch(function(err) {
                console.log("error here!: "+err);
                global.alexa.emit(':tell', "Skill Error: "+err);
            });
            
            
        },
        'addToDoListIntent': function() {
            
            global.alexa = (this);
            
            var item = event.request.intent.slots.to_do_item.value;
            if (item) {
                // add this item to the description;
                calendar.getAllCalendars()
                .then(calendar.getTodaysEvents)
                .then(calendar.sortTodaysEvents)
                .then(calendar.getDoListEvent)
                .then(function(doList) {
                    return calendar.insertItemInDoList(doList, item);
                })
                .then(function() {
                    console.log("item added from addtodolist intent on startmodehandlers");
                    global.alexa.emit(':tell', item+' has been added to your do list.');
                }).catch(function(err) {
                    global.alexa.emit(':tell', 'Error: '+err);
                });
            } else {
                global.alexa.handler.state = states.WAITADDITEM;
                global.alexa.emit(':ask', 'What would you like to add to your do list?', 'Say a task that you\'d like to add to your calendar do list');
            }
            
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
                Logic to create new do list item;
            */
            this.emit(':tell', 'A new something has been added to your calendar bro.');
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
            
            global.alexa = (this);
            
            calendar.createDoList()
            .then(function() {
                global.alexa.emit(':tell', 'A new do list has been created for you on todays calendar');
            })
            .catch(function(err) {
                console.log("Error: "+err);
                global.alexa.emit(':tell', 'There was an Error: ' + err);
            });
        },
        'noIntent': function() {
            this.emit(':tell', 'Thank you for using calendar do list');
        },
        'Unhandled': function() {
            var message = "Say yes to create a new do list, or no to cancel."
            this.emit(':ask', message, message);
        } 
    });
    
    var waitAddItemHandlers = Alexa.CreateStateHandler(states.WAITADDITEM, {
        'NewSession': function () {
            this.handler.state = '';
            this.emitWithState('NewSession'); 
        },
        'addItem': function() {
            global.alexa = (this);
            
            var item = event.request.intent.slots.to_do_item.value;
            if (item) {
                // add this item to the description;
                calendar.getAllCalendars()
                .then(calendar.getTodaysEvents)
                .then(calendar.sortTodaysEvents)
                .then(calendar.getDoListEvent)
                .then(function(doList) {
                    return calendar.insertItemInDoList(doList, item);
                })
                .then(function() {
                    console.log("item added from yes intent on waitAdditemhandlers");
                    global.alexa.emit(':tell', item+' has been added to your do list.');
                }).catch(function(err) {
                    global.alexa.emit(':tell', 'Error: '+err);
                });
            } else {
                global.alexa.handler.state = states.WAITADDITEM;
                global.alexa.emit(':ask', 'What would you like to add to your do list?', 'Say a task that you\'d like to add to your calendar do list');
            }
        },
        'Unhandled': function() {
            var message = "Say an Item to add to your do list, or say exit, to cancel."
            this.emit(':ask', message, message);
        } 
    });
    
    alexa.registerHandlers(newSessionHandlers, startModeHandlers, waitSeeAllInListHandlers, noDoListHandlers, waitAddItemHandlers);
    alexa.execute();
    
};

