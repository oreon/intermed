
Template.Patients.helpers({

    patient: function () {
        //console.log(this)
        return Patients.findOne(FlowRouter.getParam('id'));
    },
})

Template.Patients.events({
    'click .new-recipe': () => FlowRouter.go('editPatient')

});


