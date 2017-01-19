import * as utils from '/imports/utils/misc.js';

Template.EditPatient.onCreated(function () {
    var self = this;
    self.autorun(function () {
        var id = FlowRouter.getParam('id');
        //console.log(id)
        self.subscribe('compPt', id);
        self.subscribe('Physicians')
    });

});

Template.EditPatient.helpers({

    patient: function () {
        ////console.log(Patients.findOne(FlowRouter.getParam('id')))
        return Patients.findOne(FlowRouter.getParam('id'));
    },

})

let commonHooks = {
    onSuccess: function (operation, result) {
        console.log(this)
        FlowRouter.go('patient', { id: this.docId })
    }
    ,
    onError: function (operation, error, template) {
        if (error) {
            Bert.alert(error);
        }
    }
    //,
    // formToDoc: function (doc) {
    //     doc.appliedCharts = utils.applyDobToCharts(doc);
    //     return doc;
    // },

    // formToModifier: function (modifier) {
    //     console.log(utils.applyDobToCharts(doc))
    //     modifier.$set.appliedCharts = utils.applyDobToCharts(doc);
    //      return modifier;
    // },

}

AutoForm.hooks({
    editPatientForm: commonHooks,
    insertPatientForm: commonHooks
});