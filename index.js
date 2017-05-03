var Alexa = require('alexa-sdk');
//var request = require('request');
//var fs = require('fs');
var calendar = require('calendar_functions');
var ua = require('universal-analytics');

exports.handler = function(event, context, callback) {
    var alexa = Alexa.handler(event, context);  
    global.token = event.session.user.accessToken;
    alexa.appId = 'amzn1.ask.skill.9f36c0ef-da89-4328-84eb-5ef4b3508db6';
    
    var analytics = ua('UA-98415344-2');
    
    var states = {
        NODOLIST: '_NODOLIST',
        WAITADDITEM: '_WAITADDITEM',
        WAITMARKITEMCOMPLETED: '_WAITMARKITEMCOMPLETED'
    }
    
    var newSessionHandlers = {
        
        // 'NewSession': function() {
        //     if (!global.token) {
        //         //console.log("access token does not exist");
        //         this.emit(':tellWithLinkAccountCard', 'You do not have a google calendar linked. Please go to the Calendar Do List skill in your amazon mobile app and link to your google account.');
        //     } else {
        //         this.handler.state = '';
        //         this.emit(':ask', 'What would you like to do?', 'Ask What do I have to do today or add something to my do list.');
        //     } 
        // },
        'peekDoListIntent': function() {
            if (!global.token) {
                //console.log("access token does not exist");
                analytics.event("Error", "Account Not Linked", "peekDoListIntent from newSessionHandlers").send();
                this.emit(':tellWithLinkAccountCard', 'You do not have a google calendar linked. Please go to the Calendar Do List skill in your amazon mobile app and link to your google account.');
            } else {
                global.alexa = (this);
                    
                calendar.getAllCalendars()
                .then(calendar.getTodaysEvents)
                .then(calendar.sortTodaysEvents)
                .then(calendar.getAllDoListItems)
                .then(calendar.getDoListItems)
                .then(function(doList) {
        
                    var myPromise = new Promise(function(resolve,reject) {
                        
                        if( doList == "noDoList" ) {
                            analytics.event("Prompt", "No Do List", "peekDoListIntent from newSessionHandlers").send();
                            
                            global.alexa.handler.state = states.NODOLIST;
                            global.alexa.emit(':ask', 'You do not have a do list on todays date. Would you like to create one?', 'Say Yes to create a do list on todays calendar, or no to cancel.');
                        } else if ( doList == "emptyDoList") {
                            analytics.event("Prompt", "Nothing On Do List", "peekDoListIntent from newSessionHandlers").send();
                            
                            global.alexa.handler.state = states.WAITADDITEM;
                            global.alexa.emit(':ask', 'You have nothing on your to do list. Would you like to add an item to your do list?', "Say yes to add an item, or no to cancel.");
                        } else if (doList.length > 7) {
                            analytics.event("Response", "Reading Do List", "peekDoListIntent from newSessionHandlers").send();
                            var length = doList.length;
                            var itemsList = calendar.doListToString(doList, 7);
                            global.alexa.emit(':ask', 'You have '+length+' things on your to-do list. The first 7 are: '+itemsList+'. What would you like to do?', 'Ask What do I have to do today or add something to my do list.');
                        } else if ( doList.length > 0 ) {
                            analytics.event("Response", "Reading Do List", "peekDoListIntent from newSessionHandlers").send();
                            var length = doList.length;
                            var itemsList = calendar.doListToString(doList);
                            
                            global.alexa.emit(':ask', 'You have '+length+' things on your to-do list: ' + itemsList+'. What would you like to do?', 'Ask What do I have to do today or add something to my do list.');
                        }
                        resolve;
                    });
                    
                    return myPromise;
                    
                })
                .catch(function(err) {
                    //console.log("error here!: "+err);
                    analytics.event("Error", err, "peekDoListIntent from newSessionHandlers").send();
                    global.alexa.emit(':tell', "Skill Error: "+err);
                });
            }
        },
        'addToDoListIntent': function() {
            if (!global.token) {
                //console.log("access token does not exist");
                analytics.event("Error", "Account Not Linked", "addToDoListIntent from newSessionHandlers").send();
                this.emit(':tellWithLinkAccountCard', 'You do not have a google calendar linked. Please go to the Calendar Do List skill in your amazon mobile app and link to your google account.');
            } else {
                
                global.alexa = (this);
                
                calendar.getAllCalendars()
                .then(calendar.getTodaysEvents)
                .then(calendar.sortTodaysEvents)
                .then(calendar.getAllDoListItems)
                .then(calendar.getDoListItems)
                .then(function(doList) {
        
                    var myPromise = new Promise(function(resolve,reject) {
                        
                        if( doList == "noDoList" ) {
                            analytics.event("Prompt", "No Do List", "addToDoListIntent from newSessionHandlers").send();

                            global.alexa.handler.state = states.NODOLIST;
                            global.alexa.emit(':ask', 'You do not have a do list on todays date. Would you like to create one?', 'Say Yes to create a do list on todays calendar, or no to cancel.');
                        } else {
                            analytics.event("Prompt", "What to add to do List?", "addToDoListIntent from newSessionHandlers").send();
                            global.alexa.handler.state = states.WAITADDITEM;
                            global.alexa.emit(':ask', 'What would you like to add to your do list?', 'Say a task that you\'d like to add to your calendar do list');
                        }
                        resolve;
                    });
                    
                    return myPromise;
                    
                })
                .catch(function(err) {
                    //console.log("error here!: "+err);
                    analytics.event("Error", err, "addToDoListIntent from newSessionHandlers").send();
                    global.alexa.emit(':tell', "Skill Error: "+err);
                });
            }
        },
        'completeDoListIntent': function() {
            if (!global.token) {
                //console.log("access token does not exist");
                analytics.event("Error", "Account Not Linked", "completeDoListIntent from newSessionHandlers").send();
                this.emit(':tellWithLinkAccountCard', 'You do not have a google calendar linked. Please go to the Calendar Do List skill in your amazon mobile app and link to your google account.');
            } else {
                global.alexa = (this);
                    
                calendar.getAllCalendars()
                .then(calendar.getTodaysEvents)
                .then(calendar.sortTodaysEvents)
                .then(calendar.getAllDoListItems)
                .then(calendar.getDoListItems)
                .then(function(doList) {
        
                    var myPromise = new Promise(function(resolve,reject) {
                        
                        if( doList == "noDoList" ) {
                            analytics.event("Prompt", "No Do List", "completeDoListIntent from newSessionHandlers").send();
                            
                            global.alexa.handler.state = states.NODOLIST;
                            global.alexa.emit(':ask', 'You do not have a do list on todays date. Would you like to create one?', 'Say Yes to create a do list on todays calendar, or no to cancel.');
                        } else if ( doList == "emptyDoList") {
                            analytics.event("Prompt", "Nothing On Do List", "completeDoListIntent from newSessionHandlers").send();
                            
                            global.alexa.handler.state = states.WAITADDITEM;
                            global.alexa.emit(':ask', 'You have nothing on your to do list. Would you like to add an item to your do list instead?', "Say yes to add an item, or no to cancel.");
                        } else {
                            analytics.event("Prompt", "What to Mark Complete?", "completeDoListIntent from newSessionHandlers").send();
                            
                            global.alexa.handler.state = states.WAITMARKITEMCOMPLETED;
                            global.alexa.emit(':ask', 'What would you like to mark as completed?', 'Say a task that you\'d like to mark completed on your do list');
                        }
                        resolve;
                    });
                    
                    return myPromise;
                    
                })
                .catch(function(err) {
                    //console.log("error here!: "+err);
                    
                    analytics.event("Error", err, "completeDoListIntent from newSessionHandlers").send();
                    global.alexa.emit(':tell', "Skill Error: "+err);
                });
                
            }
        },
        'AMAZON.HelpIntent': function() {
            if (!global.token) {
                //console.log("access token does not exist");
                analytics.event("Error", "Account Not Linked", "AMAZON.HelpIntent from newSessionHandlers").send();
                this.emit(':tellWithLinkAccountCard', 'You do not have a google calendar linked. Please go to the Calendar Do List skill in your amazon mobile app and link to your google account.');
            } else {
                analytics.event("Response", "Help Response", "AMAZON.HelpIntent from newSessionHandlers").send();
                var message = 'Ask whats on my do list or add something to my do list.'
                this.emit(':ask', message, message);
            }
        },
        'AMAZON.CancelIntent': function() {
            analytics.event("Response", "EndSession", "AMAZON.CancelIntent from newSessionHandlers").send();
            this.emit(':tell', 'Thank you for using calendar do list');
        },
        'AMAZON.StopIntent': function() {
            analytics.event("Response", "EndSession", "AMAZON.StopIntent from newSessionHandlers").send();
            this.emit(':tell', 'Thank you for using calendar do list');
        },
        'Unhandled': function() {
            if (!global.token) {
                //console.log("access token does not exist");
                analytics.event("Error", "Account Not Linked", "Unhandled from newSessionHandlers").send();
                this.emit(':tellWithLinkAccountCard', 'You do not have a google calendar linked. Please go to the Calendar Do List skill in your amazon mobile app and link to your google account.');
            } else {
                analytics.event("Prompt", "What to do?", "Unhandled from newSessionHandlers").send();
                 
                this.handler.state = states.STARTMODE;
                this.emit(':ask', 'What would you like to do?', 'Ask What do I have to do today or add something to my do list.');
            } 
            //this.emit(':ask', 'Ask What do I have to do today or add something to my do list.', 'Ask What do I have to do today or add something to my do list.');
        }
        
    };
    
    
    var noDoListHandlers = Alexa.CreateStateHandler(states.NODOLIST, {
        // Equivalent to the Start Mode NewSession handler
        'NewSession': function () {
            analytics.event("Response", "Restart Session", "NewSession from noDoListHandlers").send();
            this.handler.state = states.STARTMODE;
            this.emitWithState('NewSession'); 
        },
        'AMAZON.YesIntent': function() {
            
            global.alexa = (this);
            global.alexa.handler.state = '';
            
            calendar.createDoList()
            .then(function() {
                analytics.event("Response", "Do List Created", "AMAZON.YesIntent from noDoListHandlers").send();
                
                global.alexa.handler.state = states.WAITADDITEM;
                global.alexa.emit(':ask', 'A new do list has been created for you on todays calendar. What would you like to add to your do list?', 'Say a task that you\'d like to add to your calendar do list, or say cancel.');
            })
            .catch(function(err) {
                //console.log("Error: "+err);
                analytics.event("Error", err, "AMAZON.YesIntent from noDoListHandlers").send();
                global.alexa.emit(':tell', 'There was an Error: ' + err);
            });
        },
        'AMAZON.NoIntent': function() {
            analytics.event("Response", "EndSession", "AMAZON.NoIntent from noDoListHandlers").send();
            this.emit(':tell', 'Thank you for using calendar do list');
        },
        'AMAZON.CancelIntent': function() {
            analytics.event("Response", "EndSession", "AMAZON.CancelIntent from noDoListHandlers").send();
            this.emit(':tell', 'Thank you for using calendar do list');
        },
        'AMAZON.StopIntent': function() {
            analytics.event("Response", "EndSession", "AMAZON.StopIntent from noDoListHandlers").send();
            this.emit(':tell', 'Thank you for using calendar do list');
        },
        'AMAZON.HelpIntent': function() {
            analytics.event("Response", "Help Response", "AMAZON.HelpIntent from noDoListHandlers").send();
            var message = 'Say yes to create a new do list, or no to cancel.'
            this.emit(':ask', message, message);
        },
        'Unhandled': function() {
            analytics.event("Prompt", "What to do?", "Unhandled from noDoListHandlers").send();
            
            var message = "Say yes to create a new do list, or no to cancel."
            this.emit(':ask', message, message);
        } 
    });
    
    var waitAddItemHandlers = Alexa.CreateStateHandler(states.WAITADDITEM, {
        'NewSession': function () {
            analytics.event("Response", "Restart Session", "NewSession from waitAddItemHandlers").send();
            
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
                    analytics.event("Response", "Item Added", "addItem from waitAddItemHandlers").send();
                    
                    //console.log("item added from yes intent on waitAdditemhandlers");
                    global.alexa.emit(':ask', item+' has been added to your do list. Would you like to add something else?', 'What would you like to add to your do list?');
                }).catch(function(err) {
                    analytics.event("Error", err, "addItem from waitAddItemHandlers").send();
                    global.alexa.emit(':tell', 'Error: '+err);
                });
            } else {
                analytics.event("Prompt", "What to Add?", "addItem from waitAddItemHandlers").send();
                global.alexa.emit(':ask', 'What would you like to add to your do list?', 'Say a task that you\'d like to add to your calendar do list');
            }
        },
        'AMAZON.YesIntent': function() {
            analytics.event("Prompt", "What to Add?", "AMAZON.NoIntent from waitAddItemHandlers").send();
            this.emit(':ask', 'What would you like to add to your do list?', 'Say a task that you\'d like to add to your calendar do list');
        },
        'AMAZON.NoIntent': function() {
            analytics.event("Response", "EndSession", "AMAZON.YesIntent from waitAddItemHandlers").send();
            this.emit(':tell', 'Thank you for using calendar do list');
        },
        'AMAZON.CancelIntent': function() {
            analytics.event("Response", "EndSession", "AMAZON.CancelIntent from waitAddItemHandlers").send();
            this.emit(':tell', 'Thank you for using calendar do list');
        },
        'AMAZON.StopIntent': function() {
            analytics.event("Response", "EndSession", "AMAZON.StopIntent from waitAddItemHandlers").send();
            this.emit(':tell', 'Thank you for using calendar do list');
        },
        'AMAZON.HelpIntent': function() {
            analytics.event("Response", "Help Response", "AMAZON.HelpIntent from waitAddItemHandlers").send();
            var message = 'Say an Item to add to your do list, or say exit, to cancel.'
            this.emit(':ask', message, message);
        },
        'Unhandled': function() {
            analytics.event("Prompt", "What to Add?", "Unhandled from waitAddItemHandlers").send();
            var message = "Say an Item to add to your do list, or say exit, to cancel."
            this.emit(':ask', message, message);
        } 
    });
    
    var waitMarkItemCompletedHandlers = Alexa.CreateStateHandler(states.WAITMARKITEMCOMPLETED, {
        'NewSession': function () {
            analytics.event("Response", "Restart Session", "NewSession from waitMarkItemCompletedHandlers").send();
            this.handler.state = '';
            this.emitWithState('NewSession'); 
        },
        'addItem': function() {
            global.alexa = (this);
            var item = event.request.intent.slots.to_do_item.value || parseInt(event.request.intent.slots["AMAZON.NUMBER"].value)
            console.log("item: "+item );
            
            if (item) {
                // add this item to the description;
                calendar.getAllCalendars()
                .then(calendar.getTodaysEvents)
                .then(calendar.sortTodaysEvents)
                .then(calendar.getDoListEvent)
                .then(function(doList) {
                    return calendar.completeItemInList(doList, item);
                })
                .then(function() {
                    //console.log("Item marked completed in do list from startmode");
                    //global.alexa.handler.state = states.STARTMODE;
                    if (typeof item == "number") {
                        analytics.event("Response", "Item Number Marked Complete", "addItem from waitMarkItemCompletedHandlers").send();
                        global.alexa.emit(':ask', 'Item number '+item+' has been marked as complete. Would you like to mark another item as complete?', 'Say an item or number in the list that you would like to mark as complete.');
                    } else {
                        analytics.event("Response", "Item Marked Complete", "addItem from waitMarkItemCompletedHandlers").send();
                        global.alexa.emit(':ask', item+' has been marked as complete, would you like to mark another item as complete?', 'Say an item or number in the list that you would like to mark as complete.');
                    }
                }).catch(function(err) {
                    if (err == "noItemFound") {
                        analytics.event("Prompt", "What to Complete?", "addItem from waitMarkItemCompletedHandlers").send();
                        var message = "I didn\'t get that. What would you like to mark as completed?"
                        global.alexa.emit(':ask', message, message);
                    } else {
                        analytics.event("Error", err, "addItem from waitMarkItemCompletedHandlers").send();
                        global.alexa.emit(':tell', 'Error: '+err);
                    }
                });
            } else {
                analytics.event("Prompt", "What to Complete?", "addItem from waitMarkItemCompletedHandlers").send();
                global.alexa.emit(':ask', 'What item would you like to mark as complete?', 'Say an item or number in the list that you would like to mark as complete.');
            }
        },
        'completeItem': function() {
            global.alexa = (this);
            var item = event.request.intent.slots.to_complete_item.value || parseInt(event.request.intent.slots["AMAZON.NUMBER"].value)
            console.log("item: "+item );
            
            if (item) {
                // add this item to the description;
                calendar.getAllCalendars()
                .then(calendar.getTodaysEvents)
                .then(calendar.sortTodaysEvents)
                .then(calendar.getDoListEvent)
                .then(function(doList) {
                    return calendar.completeItemInList(doList, item);
                })
                .then(function() {
                    //console.log("Item marked completed in do list from startmode");
                    //global.alexa.handler.state = states.STARTMODE;
                    if (typeof item == "number") {
                        analytics.event("Response", "Item Number Marked Complete", "completeItem from waitMarkItemCompletedHandlers").send();
                        global.alexa.emit(':ask', 'Item number '+item+' has been marked as complete. Would you like to mark another item as complete?', 'Say an item or number in the list that you would like to mark as complete.');
                    } else {
                        analytics.event("Response", "Item Marked Complete", "completeItem from waitMarkItemCompletedHandlers").send();
                        global.alexa.emit(':ask', item+' has been marked as complete, would you like to mark another item as complete?', 'Say an item or number in the list that you would like to mark as complete.');
                    }
                }).catch(function(err) {
                    if (err == "noItemFound") {
                        analytics.event("Prompt", "What to Complete?", "completeItem from waitMarkItemCompletedHandlers").send();
                        var message = "I didn\'t get that. What would you like to mark as completed?"
                        global.alexa.emit(':ask', message, message);
                    } else {
                        analytics.event("Error", err, "completeItem from waitMarkItemCompletedHandlers").send();
                        global.alexa.emit(':tell', 'Error: '+err);
                    }
                });
            } else {
                analytics.event("Prompt", "What to Complete?", "completeItem from waitMarkItemCompletedHandlers").send();
                global.alexa.emit(':ask', 'What item would you like to mark as complete?', 'Say an item or number in the list that you would like to mark as complete.');
            }
        },
        'AMAZON.YesIntent': function() {
            analytics.event("Prompt", "What to Complete?", "AMAZON.YesIntent from waitMarkItemCompletedHandlers").send();
            this.emit(':ask', 'What item would you like to mark as complete?', 'Say an item or number in the list that you would like to mark as complete.');
        },
        'AMAZON.NoIntent': function() {
            analytics.event("Response", "EndSession", "AMAZON.NoIntent from waitMarkItemCompletedHandlers").send();
            this.emit(':tell', 'Thank you for using calendar do list');
        },
        'AMAZON.CancelIntent': function() {
            analytics.event("Response", "EndSession", "AMAZON.CancelIntent from waitMarkItemCompletedHandlers").send();
            this.emit(':tell', 'Thank you for using calendar do list');
        },
        'AMAZON.StopIntent': function() {
            analytics.event("Response", "EndSession", "AMAZON.StopIntent from waitMarkItemCompletedHandlers").send();
            this.emit(':tell', 'Thank you for using calendar do list');
        },
        'AMAZON.HelpIntent': function() {
            analytics.event("Response", "Help Response", "AMAZON.HelpIntent from waitMarkItemCompletedHandlers").send();
            var message = 'Say an item or list number to mark as complete, or say exit, to cancel.'
            this.emit(':ask', message, message);
        },
        'Unhandled': function() {
            if (event.request.intent.name == "addItem") {
                
                global.alexa = (this);
                var itemsList;
                
                calendar.getAllCalendars()
                .then(calendar.getTodaysEvents)
                .then(calendar.sortTodaysEvents)
                .then(calendar.getAllDoListItems)
                .then(calendar.getDoListItems)
                .then(function(doList) {
        
                    var myPromise = new Promise(function(resolve,reject) {

                        if (doList.length > 7) {
                            itemsList = "The first 7 items on your list are " + calendar.doListToString(doList, 7) + ". Which one would you like to mark as complete?";
                        } else if ( doList.length > 0 ) {
                            itemsList = "Your do list has " + calendar.doListToString(doList, 7) + ". Which one would you like to mark as complete?";
                        }
                        resolve;
                    });
                    
                    return myPromise;
                    
                })
                .catch(function(err) {
                    //console.log("error here!: "+err);
                    analytics.event("Error", err, "Unhandled from waitAddItemHandlers").send();
                    global.alexa.emit(':tell', "Skill Error: "+err);
                });
                
                analytics.event("Prompt", "Say Number", "Unhandled from waitAddItemHandlers").send();
                this.emit(':ask', 'I am having trouble recognizing your intent. You can choose an item to mark as complete by saying the its number in the list. ' + itemsList, 'Say a number in the list that you would like to mark as complete.');
            } else {
                analytics.event("Prompt", "What to Complete?", "Unhandled from waitAddItemHandlers").send();
                var message = "Say an item or list number to mark as complete, or say exit, to cancel."
                this.emit(':ask', message, message);
            }
        } 
        
    });
    
    alexa.registerHandlers(newSessionHandlers, noDoListHandlers, waitAddItemHandlers, waitMarkItemCompletedHandlers);
    alexa.execute();
};

