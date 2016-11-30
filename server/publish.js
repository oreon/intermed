// Meteor.publish('recipes', function (skip, limit) {
//     //Counts.publish(this, 'total_recipes', Recipes.find())
//     return Recipes.find({author: this.userId}, {limit: 5});
// });


Meteor.publish('recipes-paginated', function (skip, limit) {
    Counts.publish(this, 'total_recipes', Recipes.find())

    if (skip < 0)
        skip = 0
    options = {}
    options.skip = skip
    options.limit = limit
    if (options.limit > 10) options.limit = 10
    options.sort = {createdAt: 1}

    return Recipes.find({author: this.userId}, options);
});

// Meteor.publish('AllProducts', function () {
//     return Products.find();
// });

// Meteor.publish('SingleRecipe', function (id) {
//     //check(id, String);
//     return Recipes.find({_id: id});
// });


//Meteor.publish('SingleProduct', function(id){
//    //check(id, String);
//    return Recipes.find({_id: id});
//});

//Meteor.publish('Admissions', function(){
//    return Admissions.find();
//});

Meteor.publish('Drugs', function () {
    return Drugs.find();
});

Meteor.publish('Patients', function () {
    return Patients.find();
});

Meteor.publish('Encounters', function () {
    return Encounters.find();
});

Meteor.publish('ChronicDiseases', function () {
    return ChronicDiseases.find();
});

Meteor.publish('LabTests', function () {
    return LabTests.find();
});


Meteor.publish('Facilities', function () {
    return Facilities.find();
});

Meteor.publish('Wards', function () {
    return Wards.find();
});

Meteor.publish('Rooms', function () {
    return Rooms.find();
});

Meteor.publish('Beds', function () {
    return Beds.find();
});

Meteor.publish('TestResults', function() { 
    return TestResults.find();
})


//Meteor.publish('Roles', function () {
//    return Meteor.roles.find({})
//})


Meteor.publish('FullPatient', function (id) {
    check(id, String);

    if (id) {
        return [
            Patients.find({'_id': id}),
            Encounters.find({'patient': id} /*, { sort: { "date": -1 } } */)
        ];
    } else {
        return null;
    }
})

Meteor.publishComposite('compPt', function (id) {
    return {
        find: function () {
             return Patients.find({_id: id}, {sort: {score: -1}, limit: 1});
        },
        children: [
            {
                find: function (pt) {
                    return Encounters.find(
                        {patient: pt._id},
                        {limit: 1000/*, fields: {profile: 1}*/});
                }
            },
            {
                find: function (pt) {
                    return TestResults.find(
                        {patient: pt._id},
                        {limit: 1000/*, fields: {profile: 1}*/});
                }
            },
        ]
    }
})


Meteor.publishComposite('compPts', function () {
    return {
        find: function () {
            // Find top ten highest scoring posts

            return Patients.find({}, {sort: {score: -1}, limit: 100});
        },
        children: [
            {
                collectionName: "ptEncounters",

                find: function (pt) {

                    return Encounters.find(
                        {patient: pt._id},
                        {limit: 1000/*, fields: {profile: 1}*/});
                }
            },
        ]
    }
})


Meteor.publishComposite('compWards', {
    find: function () {
        return Wards.find({}, {sort: {name: -1}, limit: 100});
    },
    children: [
        {
            //collectionName: "ptEncounters",

            find: function (ward) {

                return Rooms.find(
                    {ward: ward._id},
                    {sort: {name: -1}, limit: 1000/*, fields: {profile: 1}*/});
            },

            children: [

                {
                    find: function (room) {

                        return Beds.find(
                            {room: room._id},
                            {sort: {name: -1}, limit: 1000/*, fields: {profile: 1}*/});
                    }
                }

            ]
        },
    ]

})

Meteor.publishComposite('compAdmissions', {
    find: function () {
        return Admissions.find({"currentBedStay": {$exists: true}}, {sort: {name: -1}, limit: 100});
    },
    children: [
        {
            find: function (adm) {
                return Patients.find(
                    {_id: adm.patient},
                    {sort: {name: -1}, limit: 1/*, fields: {profile: 1}*/});
            },
        },
    ]
})

Meteor.publishComposite('compAdmission', function (id) {
    return {
        find: function () {
            return Admissions.find({"currentBedStay": {$exists: true}, _id: id}, {sort: {name: -1}, limit: 1});
        },
        children: [
            {
                find: function (adm) {
                    return Patients.find(
                        {_id: adm.patient},
                        {sort: {name: -1}, limit: 1/*, fields: {profile: 1}*/});
                },
            },
        ]
    }
})


//Meteor.publish('Scripts', function () {
//    return Scripts.find();
//});

Meteor.publish('ScriptTemplates', function (skip, limit) {
    //Counts.publish(this, 'total_recipes', Recipes.find())
    return ScriptTemplates.find({});
});


if (Meteor.isServer) {
//make sure a patient is not used in two current admissions simultaneously
    Admissions._ensureIndex({patient: 1 }, {unique: true, partialFilterExpression: { isCurrent: true }})
//make sure a bed is not used in two admissions simultaneously : TODO this currently fails when updating
    Admissions._ensureIndex({"currentBedStay.bed": 1}, {unique: true, sparse:true})


}