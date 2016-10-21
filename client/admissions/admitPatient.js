Template.AdmitPatient.onCreated(function () {
    var self = this;
    self.autorun(function () {
        var id = FlowRouter.getParam('id');
        self.subscribe('FullPatient', id);
        self.subscribe('Faciliies')
    });
});

Template.AdmitPatient.helpers({

        patient: function () {
            var id = FlowRouter.getParam('id');
            return Patients.findOne({_id: id});
        },
        facility: function(){
            fac =  Facilities.findOne();
            console.log(fac.wards)
            return fac;
        },




})