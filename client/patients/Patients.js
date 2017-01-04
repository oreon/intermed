
import {resColor} from '/imports/utils/myfunctional.js';



Template.Patients.helpers({



    patient: function () {
        ////console.log(this)
        return Patients.findOne(FlowRouter.getParam('id'));
    },

    test: function(){
        //console.log(resColor)
    }
})

Template.Patients.events({
    'click .new-recipe': () => FlowRouter.go('editPatient')
});


