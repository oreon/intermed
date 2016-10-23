Recipes = new Mongo.Collection('recipes');

//RecipesIndex = new EasySearch.Index({
//    collection: Recipes,
//    'limit': 3,
//    fields: ['name', 'desc', 'ingredients'],
//    engine: new EasySearch.MongoDB({
//            sort: () => {score: 1}
//})
//})


Products = new Mongo.Collection('products');


ProductSchema = new SimpleSchema({
    name: {
        type: String,
        label: "Name",
    }
})


Recipes.allow({
    insert: (userId, doc) => !!userId,
    update: function (userId, doc) {
        return doc.author === userId || Roles.userIsInRole('admin')
    }
})

Ingredient = new SimpleSchema({
    product: {
        type: String,
        optional: true,
        autoform: {
            type: "select",
            options: function () {
                return Products.find().map(function (c) {
                    return {label: c.name, value: c._id};
                });
            }
        }
    },

    name: {
        type: String,
        label: "Name",
    },
    amount: {
        type: String,
        label: "Amount",
    },
})


RecipeSchema = new SimpleSchema({
    name: {
        type: String,
        label: "Name",
    },
    desc: {
        type: String,
        label: "Description",
        autoform: {
            rows: 5
        }
    },
    ingredients: {
        type: [Ingredient]
    },
    author: {
        type: String,
        label: "Author",
        autoValue: function () {
            return this.userId;
        },
        autoform: {
            type: "hidden"
        }
    },
    createdAt: {
        type: Date,
        label: "created At",
        autoValue: function () {
            return new Date();
        },
        autoform: {
            type: "hidden"
        }
    },
    inMenu: {
        type: Boolean,
        defaultValue: false,
        optional: true,
        autoform: {
            type: "hidden"
        }
    },

});

Recipes.attachSchema(RecipeSchema);
Products.attachSchema(ProductSchema)


Meteor.methods({
    toggleMenuItem: function (id, currentState) {
        Recipes.update(id, {
            $set: {
                inMenu: !currentState
            }
        });
    },
    deleteRecipe: function (id) {
        Recipes.remove(id);
    }
});