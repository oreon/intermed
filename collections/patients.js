import { Meteor } from 'meteor/meteor';
//import {Roles} from 'alanning/roles'
import moment from 'moment'

/*export const*/
Patients = new Mongo.Collection('patients')
Drugs = new Mongo.Collection('drugs')
Scripts = new Mongo.Collection('scripts')
Encounters = new Mongo.Collection('encounters')

ChronicDiseases = new Mongo.Collection('chronicDiseases')
LabTests = new Mongo.Collection('labTests')
Facilities = new Mongo.Collection('facilities')
ScriptTemplates = new Mongo.Collection('scriptTemplates')

TestResults = new Mongo.Collection('testResults')

Invoices = new Mongo.Collection('invoices')
Services = new Mongo.Collection('services')

//export Patients


//Patients.helpers({
//    encounters(){
//        return Encounters.find({patient: this._id});
//    },
//    test(){
//        return "a test string";
//    }
//})


Wards = new Mongo.Collection('wards')
Rooms = new Mongo.Collection('rooms')
Admissions = new Mongo.Collection('admissions')
Beds = new Mongo.Collection('beds')

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

    createdAt: {
        type: Date,
        optional: true,
        autoValue: function () {
            if (this.isInsert) {
                return new Date();
            } else if (this.isUpsert) {
                return { $setOnInsert: new Date() };
            } else {
                this.unset();  // Prevent user from supplying their own value
            }
        },
        autoform: {
            type: "hidden"
        }
    },

    createdBy: {
        type: String,
        optional: true,
        autoValue: function () {
            if (this.isInsert) {
                return this.userId
            } else if (this.isUpsert) {
                return { $setOnInsert: this.userId };
            } else {
                this.unset();  // Prevent user from supplying their own value
            }
        },
        autoform: {
            type: "hidden"
        }
    },


    // Force value to be current date (on server) upon update
    // and don't allow it to be set upon insert.
    updatedAt: {
        type: Date,
        autoValue: function () {
            if (this.isUpdate) {
                return new Date();
            }
        },
        denyInsert: true,
        optional: true,
        autoform: {
            type: "hidden"
        }
    },


})

ChronicDiseaseSchema = new SimpleSchema([BaseSchema, { name: { type: String, unique: true } }])
LabTestSchema = new SimpleSchema([BaseSchema, { name: { type: String, unique: true } }])

ServiceSchema = new SimpleSchema([BaseSchema, {
    name: { type: String },
    price: { type: Number }
}])

LineItemSchema = new SimpleSchema([BaseSchema, {
    service: {
        type: String,
        autoform: {
            type: "select",
            options: function () {
                return Services.find().map(function (c) {
                    return { label: c.name + " " + c.price, value: c.name };
                });
            }
        }
    },
    appliedPrice: {
        type: Number,
        decimal: true,
        // autoValue: function () {
        //     let service = this.field("service");
        //     if (service.isSet) {
        //         return  20; //service.value.price;
        //     }
        //     return 0.0;
        // },

    },
    units: { type: Number },
    total: {
        type: Number,
        autoform: {
            readonly: true
        }
    }

}])

InvoiceSchema = new SimpleSchema([BaseSchema, {
    admission: {
        type: String,
        optional: true,
        autoform: {
            type: "hidden"
        }
    },
    comments: { type: String , optional:true},
    items: { type: [LineItemSchema], optional:true },
    total: {
        type: Number,
        //defaultValue: 0 ,
        optional:true,
        autoValue: function () {
            let items = this.field("items");
            if (items.isSet) {
               // console.log(items)
                let itemsVal = items["value"];
               total =  _.reduce(itemsVal, function (sum, item) {

                    item.total = item.appliedPrice * item.units
                    return sum + (item.total?item.total:0);
                }, 0);
                return total;
            }
            return 0;
        },
        autoform: {
            readonly: true
        }
    },

}])

