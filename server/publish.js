import * as utils from '/imports/utils/misc.js';

// Meteor.publish('recipes-paginated', function (skip, limit) {
//     Counts.publish(this, 'total_recipes', Recipes.find(utils.tenatendFinder(this.userId)))

//     if (skip < 0)
//         skip = 0
//     options = {}
//     options.skip = skip
//     options.limit = limit
//     if (options.limit > 10) options.limit = 10
//     options.sort = {createdAt: 1}

//     return Recipes.find({author: this.userId}, options);
// });

Meteor.publish('userData', function () {
    //console.log(this.user.profile.facility)
    return Meteor.users.find(utils.tenatendFinder(this.userId, true), { fields: { profile: 1 } });
});

Meteor.publish('Physicians', function () {
    compFinder = Object.assign(utils.tenatendFinder(this.userId, true),
        { 'profile.profession': 'physician' });
    console.log(compFinder)
    return Meteor.users.find(compFinder,
        { fields: { profile: 1 } });
});


// Meteor.publish('AllProducts', function () {
//     return Products.find(utils.tenatendFinder(this.userId));
// });

// Meteor.publish('SingleRecipe', function (id) {
//     //check(id, String);
//     return Recipes.find({_id: id});
// });


//Meteor.publish('SingleProduct', function(id){
//    //check(id, String);
//    return Recipes.find({_id: id});
//});

///// Prepopulated ones ////////////

Meteor.publish('Drugs', function () {
    return Drugs.find({});
});

Meteor.publish('Specializations', function () {
    return Specializations.find({});
})

//TODO should be per facility
Meteor.publish('LabTests', function () {
    return LabTests.find();
});

Meteor.publish('ChronicDiseases', function () {
    return ChronicDiseases.find(utils.tenatendFinder(this.userId));
});




Meteor.publish('Patients', function () {
    return Patients.find(utils.tenatendFinder(this.userId));
});

Meteor.publish('Encounters', function () {
    return Encounters.find(utils.tenatendFinder(this.userId));
});

Meteor.publish('EncounterSingle', function (id) {
    return Encounters.find(Object.assign({ _id: id }, utils.tenatendFinder(this.userId)));
});


Meteor.publish('Facilities', function () {
    return Facilities.find(utils.tenatendFinder(this.userId));
});

Meteor.publish('Wards', function () {
    return Wards.find(utils.tenatendFinder(this.userId));
});

Meteor.publish('Rooms', function () {
    return Rooms.find(utils.tenatendFinder(this.userId));
});

Meteor.publish('Beds', function () {
    return Beds.find(utils.tenatendFinder(this.userId));
});

Meteor.publish('Services', function () {
    //special case need autocreated services such as 
    return Services.find(utils.tenatendFinderOrNone(this.userId));
});

Meteor.publish('TestResults', function () {
    return TestResults.find(utils.tenatendFinder(this.userId));
})

Meteor.publish('Invoices', function () {
    return Invoices.find(utils.tenatendFinder(this.userId));
})

Meteor.publish('InvoiceSingle', function (id) {
    return Invoices.find({ id });
})

Meteor.publish('Todos', function () {
    return Todos.find({});
})

Meteor.publish('Scripts', function () {
    return Scripts.find({});
})



Meteor.publish('TodosCreatedByMe', function () {
    return Todos.find({ createdBy: this.userId });
})

Meteor.publish('EventsAll', function () {
    return Events.find(utils.tenatendFinder(this.userId))
});

Meteor.publish('Events', function (start, end) {
    return Events.find({
        $or: [
            { date: { $gte: start } },
            { date: { $lte: end } }
        ]
    });
});



//Meteor.publish('Roles', function () {
//    return Meteor.roles.find({})
//})


// Meteor.publish('FullPatient', function (id) {
//     check(id, String);

//     if (id) {
//         return [
//             Patients.find({'_id': id}),
//             Encounters.find({'patient': id} /*, { sort: { "date": -1 } } */)
//         ];
//     } else {
//         return null;
//     }
// })

Meteor.publishComposite('compPt', function (id) {
    return {
        find: function () {
            return Patients.find(Object.assign({ _id: id }, utils.tenatendFinder(this.userId)), { sort: { score: -1 }, limit: 1 });
        },
        children: [
            {
                find: function (pt) {
                    return Encounters.find(
                        { patient: pt._id },
                        { limit: 1000/*, fields: {profile: 1}*/ });
                }
            },
            {
                find: function (pt) {
                    return TestResults.find(
                        { patient: pt._id },
                        { limit: 1000/*, fields: {profile: 1}*/ });
                }
            },
              {
                find: function (pt) {
                    return Admissions.find(
                        { patient: pt._id },
                        { limit: 1000/*, fields: {profile: 1}*/ });
                }
            },
        ]
    }
})



