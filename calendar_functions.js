// Get Today's start - used for finding a do list on today's calendar
function getTodayStart() {
    var d = new Date()
    var start = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    return toTimestamp(start);
}

console.log(getTodayStart());

// Get Today's end/tomorrow's start. Used for finding a do list on today's calendar
function getTomorrowStart() {
    var d = new Date()
    d.setDate(d.getDate()+1);
    var start = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    return toTimestamp(start);
}
console.log(getTomorrowStart());

// Change the date generated to RFC 3339 Timestamp for Google Calendar API
function toTimestamp(d) {
    function pad(n){return n<10 ? '0'+n : n}
     return d.getUTCFullYear()+'-'
          + pad(d.getUTCMonth()+1)+'-'
          + pad(d.getUTCDate())+'T'
          + pad(d.getUTCHours())+':'
          + pad(d.getUTCMinutes())+':'
          + pad(d.getUTCSeconds())+'Z';
}

// Returns an array of calendars that the user can write to.
function getAllCalendars() {
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
    
    return ids;
}

function getTodaysEvents() {
    
    var calendars = getAllCalendars();
    
    for (var i = 0; i < calendars.length; i++) {
        //Do stuff here until all events are in 
    }
//     var apiResponse3 = {
//  "kind": "calendar#events",
//  "etag": "\"p32ocv7cnjuvd60g\"",
//  "summary": "Becca Cheah",
//  "updated": "2017-04-24T23:27:21.262Z",
//  "timeZone": "America/Los_Angeles",
//  "accessRole": "writer",
//  "defaultReminders": [
//  ],
//  "items": [
//   {


//   "kind": "calendar#event",
//   "etag": "\"2984903178754000\"",
//   "id": "k6tgpdd4ttjkam8rf7jtc573fo_20170424T150000Z",
//   "status": "confirmed",
//   "htmlLink": "https://www.google.com/calendar/event?eid=azZ0Z3BkZDR0dGprYW04cmY3anRjNTczZm9fMjAxNzA0MjRUMTUwMDAwWiBzd3RtZXJjaWVzQG0",
//   "created": "2015-04-06T18:21:23.000Z",
//   "updated": "2017-04-17T17:53:09.377Z",
//   "summary": "ULAR",
//   "creator": {
//     "email": "swtmercies@gmail.com",
//     "displayName": "Becca Cheah",
//     "self": true
//   },
//   "organizer": {
//     "email": "swtmercies@gmail.com",
//     "displayName": "Becca Cheah",
//     "self": true
//   },
//   "start": {
//     "dateTime": "2017-04-24T08:00:00-07:00",
//     "timeZone": "America/Los_Angeles"
//   },
//   "end": {
//     "dateTime": "2017-04-24T17:30:00-07:00",
//     "timeZone": "America/Los_Angeles"
//   },
//   "recurringEventId": "k6tgpdd4ttjkam8rf7jtc573fo",
//   "originalStartTime": {
//     "dateTime": "2017-04-24T08:00:00-07:00",
//     "timeZone": "America/Los_Angeles"
//   },
//   "iCalUID": "k6tgpdd4ttjkam8rf7jtc573fo@google.com",
//   "sequence": 0,
//   "reminders": {
//     "useDefault": true
//   }
//   },
//   {


//   "kind": "calendar#event",
//   "etag": "\"2986126467776000\"",
//   "id": "0mj3csqkl30n9jopoed9uvbrf0",
//   "status": "confirmed",
//   "htmlLink": "https://www.google.com/calendar/event?eid=MG1qM2NzcWtsMzBuOWpvcG9lZDl1dmJyZjAgc3d0bWVyY2llc0Bt",
//   "created": "2017-04-17T17:45:37.000Z",
//   "updated": "2017-04-24T19:47:13.888Z",
//   "summary": "30 min lunch",
//   "description": "We still need help with pick ups!\n4/26 - Becca\n4/27 - NEED\n5/3 - Jodi",
//   "creator": {
//     "email": "swtmercies@gmail.com",
//     "displayName": "Becca Cheah",
//     "self": true
//   },
//   "organizer": {
//     "email": "swtmercies@gmail.com",
//     "displayName": "Becca Cheah",
//     "self": true
//   },
//   "start": {
//     "dateTime": "2017-04-24T12:30:00-07:00"
//   },
//   "end": {
//     "dateTime": "2017-04-24T13:00:00-07:00"
//   },
//   "iCalUID": "0mj3csqkl30n9jopoed9uvbrf0@google.com",
//   "sequence": 0,
//   "reminders": {
//     "useDefault": true
//   }
//   },
//   {


//   "kind": "calendar#event",
//   "etag": "\"2985628542504000\"",
//   "id": "3d2u20q74in1gu7nfmekd4p9hg",
//   "status": "confirmed",
//   "htmlLink": "https://www.google.com/calendar/event?eid=M2QydTIwcTc0aW4xZ3U3bmZtZWtkNHA5aGcgc3d0bWVyY2llc0Bt",
//   "created": "2017-04-21T22:37:28.000Z",
//   "updated": "2017-04-21T22:37:51.252Z",
//   "summary": "Interview with Dr. Jennifer Frohlich",
//   "creator": {
//     "email": "swtmercies@gmail.com",
//     "displayName": "Becca Cheah",
//     "self": true
//   },
//   "organizer": {
//     "email": "swtmercies@gmail.com",
//     "displayName": "Becca Cheah",
//     "self": true
//   },
//   "start": {
//     "dateTime": "2017-04-24T13:00:00-07:00"
//   },
//   "end": {
//     "dateTime": "2017-04-24T13:30:00-07:00"
//   },
//   "iCalUID": "3d2u20q74in1gu7nfmekd4p9hg@google.com",
//   "sequence": 0,
//   "reminders": {
//     "useDefault": true
//   }
//   },
//   {


//   "kind": "calendar#event",
//   "etag": "\"2984887662988000\"",
//   "id": "ppdpv1kirp9vudk0c142m99fu0",
//   "status": "confirmed",
//   "htmlLink": "https://www.google.com/calendar/event?eid=cHBkcHYxa2lycDl2dWRrMGMxNDJtOTlmdTAgc3d0bWVyY2llc0Bt",
//   "created": "2017-04-17T15:43:51.000Z",
//   "updated": "2017-04-17T15:43:51.494Z",
//   "summary": "Ribbon Cutting Grand Opening of LF Adoption Center",
//   "creator": {
//     "email": "swtmercies@gmail.com",
//     "displayName": "Becca Cheah",
//     "self": true
//   },
//   "organizer": {
//     "email": "swtmercies@gmail.com",
//     "displayName": "Becca Cheah",
//     "self": true
//   },
//   "start": {
//     "dateTime": "2017-04-24T17:30:00-07:00"
//   },
//   "end": {
//     "dateTime": "2017-04-24T18:30:00-07:00"
//   },
//   "iCalUID": "ppdpv1kirp9vudk0c142m99fu0@google.com",
//   "sequence": 0,
//   "reminders": {
//     "useDefault": true
//   }
//   },
//   {


//   "kind": "calendar#event",
//   "etag": "\"2986152882238000\"",
//   "id": "r49imvrom9qrhjfdm3odk82f9c",
//   "status": "confirmed",
//   "htmlLink": "https://www.google.com/calendar/event?eid=cjQ5aW12cm9tOXFyaGpmZG0zb2RrODJmOWMgc3d0bWVyY2llc0Bt",
//   "created": "2017-04-18T17:29:26.000Z",
//   "updated": "2017-04-24T23:27:21.119Z",
//   "summary": "Do",
//   "description": "",
//   "creator": {
//     "email": "swtmercies@gmail.com",
//     "displayName": "Becca Cheah",
//     "self": true
//   },
//   "organizer": {
//     "email": "swtmercies@gmail.com",
//     "displayName": "Becca Cheah",
//     "self": true
//   },
//   "start": {
//     "dateTime": "2017-04-24T19:00:00-07:00"
//   },
//   "end": {
//     "dateTime": "2017-04-24T20:00:00-07:00"
//   },
//   "iCalUID": "r49imvrom9qrhjfdm3odk82f9c@google.com",
//   "sequence": 2,
//   "reminders": {
//     "useDefault": true
//   }
//   }
//  ]
// };
    var apiResponse1 = {
     "kind": "calendar#events",
     "etag": "\"p33cfj778tqut60g\"",
     "summary": "matt.cheah@gmail.com",
     "updated": "2017-04-24T19:50:57.783Z",
     "timeZone": "America/Los_Angeles",
     "accessRole": "owner",
     "defaultReminders": [
      {
       "method": "popup",
       "minutes": 10
      }
     ],
     "items": [
      {
    
    
       "kind": "calendar#event",
       "etag": "\"2979253021238000\"",
       "id": "ugcmcjucm3cgrqv2n47d1lb538",
       "status": "confirmed",
       "htmlLink": "https://www.google.com/calendar/event?eid=dWdjbWNqdWNtM2NncnF2Mm40N2QxbGI1MzggbWF0dC5jaGVhaEBt",
       "created": "2017-03-16T01:08:30.000Z",
       "updated": "2017-03-16T01:08:30.619Z",
       "summary": "Jury Duty",
       "creator": {
        "email": "matt.cheah@gmail.com",
        "displayName": "Matt Cheah",
        "self": true
       },
       "organizer": {
        "email": "matt.cheah@gmail.com",
        "displayName": "Matt Cheah",
        "self": true
       },
       "start": {
        "date": "2017-04-24"
       },
       "end": {
        "date": "2017-04-25"
       },
       "transparency": "transparent",
       "iCalUID": "ugcmcjucm3cgrqv2n47d1lb538@google.com",
       "sequence": 0,
       "reminders": {
        "useDefault": false,
        "overrides": [
         {
          "method": "popup",
          "minutes": 30
         }
        ]
       }
      },
      {
    
    
       "kind": "calendar#event",
       "etag": "\"2979253603848000\"",
       "id": "e2136dam0i8g918va3ttujnqq0",
       "status": "confirmed",
       "htmlLink": "https://www.google.com/calendar/event?eid=ZTIxMzZkYW0waThnOTE4dmEzdHR1am5xcTAgbWF0dC5jaGVhaEBt",
       "created": "2017-03-16T01:08:38.000Z",
       "updated": "2017-03-16T01:13:21.924Z",
       "summary": "Jury Duty",
       "description": "OC Superior Court\nCentral Justice Center\n700 Civic Center Drive West, 3rd Floor\nSanta Ana, CA 92701\n\nJuror id: 106123609\ngroup 1007",
       "creator": {
        "email": "matt.cheah@gmail.com",
        "displayName": "Matt Cheah",
        "self": true
       },
       "organizer": {
        "email": "matt.cheah@gmail.com",
        "displayName": "Matt Cheah",
        "self": true
       },
       "start": {
        "dateTime": "2017-04-24T07:30:00-07:00"
       },
       "end": {
        "dateTime": "2017-04-24T08:30:00-07:00"
       },
       "iCalUID": "e2136dam0i8g918va3ttujnqq0@google.com",
       "sequence": 0,
       "reminders": {
        "useDefault": true
       }
      },
      {
    
    
       "kind": "calendar#event",
       "etag": "\"2968143047996000\"",
       "id": "s8iucsjumuloubekh0nvrua6js_20170424T213000Z",
       "status": "confirmed",
       "htmlLink": "https://www.google.com/calendar/event?eid=czhpdWNzanVtdWxvdWJla2gwbnZydWE2anNfMjAxNzA0MjRUMjEzMDAwWiBtYXR0LmNoZWFoQG0",
       "created": "2017-01-10T18:05:23.000Z",
       "updated": "2017-01-10T18:05:23.998Z",
       "summary": "Mentor Meeting with Jesse",
       "creator": {
        "email": "matt.cheah@gmail.com",
        "displayName": "Matt Cheah",
        "self": true
       },
       "organizer": {
        "email": "matt.cheah@gmail.com",
        "displayName": "Matt Cheah",
        "self": true
       },
       "start": {
        "dateTime": "2017-04-24T14:30:00-07:00",
        "timeZone": "America/Los_Angeles"
       },
       "end": {
        "dateTime": "2017-04-24T15:30:00-07:00",
        "timeZone": "America/Los_Angeles"
       },
       "recurringEventId": "s8iucsjumuloubekh0nvrua6js",
       "originalStartTime": {
        "dateTime": "2017-04-24T14:30:00-07:00",
        "timeZone": "America/Los_Angeles"
       },
       "iCalUID": "s8iucsjumuloubekh0nvrua6js@google.com",
       "sequence": 0,
       "reminders": {
        "useDefault": true
       }
      }
     ]
    };
    var apiResponse2 = {
 "kind": "calendar#events",
 "etag": "\"p32ocv7cnjuvd60g\"",
 "summary": "Becca Cheah",
 "updated": "2017-04-24T23:27:21.262Z",
 "timeZone": "America/Los_Angeles",
 "accessRole": "writer",
 "defaultReminders": [
 ],
 "items": [
  {


   "kind": "calendar#event",
   "etag": "\"2984903178754000\"",
   "id": "k6tgpdd4ttjkam8rf7jtc573fo_20170424T150000Z",
   "status": "confirmed",
   "htmlLink": "https://www.google.com/calendar/event?eid=azZ0Z3BkZDR0dGprYW04cmY3anRjNTczZm9fMjAxNzA0MjRUMTUwMDAwWiBzd3RtZXJjaWVzQG0",
   "created": "2015-04-06T18:21:23.000Z",
   "updated": "2017-04-17T17:53:09.377Z",
   "summary": "ULAR",
   "creator": {
    "email": "swtmercies@gmail.com",
    "displayName": "Becca Cheah",
    "self": true
   },
   "organizer": {
    "email": "swtmercies@gmail.com",
    "displayName": "Becca Cheah",
    "self": true
   },
   "start": {
    "dateTime": "2017-04-24T08:00:00-07:00",
    "timeZone": "America/Los_Angeles"
   },
   "end": {
    "dateTime": "2017-04-24T17:30:00-07:00",
    "timeZone": "America/Los_Angeles"
   },
   "recurringEventId": "k6tgpdd4ttjkam8rf7jtc573fo",
   "originalStartTime": {
    "dateTime": "2017-04-24T08:00:00-07:00",
    "timeZone": "America/Los_Angeles"
   },
   "iCalUID": "k6tgpdd4ttjkam8rf7jtc573fo@google.com",
   "sequence": 0,
   "reminders": {
    "useDefault": true
   }
  },
  {


   "kind": "calendar#event",
   "etag": "\"2986126467776000\"",
   "id": "0mj3csqkl30n9jopoed9uvbrf0",
   "status": "confirmed",
   "htmlLink": "https://www.google.com/calendar/event?eid=MG1qM2NzcWtsMzBuOWpvcG9lZDl1dmJyZjAgc3d0bWVyY2llc0Bt",
   "created": "2017-04-17T17:45:37.000Z",
   "updated": "2017-04-24T19:47:13.888Z",
   "summary": "30 min lunch",
   "description": "We still need help with pick ups!\n4/26 - Becca\n4/27 - NEED\n5/3 - Jodi",
   "creator": {
    "email": "swtmercies@gmail.com",
    "displayName": "Becca Cheah",
    "self": true
   },
   "organizer": {
    "email": "swtmercies@gmail.com",
    "displayName": "Becca Cheah",
    "self": true
   },
   "start": {
    "dateTime": "2017-04-24T12:30:00-07:00"
   },
   "end": {
    "dateTime": "2017-04-24T13:00:00-07:00"
   },
   "iCalUID": "0mj3csqkl30n9jopoed9uvbrf0@google.com",
   "sequence": 0,
   "reminders": {
    "useDefault": true
   }
  },
  {


   "kind": "calendar#event",
   "etag": "\"2985628542504000\"",
   "id": "3d2u20q74in1gu7nfmekd4p9hg",
   "status": "confirmed",
   "htmlLink": "https://www.google.com/calendar/event?eid=M2QydTIwcTc0aW4xZ3U3bmZtZWtkNHA5aGcgc3d0bWVyY2llc0Bt",
   "created": "2017-04-21T22:37:28.000Z",
   "updated": "2017-04-21T22:37:51.252Z",
   "summary": "Interview with Dr. Jennifer Frohlich",
   "creator": {
    "email": "swtmercies@gmail.com",
    "displayName": "Becca Cheah",
    "self": true
   },
   "organizer": {
    "email": "swtmercies@gmail.com",
    "displayName": "Becca Cheah",
    "self": true
   },
   "start": {
    "dateTime": "2017-04-24T13:00:00-07:00"
   },
   "end": {
    "dateTime": "2017-04-24T13:30:00-07:00"
   },
   "iCalUID": "3d2u20q74in1gu7nfmekd4p9hg@google.com",
   "sequence": 0,
   "reminders": {
    "useDefault": true
   }
  },
  {


   "kind": "calendar#event",
   "etag": "\"2984887662988000\"",
   "id": "ppdpv1kirp9vudk0c142m99fu0",
   "status": "confirmed",
   "htmlLink": "https://www.google.com/calendar/event?eid=cHBkcHYxa2lycDl2dWRrMGMxNDJtOTlmdTAgc3d0bWVyY2llc0Bt",
   "created": "2017-04-17T15:43:51.000Z",
   "updated": "2017-04-17T15:43:51.494Z",
   "summary": "Ribbon Cutting Grand Opening of LF Adoption Center",
   "creator": {
    "email": "swtmercies@gmail.com",
    "displayName": "Becca Cheah",
    "self": true
   },
   "organizer": {
    "email": "swtmercies@gmail.com",
    "displayName": "Becca Cheah",
    "self": true
   },
   "start": {
    "dateTime": "2017-04-24T17:30:00-07:00"
   },
   "end": {
    "dateTime": "2017-04-24T18:30:00-07:00"
   },
   "iCalUID": "ppdpv1kirp9vudk0c142m99fu0@google.com",
   "sequence": 0,
   "reminders": {
    "useDefault": true
   }
  },
  {


   "kind": "calendar#event",
   "etag": "\"2986152882238000\"",
   "id": "r49imvrom9qrhjfdm3odk82f9c",
   "status": "confirmed",
   "htmlLink": "https://www.google.com/calendar/event?eid=cjQ5aW12cm9tOXFyaGpmZG0zb2RrODJmOWMgc3d0bWVyY2llc0Bt",
   "created": "2017-04-18T17:29:26.000Z",
   "updated": "2017-04-24T23:27:21.119Z",
   "summary": "Do",
   "description": "put Binx, Lupe files in purse\nput Chris letter in purse\npack up cat scram to return\nsend pics of mold to Pam\nput Woolly Blanket inside coverlet, put on duvet\nempty shredder\nput away some pine litter in garage\nput up meds basket\ncollect vacuum attachments, pet brushes, put in bathroom cubbies\nput cord sleeves by master tv stand, maybe downstairs tv?\nput What a Girl Wants & S Club 7 CD in itunes\n\n--\ndone \n\ntesty testy test here. \nthere are completed things done here. \n",
   "creator": {
    "email": "swtmercies@gmail.com",
    "displayName": "Becca Cheah",
    "self": true
   },
   "organizer": {
    "email": "swtmercies@gmail.com",
    "displayName": "Becca Cheah",
    "self": true
   },
   "start": {
    "dateTime": "2017-04-24T19:00:00-07:00"
   },
   "end": {
    "dateTime": "2017-04-24T20:00:00-07:00"
   },
   "iCalUID": "r49imvrom9qrhjfdm3odk82f9c@google.com",
   "sequence": 2,
   "reminders": {
    "useDefault": true
   }
  }
 ]
};
    var events1 = apiResponse1.items;
    var events2 = apiResponse2.items;
    var allEvents = events1.concat(events2);
    var allDayEvents = [];
    for(var i = 0; i < allEvents.length; i++) {
        if (allEvents[i].start.date) {
            //console.log("Found an all day event", allEvents[i].summary);
            allDayEvents.push(allEvents.splice(i, 1)[0]);
        } 
    }
    
    // console.log("All events: " + JSON.stringify(allEvents));
    // console.log("All Day Events: " + JSON.stringify(allDayEvents));
    
    allEvents.sort(function compare(a, b) {
        if (a.start.dateTime < b.start.dateTime) {
            return -1;
        }
        if (a.start.dateTime > b.start.dateTime) {
            return 1;
        }

        return 0;
    });
    
    return allEvents;
}

function getAllDoListItems() {
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
}

function getDoListItems() {
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
    
getDoListItems();