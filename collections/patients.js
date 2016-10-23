Patients = new Mongo.Collection('patients');
Drugs = new Mongo.Collection('drugs')
Scripts = new Mongo.Collection('scripts')
Encounters = new Mongo.Collection('encounters')

ChronicDiseases = new  Mongo.Collection('chronicDiseases')
LabTests = new  Mongo.Collection('labTests')
Facilities = new Mongo.Collection('facilities')


Patients.helpers({
    encounters(){
        return Encounters.find({ patient: this._id });
    },
    test(){
      return "a test string";
    }
})

Wards = new Mongo.Collection('wards')
Rooms = new Mongo.Collection('rooms')
//Beds = new Mongo.Collection('beds')
//
//Wards.helpers({
//    fullName(){
//        return '${this.firstName} ${this.lastName}';
//    },
//    rooms() {
//        return Rooms.find({ ward: this._id });
//    }
//});

BaseSchema = new SimpleSchema({
    created: {
        type: Date,
        label: "Created At",
        autoValue: function() {
            return new Date()
        },
        autoform: {
            type: "hidden"
        }
    }
})

ChronicDiseaseSchema = new SimpleSchema([BaseSchema, {name:{type:String, unique: true} } ])
LabTestSchema = new SimpleSchema([BaseSchema, {name:{type:String, unique: true} } ])





BedSchema = new SimpleSchema([BaseSchema, {
    name:{type:String},
    patient: {
        type: String,
        optional: true,
        autoform: {
            type: "hidden",
        }
    },
    id: {
        type:String,
        autoValue : function () {
            return Meteor.uuid();
        }
    },
    //_wardId:{
    //    type:String,
    //    autoValue : function () {
    //        return Meteor.uuid();
    //    }
    //},
    room: {
        type: String,
        optional: true,
    },
}
])

RoomSchema = new SimpleSchema([BaseSchema, {
    name:{type:String},
    type:{type:String, optional:true},
    beds:{type:[BedSchema]},
    ward: {
        type: String,
        optional: false,
        autoform: {
            type: "select",
            options: function () {
                return Wards.find().map(function (c) {  //TODO:  wards should belong to current faciltiy
                    return {label: c.name, value: c._id};
                });
            }
        }
    },
}
])



WardSchema = new SimpleSchema([BaseSchema, {
    name: {type: String},
    price: {type: Number, decimal: true, optional:true },
    //rooms: {type: [RoomSchema]},
    //beds: {type: [BedSchema], optional:true },
    facility: {
        type:String,
        autoValue : function () {
            return Facilities.findOne()._id;  //TODO change to current user's facility
        }
    }
}
])


FacilitySchema = new SimpleSchema([BaseSchema, {
    name:{type:String}
}
])

TestResultValue = new SimpleSchema({
    name:{type:String},
    value:{type:Number, decimal:true }

})

TestResults = new SimpleSchema([BaseSchema, {
    labTest: {
        type: String,
        optional: false,
        autoform: {
            type: "select",
            options: function () {
                return LabTests.find().map(function (c) {
                    return {label: c.name, value: c._id};
                });
            }
        }
    },
    values:{type:[TestResultValue], optional: true}
}

])

PatientSchema = new SimpleSchema([BaseSchema, {
    firstName:{
        type:String,
        label:"First Name",
    },
    lastName:{
        type:String,
        label:"Last Name",
    },
    dob: {
        type: Date
    },
    chronicConditions:{
        type:[String],
        autoform: {
            type: "select-checkbox",
            options: function () {
                return ChronicDiseases.find().map(function (c) {
                    return {label: c.name, value: c.name};
                });
            }
        }

    },
    bed: {
        type: String,
        optional: true,
        autoform: {
            type: "hidden",
        }
    },

}])

DrugSchema =  new SimpleSchema({
    name:{
        type:String,
        label:"Name",
    },
})



ScriptItem = new SimpleSchema({
    drug: {
        type: String,
        optional: true,
        autoform: {
            type: "select",
            options: function () {
                return Drugs.find().map(function (c) {
                    return {label: c.name, value: c._id};
                });
            }
        }
    },
    route: {
        type: String,
        label: "Route",
        defaultValue: 'PO',
        allowedValues:  ['PO', 'IM', 'IV', 'SC', 'Topical', 'ID', 'IO']

    },
    amount : {
        type: String
    },
    frequency: {
        type: String,
        label: "Frequency",
    },
    quantity: {type:Number , defaultValue: 1 }

})

ScriptSchema =   new SimpleSchema({


    notes :{
        type:String,
        label:"reason",
    },
    items:{
        type:[ScriptItem]
    }
})



EncounterSchema =   new SimpleSchema({

    patient: {
        type: String,
        optional: true,
        autoform: {
            type: "select",
            options: function () {
                return Patients.find().map(function (c) {
                    return {label: c.firstName, value: c._id};
                });
            }
        }
    },
    reason :{
        type:String,
        label:"reason",
        autoform: {
            type: "textarea"
        }
    },
    script:{
        type:ScriptSchema,
        optional: true,
    },
    tests:{
        type:[TestResults],
        optional: true,
    }
})


Patients.attachSchema(PatientSchema)
Drugs.attachSchema(DrugSchema)
Scripts.attachSchema(ScriptSchema)
Encounters.attachSchema(EncounterSchema)

ChronicDiseases.attachSchema(ChronicDiseaseSchema)
LabTests.attachSchema(LabTestSchema)
Facilities.attachSchema(FacilitySchema);

Wards.attachSchema(WardSchema)
Rooms.attachSchema(RoomSchema)


