import moment from 'moment';
require('moment-recur');
import {scriptEnhanced} from '/imports/utils/drugAdminSchedule.js';
 import {findUnits} from '/imports/utils/drugAdminSchedule.js';
//import {itemEndDate} from '/imports/utils/drugAdminSchedule.js';


//var later = require('later');
//import result from 'myfunctional'



Template.Patient.onCreated(function () {
    var self = this;
    self.autorun(function () {
        var id = FlowRouter.getParam('id');
        self.id = id;
        self.subscribe('compPt', id);
        //self.subscribe('Drugs')
        self.subscribe('compAdmissions')
        // self.subscribe('TestResults')
        //self.subscribe('Encounters')
        Session.set('patient', id)
        Session.set('adm', null)
        Session.set('editEncounterForm', false)
        self.subscribe('PtImages', id)
        //console.log(result)
    });
});

Template.Patient.helpers({

    patient: function () {
        return Patients.findOne(FlowRouter.getParam('id'));
    },

    encounters: function () {
        return Encounters.find({ patient: FlowRouter.getParam('id') });
    },

    isAdmitted: function () {
        adm = Admissions.findOne({ patient: FlowRouter.getParam('id') })
        //console.log(adm)
        return !!adm
    },
    images:function(){
        console.log(Images.find().count())
        return Images.find()
    }

})

Template.Patient.events({
    'click .admit': function () {
        //.currentAdmission
        FlowRouter.go('admitPatient', { id: FlowRouter.getParam('id') })
    },
    'click .viewAdmission': function () {
        adm = Admissions.findOne({ patient: FlowRouter.getParam('id') });
        FlowRouter.go('viewAdmission', { id: adm._id })
    },
    'click .encounter': function (event, template) {
        Session.set('editEncounterForm', true)
        //FlowRouter.go('newEncounter', { id: FlowRouter.getParam('id') })
    },
    'click .cancelEditEncounter': function (event, template) {
        Session.set('editEncounterForm', false)
    },

    'click .visit': function (event, template) {
        adm = Admissions.findOne({ patient: FlowRouter.getParam('id') });
        FlowRouter.go('visit', { id: adm._id })
    },
    'click .fa-trash': function () {
        console.log("hi from trash")
        Meteor.call('deleteRecipe', this._id);
    },
    'click .deleteAllergy': function (event, template) {
        event.preventDefault();
        drg = event.currentTarget.name;
        console.log(drg)

        //TODO not working as expected
        Patients.update(
            { "_id": FlowRouter.getParam('id') },
            { "$pull": { "drugAllergies": { "drug": drg } } },
            function (err, res) {
                console.log(err);
                console.log(res);
            }
        );
    }


});


Template.scriptTbl.helpers({

    enhItems:function(script){
        //console.log(script)
        items =  scriptEnhanced(script).items
        //console.log(items)
        return items;
    },
   
    itemSchedule: function (item) {
        return calcSchedule(item);
    },

    rowColorOutdated:function (){
        return this.isCurrent ?  `background:#dfd; color: #888` : 
            `background:#a99; color: #fff`
    }

})

Template.basicWizard.helpers({
    steps: function () {
        return [{
            id: 'script',
            title: 'script',
            schema: ScriptSchema
        }, {
            id: 'labs',
            title: 'Labs And Images',
            schema: LabsAndImagingSchema,
            onSubmit: function (data, wizard) {
                console.log(wizard)
            }
        }]
    }
});


Template.imageView.helpers({
    images: function () {
        console.log(PatientFiles.find().count())
        return PatientFiles.find(); // Where Images is an FS.Collection instance
    }
});