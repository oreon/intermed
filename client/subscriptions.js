Meteor.subscribe('Drugs')
//Meteor.subscribe('Patients')
Meteor.subscribe('Scripts')
//Meteor.subscribe('Encounters')



Meteor.subscribe('Facilities')
Meteor.subscribe('ChronicDiseases')
Meteor.subscribe('LabTests')

Meteor.subscribe('Wards')
Meteor.subscribe('Rooms')




PtEncounters = new Mongo.Collection('ptEncounters');