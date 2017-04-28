# Alexa Calendar To-Do
An Alexa Skills app built in Node, used to read and edit a to-do list stored in your google calendar. 
If you keep your to-do list as an event in your calendar, install this skill and ask Alexa to list out your to-do items

## Setting It Up

After adding the skill, you must enable it and link your Google Calendar within the Alexa app. 
To start using the app, create an event in your google calendar called "To Do" or "Do", and add your list of tasks, one on each line. 

To represent completed items, add a line that says "Done" or "Completed" and place all completed items underneath this line. When parsing the description, the skill will ignore all items underneath this one. 

## Reading your do list: 

> Alexa, ask Calendar To Do what's on my do list? 

> what do I have to do today?

## Adding To Your Do List:

> Alexa, start Calendar To Do.
> Add "Do Laundry" to my do list. 
 * If alexa does not recognize what you said, it will ask you what you want to put on the list.
> "Do Laundry"