BedSchema = new SimpleSchema([BaseSchema, {
    name: { type: String },
    //patient: {
    //    type: String,
    //    optional: true,
    //    autoform: {
    //        type: "hidden",
    //    }
    //},
    //id: {
    //    type: String,
    //    autoValue: function () {
    //        //var idfld = this.field("id");
    //        return this.value   ? this.value : Meteor.uuid()
    //
    //    }
    //},
    //fullName:{
    //    type: String,
    //    autoValue: function () {
    //        var room = this.field("room");
    //        wardName = Wards.find()
    //        return (content.isSet)  ? content.value : Meteor.uuid()
    //    }
    //},
    //_wardId:{
    //    type:String,
    //    autoValue : function () {
    //        return Meteor.uuid();
    //    }
    //},
    room: {
        type: String,
        optional: true,
        autoform: {
            type: "select",
            options: function () {
                return Rooms.find().map(function (c) {  //TODO:  wards should belong to current faciltiy
                    return { label: c.name, value: c._id };
                });
            }
        }
    },
}
])

RoomSchema = new SimpleSchema([BaseSchema, {
    name: { type: String },
    type: { type: String, optional: true },
    beds: { type: [BedSchema] },
    ward: {
        type: String,
        optional: false,
        autoform: {
            type: "select",
            options: function () {
                return Wards.find().map(function (c) {  //TODO:  wards should belong to current faciltiy
                    return { label: c.name, value: c._id };
                });
            }
        }
    },
}
])


WardSchema = new SimpleSchema([BaseSchema, {
    name: { type: String },
    price: { type: Number, decimal: true, optional: true },
    //rooms: {type: [RoomSchema]},
    //beds: {type: [BedSchema], optional:true },
    facility: {
        type: String,
        autoValue: function () {
            return Facilities.findOne()._id;  //TODO change to current user's facility
        }
    }
}
])


FacilitySchema = new SimpleSchema([BaseSchema, {
    name: { type: String }
}
])


BedStaySchema = new SimpleSchema({
    bed: { type: String },
    fromDate: { type: Date, optional: true },
    toDate: { type: Date, optional: true },
    // price: {
    //     type: Number,
    //     optional: true
    // },
    // days: {
    //     type: Number,
    //     optional: true
    // },
    // total: {
    //     type: Number,
    //     autoValue: function () {
    //         console.log(this)
    //         return 25; //
    //     }
    // }
})


TestResultValue = new SimpleSchema({
    name: { type: String },
    value: { type: Number, decimal: true },
    createdAt: {
        type: Date,
        optional: true,
        autoValue: function () {
            if (this.isInsert) {
                return new Date();
            } else if (this.isUpsert) {
                return { $setOnInsert: new Date() };
            } else {
                this.unset();  // Prevent user from supplying their own value
            }
        },
        autoform: {
            type: "hidden"
        }
    },

})

TestResultsSchema = new SimpleSchema([BaseSchema, {
    patient: {
        type: String,
        optional: true,
        autoform: {
            type: "select",
            options: function () {
                return Patients.find().map(function (c) {
                    return { label: c.fullName(), value: c._id };
                });
            }
        }
    },

    admission: {
        type: String,
        optional: true,
        autoform: {
            type: "select",
            options: function () {
                return Admissions.find().map(function (c) {
                    return { label: c.reason, value: c._id };
                });
            }
        }
    },

    labTest: {
        type: String,
        optional: false,
        autoform: {
            type: "select",
            options: function () {
                return LabTests.find().map(function (c) {
                    return { label: c.name, value: c._id };
                });
            }
        }
    },

    mainValue: { type: Number, optional: true },

    values: { type: [TestResultValue], optional: true }
}

])

