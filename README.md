# Alexa - Calendar To-Do
An Alexa Skills app built in Node, used to read and edit a to-do list stored in your google calendar. 
If you keep your to-do list as an event in your calendar, install this skill and ask Alexa to list out your to-do items

## Setting It Up

After adding the skill, you must enable it and link your Google Calendar within the Alexa app. Once you click enable, you will be prompted to enter the email address and password associated with your google calendar.
To start using the app, create an event in your google calendar called "To Do" or "Do", and add your list of tasks, one on each line. 

To represent completed items, add a line that says "Done" or "Completed" and place all completed items underneath this line. When parsing the description, the skill will ignore all items underneath this one. 

## Reading your do list: 

To have Alexa read your list, follow the prompts:

* Alexa, start Calendar Do List
* What's on my do list?

## Adding To Your Do List:

To add something to your list, follow the prompts:

* Alexa, start Calendar Do List
* Add something to my do list. 
* "Do Laundry"

Alexa will often have trouble understanding exactly what you're saying, and will sometimes give you a low chime or prompt you to repeat yourself when it doesn't understand you. 
Try saying a different variation of what you want to add (eg. "Wash my Clothes" instead of "Do Laundry")

## Marking an item as completed. 

To mark something as completed, follow the prompts:

* Alexa, start Calendar Do List
* Mark something as completed
* "Do Laundry"

The same difficulties with recognizing the language applies in this situation, but unfortunately Alexa will not be able to recognize a differently phrased version of your item. 
We recommend a slightly more complicated approach which involves telling Alexa which numbered item you'd like to mark as complete. 

* Alexa, start Calendar Do List
* Mark something as completed
* 3

The following example will demonstrate this.

# Examples

* Alexa, start Calendar Do List

> What would you like to do?

* What's on my do list?

> You have 3 things on your do list: Clean Kitchen, Mow Lawn, and Do Laundry. 

* Mark something as completed

> What would you like to mark as completed?

* "Do Laundry"
or
* "3"

> "Do Laundry has been marked as completed.

* Add something to my do list

> What would you like to add to your do list?

* "Do Laundry"

> Do Laundry has been added to your do list.

## Questions or Comments?

Any concerns can be directed to me at matt.cheah@gmail.com