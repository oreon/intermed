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

Specializations = new Mongo.Collection('specializations') 

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
        autoValue: function() {
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
        autoValue: function() {
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
        autoValue: function() {
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


SpecializationsSchema = new SimpleSchema([BaseSchema, {
    name: { type: String },
}])

ServiceSchema = new SimpleSchema([BaseSchema, {
    name: { type: String },
    price: { type: Number },
    autoCreated:{type: Boolean, 
        autoform: {
            type: "hidden"
        }
    }
}])

LineItemSchema = new SimpleSchema([BaseSchema, {
    service: {
        type: String,
        autoform: {
            type: "select",
            options: function() {
                return Services.find({autoCreated:false}).map(function(c) {
                    return { label: c.name + " - Rs" + c.price, value: c.name };
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
    comments: { type: String, optional: true },
    items: { type: [LineItemSchema], optional: true },
    total: {
        type: Number,
        //defaultValue: 0 ,
        optional: true,
        autoValue: function() {
            let items = this.field("items");
            if (items.isSet) {
                // console.log(items)
                let itemsVal = items["value"];
                total = _.reduce(itemsVal, function(sum, item) {

                    item.total = item.appliedPrice * item.units
                    return sum + (item.total ? item.total : 0);
                }, 0);
                return total;
            }
            return 0;
        },
        autoform: {
            readonly: true
        }
    },
    amountPaid: { type: Number , optional:true},
    datePaid: { type: Date , optional:true},
    paymentType: { type: String, allowedValues: ['Cheque', 'Cash', 'Card', 'Other'] , optional:true}

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
            options: function() {
                return Rooms.find().map(function(c) {  //TODO:  wards should belong to current faciltiy
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
            options: function() {
                return Wards.find().map(function(c) {  //TODO:  wards should belong to current faciltiy
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
        autoValue: function() {
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
        autoValue: function() {
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
            options: function() {
                return Patients.find().map(function(c) {
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
            options: function() {
                return Admissions.find().map(function(c) {
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
            options: function() {
                return LabTests.find().map(function(c) {
                    return { label: c.name, value: c._id };
                });
            }
        }
    },

    mainValue: { type: Number, optional: true },

    values: { type: [TestResultValue], optional: true }
}

])

DrugAllergySchema = new SimpleSchema([BaseSchema, {
    drug: {
        type: [String],
        autoform: {
            type: "select",
            options: function() {
                return Drugs.find().map(function(c) {
                    return { label: c.name, value: c.name };
                });
            }
        }
    },
    severity: {
        type: String,
        allowedValues: ['Severe', 'Moderate', 'Mild'],
        autoform: {
            type: "select-radio"
        }
    }
}])

Immunizations = new SimpleSchema([BaseSchema, {
    drug: {
        type: [String],
        autoform: {
            type: "select",
            options: function() {
                return Drugs.find().map(function(c) {
                    return { label: c.name, value: c.name };
                });
            }
        }
    },
}])

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
            options: function() {
                return ChronicDiseases.find().map(function(c) {
                    return { label: c.name, value: c.name };
                });
            }
        }
    },
    drugAllergies: { type: [DrugAllergySchema] },
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
    },
}])



FrequencySchema = new SimpleSchema({
    every: {
        type: Number,
        label: "Once Every"
    },
    type: {
        allowedValues: ['Hour', 'Day', 'Week', 'Month', 'Quarter', 'Year'],
        type: String
    }
})

DurationSchema = new SimpleSchema({
    for: {
        type: Number,
    },
    type: {
        allowedValues: ['Hour', 'Day', 'Week', 'Month', 'Quarter', 'Year'],
        type: String
    }
})


ScriptItem = new SimpleSchema({
    drug: {
        type: String,
        optional: true,
        autoform: {
            type: "select2",
            options: function() {
                return Drugs.find().map(function(c) {
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
        type: FrequencySchema,
    },
    quantity: { type: Number, defaultValue: 1 },
    duration: { type: DurationSchema },
    prn: { type: Boolean, optional: true, label: 'PRN (as needed) ' },
    instructions: { type: String, optional: true }
})

ScriptSchema = new SimpleSchema([BaseSchema, {
    notes: {
        type: String,
        optional: true,
        autoform: {
            afFieldInput: {
                type: 'textarea' //'summernote',
            }
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
    },
    script:{type:ScriptSchema}
}])


EncounterSchema = new SimpleSchema({

    patient: {
        type: String,
        optional: true,
        autoform: {
            type: "select",
            options: function() {
                return Patients.find().map(function(c) {
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
            options: function() {
                return LabTests.find().map(function(c) {
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
        autoValue: function() { return this.userId },
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


Todos = new Mongo.Collection('todos')

Comments  = new SimpleSchema([BaseSchema, {
    comment: {
        type: String,
        autoform: {
            type:"textarea"
        }
    }
}])    

TodoSchema  = new SimpleSchema([BaseSchema, {
    patient: {
        type: String,
        optional: true,
        autoform: {
            type: "hidden"
        }
    },
    title: {
        type: String,
        label: "Name",
    },
    description: {
        type: String,
        autoform: {
            type:"textarea"
        }
    },
    forUser:{
        type:String,
        autoform: {
            type: "select",
            options: function() {
                return Meteor.users.find().map(function(c) {
                    let name = "XXX"
                    try{
                        name = c.profile.firstName + " " + c.profile.lastName
                    }catch(e){
                        name = c._id
                    }  
                    return { label: name, value: c._id };
                });
            }
        }
    },
    completed:{
        type:Boolean
    },
    dateCompleted:{
        type: Date,
        autoValue: function () {
            return new Date();
        },
        autoform: {
            type: "hidden"
        }
    },
    comments:{type:[Comments], optional:true }

}])






Admissions.allow({
    insert: (userId, doc) => !!userId,
    update: function(userId, doc) {
        return !!userId
    }
})

Invoices.allow({
    insert: (userId, doc) => !!userId,
    update: function(userId, doc) {
        return !!userId
    }
})

Patients.allow({
    insert: (userId, doc) => !!userId,
    update: function(userId, doc) {
        return !!userId
    }
})

Todos.allow({
    insert: (userId, doc) => !!userId,
    update: function(userId, doc) {
        return !!userId
    },
    remove: function(userId, doc) {
        return userId == doc.createdBy
    }
})


import { Tabular } from 'meteor/aldeed:tabular';
//import {Patients} from 'patients'

Patients.helpers({
    fullName: function() {
        return this.firstName + ' ' + this.lastName + ' ' + this.gender + ' ' + this.age();
    },
    age: function() {
        let years = moment().diff(this.dob, 'years');
        ret = years;
        if (years == 0) {
            ret = moment().diff(this.dob, 'days') + ' Days';
        }
        return ret;
    },
    currentBed: function() {
        adm = this.currentAdmisson();
        if (adm) {
            console.log("found bed " + adm.currentBedStay.bed)
            return Beds.findOne(adm.currentBedStay.bed);
        }
        return null
    },
    encounters: function() {
        return PtEncounters.find({ patient: this._id });
    },
    testResults: function() {
        TestResults.find({ patient: this._id });
    },
    isAdmitted: function() { return !!this.currentAdmisson() },
    currentAdmisson: function() {
        return Admissions.findOne({ patient: this._id });
    }
})

Beds.helpers({
    fullName: function() {
        return this.roomObj().fullName() + '-' + this.name;
    },
    roomObj: function() { return Rooms.findOne({ _id: this.room }) }
})
Rooms.helpers({
    fullName: function() {
        return this.wardObj().name + '-' + this.name;
    },
    wardObj: function() { return Wards.findOne({ _id: this.ward }) }
})

Todos.helpers({
    patientName: function() {
        pt =  Patients.findOne({ _id: this.patient })
        return "<a href='/patient/" +  this.patient + "'>" +  pt.fullName()  + "</a>";
    },
    creator:function(){
        user = Meteor.users.findOne({_id:this.createdBy})
        return user.profile.firstName + " " + user.profile.lastName;
    }

})

Admissions.helpers({
    currentBed: function() {
        if (this.currentBedStay) {
            return Beds.findOne(this.currentBedStay.bed);
        }
        return null
    },
    patientObj: function() {
        return Patients.findOne({ _id: this.patient })
    },
    invoice: function() {
        inv = Invoices.findOne({ admission: this._id }); //, { $set: {admission:this._id} });
        return inv;
    },
    bedStaysObj: function() {
        stays = []
        total = 0;

        tempStays = this.bedStays;
        tempStays.push(this.currentBedStay)

        _.forEach(tempStays, function(stay) {
            //if(stay.bed)
            let bed = Beds.findOne({ _id: stay.bed });
            stay.price = bed.roomObj().wardObj().price

            stay.bed = bed

            if (!stay.toDate) {
                stay.toDate = new Date();
            }

            let a = moment(stay.toDate);
            let b = moment(stay.fromDate);
            days = a.diff(b, 'days')
            stay.days = days == 0 ? 1 : days;

            stay.total = stay.days * stay.price

            total += stay.total
            stays.push(stay)
        });

        return { "stays": stays, "total": total };
    }
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

commonTodoCols = [
        { data: "title", title: "Title" },
        { data: "patientName()", title: "Patient"},
        { data: "patient", visible: false },
        { data: "createdBy", visible: false},
         { data: "creator()", title: "Creator"},
        { data: "createdAt", title:'Created At', 
        render: function (val, type, doc) {return moment(val).calendar();}
        }
    ]

mycols =  _.cloneDeep(commonTodoCols);
mycols.push ({ data: "description" , title:"Description"});
mycols.push({
      tmpl: Meteor.isClient && Template.doneCell
    }
);

bymeCols = mycols =  _.cloneDeep(commonTodoCols);
//mycols.push ({ data: "description" , title:"Description"});
bymeCols.push({
      tmpl: Meteor.isClient && Template.removeTodoCell
    }
);

// mycols =  _.cloneDeep(commonTodoCols);
// mycols.push ({ data: "description" , title:"Description"});
// mycols.push({
//       tmpl: Meteor.isClient && Template.doneCell
//     }
// );

new Tabular.Table({
    name: "MyTodosTbl",
    collection: Todos,
    selector(userId) {
        return { forUser: userId , completed: false};
    },
    search: {
        caseInsensitive: true,
        smart: false,
        onEnterOnly: true,
    },
    columns: mycols
})    

new Tabular.Table({
    name: "TodosByMeTbl",
    collection: Todos,
    selector(userId) {
        return { createdBy: userId , completed: false};
    },
    search: {
        caseInsensitive: true,
        smart: false,
        onEnterOnly: true,
    },
    columns: bymeCols
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
Beds.attachSchema(BedSchema)


Admissions.attachSchema(AdmissionSchema)

ScriptTemplates.attachSchema(ScriptTemplateSchema)
TestResults.attachSchema(TestResultsSchema)

Invoices.attachSchema(InvoiceSchema)
Services.attachSchema(ServiceSchema)

Todos.attachSchema(TodoSchema);
Specializations.attachSchema(SpecializationsSchema);