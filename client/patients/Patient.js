import moment from 'moment';
require('moment-recur');
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
        Meteor.subscribe('images')
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
        Patients.update(
            { "_id": FlowRouter.getParam('id') },
            { "$pull": { "drugAllergies": { "drug": drg } } },
            function (success) {
                console.log(error);
            },
            function (error) {
                console.log(error);
            }
        );
    }


});


export function calcHours(type) {
    hrs = 1;
    if (type === 'Day')
        hrs = 24;
    if (type === 'Week')
        hrs = 24 * 7;
    if (type === 'Month')
        hrs = 24 * 7 * 30;
    return hrs;
}

export function findUnits(item) {
    let durationHrs = item.duration.for * calcHours(item.duration.type)
    //console.log(durationHrs)
    let oncePerX = calcHours(item.frequency.type) / item.frequency.every

    return durationHrs / oncePerX
}


Template.scriptTbl.helpers({

    endDate: function (item) {
        //TODO calculate duration from the actual start date  
        dt = new moment().add(item.duration.for, item.duration.type.toLowerCase());
        return dt.format('D MMM YY hh:mm a')
    },
    unitsNeeded: function (item) {
        return findUnits(item)
    },
    calcSchedule: function (item) {
        total = findUnits(item)
        listRetDates = []
        let oncePerX = calcHours(item.frequency.type) / item.frequency.every

        for (j = 0; j < total; j++) {
            let occurence = new moment().add(oncePerX * j, 'hour')
            listRetDates.push(occurence.format('D MMM YY hh:mm'))
        }//

        // var s = later.parse.text('every ' + oncePerX + "  hours");
        // occurences = later.schedule(s).next(total);
        console.log(listRetDates)

        return listRetDates;
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