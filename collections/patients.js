Patients = new Mongo.Collection('patients');
Drugs = new Mongo.Collection('drugs')
Scripts = new Mongo.Collection('scripts')
Encounters = new Mongo.Collection('encounters')

ChronicDiseases = new  Mongo.Collection('chronicDiseases')
LabTests = new  Mongo.Collection('labTests')
Facilities = new Mongo.Collection('facilities')

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
}
])

RoomSchema = new SimpleSchema([BaseSchema, {
    name:{type:String},
    type:{type:String, optional:true},
    beds:{type:[BedSchema]}
}
])



WardSchema = new SimpleSchema([BaseSchema, {
    name: {type: String},
    price: {type: Number, decimal: true, optional:true },
    rooms: {type: [RoomSchema]}

}
])


FacilitySchema = new SimpleSchema([BaseSchema, {name:{type:String} , wards:{type:[WardSchema]}} ])

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

    }

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
        autoform: {
            type: "select",
            options: function() { return  ['PO', 'IM', 'IV', 'SC', 'Topical', 'ID', 'IO'] }
        }
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
