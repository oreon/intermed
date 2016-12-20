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

Meteor.subscribe('userData')

Meteor.subscribe('Specializations')

//Meteor.subscribe('patientFiles')
//Meteor.subscribe('MyPendingTodos')


PtEncounters = new Mongo.Collection('ptEncounters');