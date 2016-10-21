Template.Recipe.onCreated(function(){
    this.editMode = new ReactiveVar(false);

});

Template.Recipe.helpers({
    updateRecipeId: function() {
        return this._id;
    },
    editMode: function(){
        return Template.instance().editMode.get();
    },
    usr: function(){
        return Meteor.userId()
    },
        prdName : (id) =>   Products.findOne({_id: id}).name
});

Template.Recipe.events({
    'click .toggle-menu': function(){
        Meteor.call('toggleMenuItem', this._id, this.inMenu);
    },
    'click .fa-trash': function () {
        console.log("hi from trash")
        Meteor.call('deleteRecipe', this._id);
    },
    'click .fa-pencil': function (event, template) {
        template.editMode.set(!template.editMode.get());
    }
});