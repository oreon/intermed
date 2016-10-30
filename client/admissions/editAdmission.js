//import {getAdmission} from '../viewAdmission'

Template.EditAdmission.onCreated(function () {

    var self = this;
    self.autorun(function () {

        var id = FlowRouter.getParam('id');
        self.subscribe('compAdmission', id);
        self.subscribe('recipes')
    });
});

Template.EditAdmission.helpers({

    editMode: function () {
        return "XXX";// Template.instance().editMode.get();
    },
    admission: function () {
        adm = Admissions.findOne({_id: FlowRouter.getParam('id')});
        //console.log(adm)
        return adm
    },

    recipe:function(){
        rcp =  Recipes.findOne({});
      //  console.log(rcp)
        return rcp;
    }
})

AutoForm.hooks({
    updateAdmissionScriptForm: {

        onSubmit: function (insertDoc, updateDoc, currentDoc) {
            if (updateDoc) {
                console.log(updateDoc)
                this.done();
            } else {
                this.done(new Error("Submission failed"));
            }
            return false;
        },
        onSuccess: function(operation, result) {
            console.log(result)
            console.log(this.template.parent())
            //this.template.parent().editMode.set(false);
        },
        onError: function(operation, error, template) {
            if(error){
                alert(error);
            }
        }
    }
});