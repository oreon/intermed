
//self.subscribe('products')
Meteor.subscribe('AllProducts')


Template.Recipes.onCreated(function(){
	var self = this;
	self.autorun(function() {
		self.subscribe('recipes');
		self.subscribe('compPts')
	});


});

Template.Recipes.helpers({
	recipes: () => {
		return Recipes.find({});
	},
	patients: () => {
		return Patients.find({});
	},
	encounters: function(){
		//console.log(this._id)
		return PtEncounters.find({patient: this._id});
	},

//recipesIndex: () => RecipesIndex
});


Template.Recipes.events({
		'click .new-recipe': () => {
		Session.set('newRecipe', true);
}
});