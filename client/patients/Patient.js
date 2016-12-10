

Template.Patient.onCreated(function () {
    var self = this;
    self.autorun(function () {
        var id = FlowRouter.getParam('id');
        self.id = id;
        self.subscribe('compPt', id);
        self.subscribe('Drugs')
        self.subscribe('compAdmissions')
        // self.subscribe('TestResults')
        //self.subscribe('Encounters')
        Session.set('patient', id)
    });
});

Template.Patient.helpers({

    patient: function () {
        return Patients.findOne(FlowRouter.getParam('id'));
    },

    encounters: function () {
        return Encounters.find({ patient: FlowRouter.getParam('id') });
    },

    drugName: (id) => Drugs.findOne({ _id: id }).name,

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
    'click .visit': function (event, template) {
        adm = Admissions.findOne({ patient: FlowRouter.getParam('id') });
        FlowRouter.go('visit', { id: adm._id })
    },
    'click .fa-trash': function () {
        console.log("hi from trash")
        Meteor.call('deleteRecipe', this._id);
    },
    'click .fa-pencil': function (event, template) {
        FlowRouter.go('editPatient', { id: FlowRouter.getParam('id') })
    },

});