Template.Visit.onCreated(function () {
    var self = this;
    self.autorun(function () {
        self.subscribe('compWards')
        self.subscribe('compAdmissions')
    });
});
Template.Visit.helpers({
    admission: function () {
        //console.log(Admissions.findOne({_id: FlowRouter.getParam('id')}) )
        return Admissions.findOne({_id: FlowRouter.getParam('id')});
    }
});

let commonHooks = {
    onSuccess: function (operation, result) {
        Bert.alert( 'Successfully created visit ', 'success', 'growl-top-right' );
        FlowRouter.go('/viewAdmission/' + FlowRouter.getParam('id'))
    }
    ,
    onError: function (operation, error, template) {
        if (error) {
            Bert.alert(error, 'danger');
        }
    }
}

AutoForm.hooks({
   // editPatientForm: commonHooks,
    insertVisitForm: commonHooks
});