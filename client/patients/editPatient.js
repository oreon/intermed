Template.EditPatient.onCreated(function () {
    var self = this;
    self.autorun(function () {
        var id = FlowRouter.getParam('id');
        console.log(id)
        self.subscribe('compPt', id);
    });

});

Template.EditPatient.helpers({

    patient: function () {
        //console.log(Patients.findOne(FlowRouter.getParam('id')))
        return Patients.findOne(FlowRouter.getParam('id'));
    },

})

let commonHooks = {
    onSuccess: function (operation, result) {
        console.log(this)
        FlowRouter.go('patient',{ id: this.docId})
    }
    ,
    onError: function (operation, error, template) {
        if (error) {
            Bert.alert(error);
        }
    }
}

AutoForm.hooks({
    editPatientForm: commonHooks,
    insertPatientForm: commonHooks
});