Meteor.publishComposite('compPts', function () {
    return {
        find: function () {
            // Find top ten highest scoring posts

            return Patients.find(utils.tenatendFinder(this.userId), { sort: { score: -1 }, limit: 100 });
        },
        children: [
            {
                collectionName: "ptEncounters",

                find: function (pt) {

                    return Encounters.find(
                        { patient: pt._id },
                        { limit: 1000/*, fields: {profile: 1}*/ });
                }
            },
        ]
    }
})


Meteor.publishComposite('compWards', {
    find: function () {
        return Wards.find(utils.tenatendFinder(this.userId), { sort: { name: -1 }, limit: 100 });
    },
    children: [
        {
            //collectionName: "ptEncounters",

            find: function (ward) {

                return Rooms.find(
                    { ward: ward._id },
                    { sort: { name: -1 }, limit: 1000/*, fields: {profile: 1}*/ });
            },

            children: [

                {
                    find: function (room) {
                        return Beds.find(
                            { room: room._id },
                            { sort: { name: -1 }, limit: 1000/*, fields: {profile: 1}*/ });
                    }
                }

            ]
        },
    ]

})

Meteor.publishComposite('compAdmissions', {
    find: function () {
        return Admissions.find(
            Object.assign(utils.tenatendFinder(this.userId), { "currentBedStay": { $exists: true } }),
            {
                sort: { name: -1 },
                limit: 100
            });
    },
    children: [
        {
            find: function (adm) {
                return Patients.find(
                    { _id: adm.patient },
                    { sort: { name: -1 }, limit: 1/*, fields: {profile: 1}*/ });
            },
        },

        {
            find: function (adm) {
                return Invoices.find(
                    { admission: adm._id },
                    { sort: { name: -1 }, limit: 1/*, fields: {profile: 1}*/ });
            },
        },
        {
            find: function (adm) {
                return Scripts.find(
                    { admission: adm._id },
                    { sort: { name: -1 }, limit: 1/*, fields: {profile: 1}*/ });
            },
        },

    ]
})


Meteor.publishComposite('admin_tabular_Patients', function (id) {
    return {
        find: function () {
            return Admissions.find(
                Object.assign(utils.tenatendFinder(this.userId),
                    { /*"currentBedStay": {$exists: true},*/ _id: id }),
                { sort: { lastName: -1 }, limit: 1000 });
        }
    }
})

Meteor.publishComposite('compAdmission', function (id) {
    return {
        find: function () {
            return Admissions.find(
                Object.assign(utils.tenatendFinder(this.userId),
                    { /*"currentBedStay": {$exists: true},*/ _id: id }),
                { sort: { name: -1 }, limit: 1 });
        },
        children: [
            {
                find: function (adm) {
                    return Patients.find(
                        { _id: adm.patient },
                        { sort: { name: -1 }, limit: 1/*, fields: {profile: 1}*/ });
                },
            },
            {
                find: function (adm) {
                    return Invoices.find(
                        { admission: adm._id },
                        { limit: 1/*, fields: {profile: 1}*/ });
                },
            },
            {
                find: function (adm) {
                    return TestResults.find(
                        { admission: adm._id },
                        { limit: 1000/*, fields: {profile: 1}*/ });
                },
            },
            {
                find: function (adm) {
                    return Scripts.find(
                        { admission: adm._id },
                        { sort: { name: -1 }, limit: 1/*, fields: {profile: 1}*/ });
                },
            },
        ]
    }
})


//TODO publish rooms and wards 


//Meteor.publish('Scripts', function () {
//    return Scripts.find(utils.tenatendFinder(this.userId));
//});

Meteor.publish('ScriptTemplates', function (skip, limit) {
    //Counts.publish(this, 'total_recipes', Recipes.find(utils.tenatendFinder(this.userId)))
    return ScriptTemplates.find(utils.tenatendFinder(this.userId));
});

//Find images for a given patient
Meteor.publish('PtImages', function (id) {
    return Images.find({ 'metadata.owner': id });
});

Meteor.publish('Images', function () {
    return Images.find(utils.tenatendFinder(this.userId));
});

Meteor.publish('counts', function () {
    Counts.publish(this, 'MyPendingTodos', Todos.find({ forUser: this.userId, completed: false }));
});

Meteor.publish('MyPendingTodos', function () {
    return Todos.find({ forUser: this.userId, completed: false });
});




if (Meteor.isServer) {
    //make sure a patient is not used in two current admissions simultaneously
    Admissions._ensureIndex({ patient: 1 }, {
        unique: true, partialFilterExpression:
        { isCurrent: true }
    })
    //make sure a bed is not used in two admissions simultaneously : TODO this currently fails when updating
    Admissions._ensureIndex({ "currentBedStay.bed": 1 }, { unique: true, sparse: true })

    //TODO create indexes for unique collections


}