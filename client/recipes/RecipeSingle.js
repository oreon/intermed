Template.RecipeSingle.onCreated(function () {
    var self = this;
    self.autorun(function () {
        var id = FlowRouter.getParam('id');
        self.subscribe('SingleRecipe', id);
        self.subscribe('AllProducts')
    });
});

Template.RecipeSingle.helpers({

        recipe: () => {
            var id = FlowRouter.getParam('id');
            return Recipes.findOne({_id: id});
        },

        prdName : (id) => " PRD " + Products.findOne({_id: id}).name


})
;