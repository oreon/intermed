//Template.Recipe.onCreated(function(){
//    this.editMode = new ReactiveVar(false);
//
//});
//
//Template.Recipe.helpers({
//        updateRecipeId: function() {
//            return this._id;
//        },
//        editMode: function(){
//            return Template.instance().editMode.get();
//        },
//        scripts: function(){
//            return Scripts.find({patient eq this.patient});
//        },
//
//        drugName : (id) =>   Drugs.findOne({_id: id}).name
//});
//
//Template.Recipe.events({
//    'click .toggle-menu': function(){
//        Meteor.call('toggleMenuItem', this._id, this.inMenu);
//    },
//    'click .fa-trash': function () {
//        console.log("hi from trash")
//        Meteor.call('deleteRecipe', this._id);
//    },
//    'click .fa-pencil': function (event, template) {
//        template.editMode.set(!template.editMode.get());
//    }
//});

Template.Patient.onCreated(function () {
    var self = this;
    self.autorun(function () {
        var id = FlowRouter.getParam('id');
        self.subscribe('FullPatient', id);
        self.subscribe('Drugs')
    });
});

Template.Patient.helpers({

        patient: function () {
            var id = FlowRouter.getParam('id');
            pt = Patients.findOne({_id: id});
            return pt;
        },

        encounters: function () {
            return Encounters.find();
        },

        drugName: (id) => Drugs.findOne({_id: id}).name


})