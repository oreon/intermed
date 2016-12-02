Meteor.subscribe('Drugs')
Meteor.subscribe('Patients')
Meteor.subscribe('Scripts')
//Meteor.subscribe('Encounters')

Meteor.subscribe('Services')

Meteor.subscribe('Facilities')
Meteor.subscribe('ChronicDiseases')
Meteor.subscribe('LabTests')

Meteor.subscribe('Wards')
Meteor.subscribe('Rooms')
Meteor.subscribe('Beds')


Meteor.subscribe('Admissions')
Meteor.subscribe('ScriptTemplates')


PtEncounters = new Mongo.Collection('ptEncounters');