PatientSchema = new SimpleSchema([BaseSchema, {
    firstName: {
        type: String,
        label: "First Name",
    },
    lastName: {
        type: String,
        label: "Last Name",
    },
    dob: {
        type: Date
    },
    gender: {
        type: String,
        allowedValues: ['F', 'M'],
        autoform: {
            type: "select-radio"
        }
    },
    chronicConditions: {
        type: [String],
        optional: true,
        autoform: {
            type: "select-checkbox",
            options: function () {
                return ChronicDiseases.find().map(function (c) {
                    return { label: c.name, value: c.name };
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

DrugSchema = new SimpleSchema([BaseSchema, {
    name: {
        type: String,
        label: "Name",
    },
}])


ScriptItem = new SimpleSchema({
    drug: {
        type: String,
        optional: true,
        autoform: {
            type: "select2",
            options: function () {
                return Drugs.find().map(function (c) {
                    return { label: c.name, value: c._id };
                });
            }
        }
    },
    route: {
        type: String,
        label: "Route",
        defaultValue: 'PO',
        allowedValues: ['PO', 'IM', 'IV', 'SC', 'Topical', 'ID', 'IO']
    },
    amount: {
        type: String
    },
    frequency: {
        type: String,
        label: "Frequency",
    },
    quantity: { type: Number, defaultValue: 1 }

})

ScriptSchema = new SimpleSchema([BaseSchema, {

    notes: {
        type: String,
        optional: true,
        autoform: {
            rows: 5,
        }
    },
    items: {
        type: [ScriptItem],
        optional: true,
    }
}])

ScriptTemplateSchema = new SimpleSchema([ScriptSchema, {
    name: {
        type: String
    }

}])


EncounterSchema = new SimpleSchema({

    patient: {
        type: String,
        optional: true,
        autoform: {
            type: "select",
            options: function () {
                return Patients.find().map(function (c) {
                    return { label: c.firstName, value: c._id };
                });
            }
        }
    },
    reason: {
        type: String,
        label: "reason",
        autoform: {
            type: "textarea"
        }
    },
    script: {
        type: ScriptSchema,
        optional: true,
    },
    tests: {
        type: [TestResultsSchema],
        optional: true,
    }
})

ImagingSchema = new SimpleSchema({
    type: {
        type: String,
        allowedValues: ['XRay', 'CT', 'MRI', 'Other']
    },
    details: {
        type: String,
        optional: true,
        autoform: {
            type: "textarea"
        }
    }
})

VisitSchema = new SimpleSchema([BaseSchema, {
    note: {
        type: String,
        optional: true,
        autoform: {
            type: "textarea"
        }
    },
    tests: {
        type: [String],
        optional: true,
        autoform: {
            type: "select2",
            afFieldInput: {
                multiple: true
            },
            options: function () {
                return LabTests.find().map(function (c) {
                    return { label: c.name, value: c.name };
                });
            }
        }
    },
    // testResults:{
    //     type: String,
    //     optional: true,
    //     autoValue: function () {
    //         let content = this.field("tests");
    //         if (content.isSet) {
    //             let tests =  content.value;
    //             _.forEach(tests, function(element) {
    //                 console.log(element);
    //                 let labTest = LabTests.findOne({name:element});
    //                 console.log(labTest)
    //                 TestResults.insert({"labTest":labTest})
    //             });
    //             return "";
    //         } else {
    //             this.unset();
    //         }
    //     }    
    imagings: {
        type: [ImagingSchema],
        optional: true,
    },
    createdBy: {
        type: String,
        autoValue: function () { return this.userId },
        autoform: {
            type: "hidden"
        }
    },
}])

AdmissionSchema = new SimpleSchema([BaseSchema, {
    patient: {
        type: String,
        optional: false,
        autoform: {
            type: "hidden"
        }
    },
    currentBedStay: {
        type: BedStaySchema,
        optional: true,
        autoform: {
            type: "hidden"
        }
    },
    bedStays: {
        type: [BedStaySchema],
        optional: true,
        autoform: {
            type: "hidden"
        }
    },
    admitDate: {
        type: Date,
        optional: true
        ,
        autoform: {
            type: "hidden"
        }
    },
    dischargeDate: {
        type: Date,
        optional: true,


        autoform: {
            type: "hidden"
        }

    },
    reason: {
        type: String,//orion.attribute('summernote'),
        optional: true,
    }
    ,
    admissionNote: {
        type: String,//orion.attribute('summernote'),
        optional: true,
        autoform: {
            type: "textarea"
        }
    },
    visits: {
        type: [VisitSchema],
        optional: true,
    },
    dischargeNote: {
        type: String,
        optional: true,
        autoform: {
            type: "textarea"
        }
    },
    script: {
        type: ScriptSchema,
        optional: true,
    },
    tests: {
        type: [TestResults],
        optional: true,
    },
    eligibleForDischarge: {
        type: Boolean,
        defaultValue: false,
        optional: true,
        autoform: {
            type: "hidden"
        }
    },
    isCurrent: {
        type: Boolean,
        defaultValue: true,
        optional: false,
        autoform: {
            type: "hidden"
        }
    },

}])


Admissions.allow({
    insert: (userId, doc) => !!userId,
    update: function (userId, doc) {
        return !!userId
    }
})

Invoices.allow({
    insert: (userId, doc) => !!userId,
    update: function (userId, doc) {
        return !!userId
    }
})

Patients.allow({
    insert: (userId, doc) => !!userId,
    update: function (userId, doc) {
        return !!userId
    }
})


import { Tabular } from 'meteor/aldeed:tabular';
//import {Patients} from 'patients'

Patients.helpers({
    fullName: function () {
        return this.firstName + ' ' + this.lastName + ' ' + this.gender + ' ' + this.age();
    },
    age: function () {
        let years = moment().diff(this.dob, 'years');
        ret = years;
        if (years == 0) {
            ret = moment().diff(this.dob, 'days') + ' Days';
        }
        return ret;
    },
    currentBed: function () {
        adm = this.currentAdmisson();
        if (adm) {
            console.log("found bed " + adm.currentBedStay.bed)
            return Beds.findOne(adm.currentBedStay.bed);
        }
        return null
    },
    encounters: function () {
        return PtEncounters.find({ patient: this._id });
    },
    testResults: function () {
        TestResults.find({ patient: this._id });
    },
    isAdmitted: function () { return !!this.currentAdmisson() },
    currentAdmisson: function () {
        return Admissions.findOne({ patient: this._id });
    }
})

Admissions.helpers({
    currentBed: function () {
        if (this.currentBedStay) {
            return Beds.findOne(this.currentBedStay.bed);
        }
        return null
    },
    patientObj: function () {
        return Patients.findOne({ _id: this.patient })
    },
    invoice: function(){
        inv =   Invoices.findOne({admission:this._id}); //, { $set: {admission:this._id} });
        return inv;
    },
    bedStaysObj: function () {
        stays = []
        total = 0;

        tempStays = this.bedStays;
        tempStays.push(this.currentBedStay)

        _.forEach(tempStays, function (stay) {
            let bed = Beds.findOne({ _id: stay.bed });
            stay.price = bed.roomObj().wardObj().price
            stay.bed = bed

            if(!stay.toDate){
                stay.toDate = new Date();
            }

            let a = moment(stay.toDate);
            let b = moment(stay.fromDate);
            days = a.diff(b, 'days')
            stay.days =  days == 0 ? 1 : days;

            stay.total = stay.days * stay.price

            total += stay.total 
            stays.push(stay)
        });

        return {"stays":stays, "total":total};
    }
})

Beds.helpers({
    fullName: function () {
        return this.roomObj().fullName() + '-' + this.name;
    },
    roomObj: function () { return Rooms.findOne({ _id: this.room }) }
})
Rooms.helpers({
    fullName: function () {
        return this.wardObj().name + '-' + this.name;
    },
    wardObj: function () { return Wards.findOne({ _id: this.ward }) }
})



new Tabular.Table({
    name: "PatientsTbl",
    collection: Patients,
    search: {
        caseInsensitive: true,
        smart: false,
        onEnterOnly: true,
    },
    columns: [
        { data: "fullName()", title: "Full Name" },

        { data: "age()", title: "Age" },
        { data: "gender", title: "Gender" },

        { data: "firstName", visible: false },
        { data: "lastName", visible: false },
        { data: "dob", visible: false },
        {
            data: "_id",
            render: (val, type, doc) => "<a href='patient/" + val + "'>  <i class='fa fa-map'/></a>"
        },
        {
            data: "_id",
            render: (val, type, doc) => Roles.userIsInRole(Meteor.userId(), ['admin', 'physician']) ?
                "<a href='editPatient/" + val + "'>  <i class='fa fa-pencil'/></a>" : ""
        },
        //{data: "summary", title: "Summary"},
        //{
        //    tmpl: Meteor.isClient && Template.bookCheckOutCell
        //}
    ]
});


Patients.attachSchema(PatientSchema)
Drugs.attachSchema(DrugSchema)
Scripts.attachSchema(ScriptSchema)
Encounters.attachSchema(EncounterSchema)

ChronicDiseases.attachSchema(ChronicDiseaseSchema)
LabTests.attachSchema(LabTestSchema)
Facilities.attachSchema(FacilitySchema);

Wards.attachSchema(WardSchema)
Rooms.attachSchema(RoomSchema)
Beds.attachSchema(BedSchema)


Admissions.attachSchema(AdmissionSchema)

ScriptTemplates.attachSchema(ScriptTemplateSchema)
TestResults.attachSchema(TestResultsSchema)

Invoices.attachSchema(InvoiceSchema)
Services.attachSchema(ServiceSchema)
