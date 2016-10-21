
//self.subscribe('products')
Meteor.subscribe('AllProducts')


Template.Recipes.onCreated(function(){
	var self = this;
	self.autorun(function() {
		self.subscribe('recipes');
		//self.subscribe('products')
	});


});

Template.Recipes.helpers({
	recipes: () => {
		return Recipes.find({});
	},
	patients: () => {
		return Patients.find({});
	},

//recipesIndex: () => RecipesIndex
});


Template.Recipes.events({
		'click .new-recipe': () => {
		Session.set('newRecipe', true);
}
});