import { Meteor } from 'meteor/meteor';
//import {Roles} from 'alanning/roles'
import moment from 'moment'
import { userFullName, userFullNameById, findInvTotal } from '/imports/utils/misc.js';

import * as utils from '/imports/utils/misc.js';

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

PatientFiles = new FS.Collection("patientFiles", {
    stores: [new FS.Store.GridFS("filesStore", {})]
});

Images = new FS.Collection("images", {
    stores: [new FS.Store.GridFS("images", {})]
});

//TODO set rules on image security
Images.allow({
    insert: function (userId, doc) {
        return true;
    },
    update: function (userId, doc, fieldNames, modifier) {
        return true;
    },
    download: function (userId) {
        return true;
    },
    remove: function (userId) {
        return true;
    },
});

patientName = {type:String, optional:true ,  autoform: {type: "hidden"},}

tmStamp = {
    type: Date,
    optional: true,
    autoform: {
        type: "hidden"
    },
    autoValue: function () {
        return new Date();
    },
}

creatorId = {
    type: String,
    optional: true,
    autoValue: function () {
        return this.userId
    },
    autoform: {
        type: "hidden"
    },
}

creator = {
    type: String,
    optional: true,
    autoValue: function () {
        return userFullName(Meteor.users.find(this.userId))
    },
    autoform: {
        type: "hidden"
    },
}


Wards = new Mongo.Collection('wards')
Rooms = new Mongo.Collection('rooms')
Admissions = new Mongo.Collection('admissions')
Beds = new Mongo.Collection('beds')

class ChartsCollection extends Mongo.Collection {
    insert(list, callback, language = 'en') {
        const ourList = list;
        if (!ourList.name) {
            const defaultName = TAPi18n.__('lists.insert.list', null, language);
            let nextLetter = 'A';
            ourList.name = `${defaultName} ${nextLetter}`;

            while (this.findOne({ name: ourList.name })) {
                // not going to be too smart here, can go past Z
                nextLetter = String.fromCharCode(nextLetter.charCodeAt(0) + 1);
                ourList.name = `${defaultName} ${nextLetter}`;
            }
        }

        return super.insert(ourList, callback);
    }
    remove(selector, callback) {
        Todos.remove({ listId: selector });
        return super.remove(selector, callback);
    }
}

export const Lists = new ChartsCollection('Charts');



BaseSchema = new SimpleSchema({

    createdAt: {
        type: Date,
        optional: true,
        autoValue: function () {
            try {
                if (this.isInsert) {
                    return new Date();
                } else if (this.isUpsert) {
                    return { $setOnInsert: new Date() };
                } else {
                    this.unset();  // Prevent user from supplying their own value
                }
            } catch (e) {
                console.log(e)
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
            try {
                if (this.isInsert) {
                    return this.userId
                } else if (this.isUpsert) {
                    return { $setOnInsert: this.userId };
                } else {
                    this.unset();  // Prevent user from supplying their own value
                }
            } catch (error) {
                console.log(error)
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
            try {
                if (this.isUpdate) {
                    return new Date();
                }
            } catch (error) {
                console.log(error)
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

EventSchema = new SimpleSchema({
    name: { type: String },
    creator: creator,
    creatorId: creatorId,
    date: tmStamp
})


SpecializationsSchema = new SimpleSchema([BaseSchema, {
    name: { type: String },
}])

ServiceSchema = new SimpleSchema([BaseSchema, {
    name: { type: String },
    price: { type: Number },
    autoCreated: {
        type: Boolean,
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
            options: function () {
                return Services.find({ autoCreated: false } ).map(function (c) {
                    return { label: c.name + " - Rs" + c.price, value: c.name };
                });
            }
        },
        label:"Service"
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
    // total: {
    //     type: Number,
    //     optional: true,
    //     defaultValue: 0 ,
    //     autoform: {
    //         readonly: true
    //     }
    // },
    remarks: {
        type: String,
        optional: true
    }

}])

LineItemACSchema = new SimpleSchema([LineItemSchema, {
    service: {
        type: String,
        optional:true,
        autoform: {
            type: "select",
            options: function () {
                return Services.find({ autoCreated: true } ).map(function (c) {
                    return { label: c.name + " - Rs" + c.price, value: c.name };
                });
            }
        },
        label:"Service"
    },
}])

InvoiceSchema = new SimpleSchema([BaseSchema, {
    admission: {
        type: String,
        optional: true,
        autoform: {
            type: "hidden"
        }
    },
    patientName:patientName,
    comments: { type: String, optional: true },
    items: { type: [LineItemSchema], optional: true },
    autoCreatedItems: {
        type: [LineItemACSchema],
        optional: true,
        // autoform: {
        //     type: "hidden"
        // }
    },
    // total: {
    //     type: Number,
    //     //defaultValue: 0 ,
    //     optional: true,
    //     autoValue: function () {
    //         let dueFld = this.field("isDue");
    //         //console.log(dueFld)
    //         //console.log(this.doc.total)
        
    //         if (dueFld.isSet && dueFld["value"] == true) { return this.field("total")["value"] }

    //         let items = this.field("items");
    //         if (items.isSet) {
                 
    //             let itemsVal = items["value"];
    //             let total = _.reduce(itemsVal, function (sum, item) {
    //                 item.total = item.appliedPrice * item.units
    //                 return sum + (item.total ? item.total : 0);
    //             }, 0);
    //             return total;
    //         }
    //         return 0;
    //     },
    //     autoform: {
    //         readonly: true
    //     }
    // },
    total: { type: Number, optional: true  },
    amountPaid: { type: Number, optional: true },
    datePaid: {
        type: Date, optional: true
    },
    isDue: {
        type: Boolean, optional: true,
         autoform: {
            type: "hidden"
        }
    },
    paymentType: {
        type: String,
        allowedValues: ['Cheque', 'Cash', 'Card', 'Other'],
        optional: true
    }

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

LabsAndImagingSchema = new SimpleSchema({
    tests: {
        type: [String],
        optional: true,
        autoform: {
            type: "select-checkbox",
            options: function () {
                return LabTests.find().map(function (c) {
                    return { label: c.name, value: c._id };
                });
            }
        }
    },
    imagings: {
        type: [ImagingSchema],
        optional: true,
    },
})


/////// facility schema //////

RoomSchema = new SimpleSchema([BaseSchema, {
    name: { type: String },
    type: { type: String, optional: true },
    beds: { type: [BedSchema], optional: true },
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
    name: { type: String },
    address: { type: String },
    city: { type: String },
    specializations: {
        type: [String],
        autoform: {
            type: "select-checkbox",
            options: function () {
                return Specializations.find().map(function (c) {
                    return { label: c.name, value: c.name };
                });
            }
        }
    },
    taxes: {
        type: Number,
    }

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
            type: "hidden",
        },
    },
    admission: {
        type: String,
        optional: true,
        autoform: {
            type: "hidden",
        },
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
    mainValue: { type: Number, decimal: true, optional: true },
    values: { type: [TestResultValue], optional: true }
}
])

MeasurementSchema = new SimpleSchema([BaseSchema, {
    measurement: {
        type: String,
        optional: false,
        allowedValues: ['BP', 'Temperature', 'PO2', 'Blood Sugar', 'Pulse', 'Breaths Per Minute']
    },
    mainValue: { type: Number, optional: true },
    values: { type: [TestResultValue], optional: true }
}])

DrugAllergySchema = new SimpleSchema([BaseSchema, {
    drug: {
        type: String,
        autoform: {
            type: "select",
            options: function () {
                return Drugs.find().map(function (c) {
                    return { label: c.name, value: c._id };
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

ImmunizationSchema = new SimpleSchema([BaseSchema, {
    vaccine: {
        type: String,
        allowedValues: ['BCG', 'DPT', 'HepA&B', 'HPV', 'Flu', 'Tetanus Toxoid', 'Pneumonia'],
        // autoform: {
        //     type: "select2"
        // }
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
        label: "Times "
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

RecurringAssessmentItemSchema = new SimpleSchema({
    name: {
        type: String,
        label: 'Name of the measurement e.g Blood Pressure, Blood Sugar etc'
    },
    frequency: {
        type: FrequencySchema,
    },
    instructions: { type: String, optional: true },
})


ScriptItem = new SimpleSchema([BaseSchema, {
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
        type: FrequencySchema,
    },
    quantity: { type: Number, defaultValue: 1 },
    duration: { type: DurationSchema },
    prn: { type: Boolean, optional: true, label: ''/* 'PRN (as needed) ' */ },

    instructions: { type: String, optional: true },
    startDate:{
        type: Date,
        optional: true,
        label: "Start Date (Leave empty for now)",
    },
    endDate: {
        type: Date,
        optional: true,
        // autoValue: function () {
        //     let content = this.field("duration");
        //     if (content.isSet) {
        //         duration = content.value;
        //         Console.log(dur);
        //         enddt = new moment().duration.for, duration.type.toLowerCase()
        //         return enddt;
        //     } else {
        //         console.log("No duration")
        //     }
        // },
        autoform: {
            readonly: true
        }
    },
}])

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
        autoValue: function () {
            console.log(this.value)
            return utils.massageScriptItems(this.value);
        }
    }, 
}])

ScriptTemplateSchema = new SimpleSchema([ScriptSchema, {
    name: {
        type: String
    },
    script: { type: ScriptSchema }
}])


EncounterSchema = new SimpleSchema([BaseSchema, {

    patient: {
        type: String,
        autoform: {
            type: "hidden",
        }
    },
    preliminaryDiagnosis: {
        type: String,
        optional: true,
    },
    reason: {
        type: String,
        autoform: {
            type: "textarea"
        }
    },
    script: {
        type: ScriptSchema,
        optional: true,
    },
    labsAndImages: {
        type: LabsAndImagingSchema,
        optional: true,
    },
}])



VisitSchema = new SimpleSchema([BaseSchema, {
    note: {
        type: String,
        autoform: {
            type: "summernote"
        }
    },  
    createdBy: {
        type: String,
        autoValue: function () { return this.userId },
        autoform: {
            type: "hidden"
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
    contactPhone: {
        type: String,
        optional: true
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
    pregnant: {
        type: Boolean,
        optional: true,
    },
    pastMedicalHistory: {
        type: String,
        optional: true,
        autoform: {
            type: "textarea",
        }
    },
    socialHistory: {
        type: String,
        optional: true,
        autoform: {
            type: "textarea",
        }
    },
    permanentMeds: {
        type: [String],
        optional: true,
    },
    drugAllergies: { type: [DrugAllergySchema], optional: true },
    immunizations: { type: [ImmunizationSchema], optional: true },
    orderedLabsAndImages: { type: LabsAndImagingSchema, optional: true },
    // files: {
    //     type: String,
    //     optional:true,
    //     autoform: {
    //         afFieldInput: {
    //             type: 'fileUpload',
    //             collection: 'Images'
    //         }
    //     }
    // }


}])



DischargeSchema = new SimpleSchema({
    dischargeNote: {
        type: String,
        optional: true,
        autoform: {
            type: "textarea"
        }
    },

    dischargeType: {
        type: String,
        //label: "Route",
        defaultValue: 'Recovered',
        allowedValues: ['Recovered', 'Referred', 'Deceased']
    },
    referredTo: {
        type: String,
        optional: true,
        //label: "Institution the patient has been referred to",
    },
    dischargeDate: tmStamp,
})

AdmissionSchema = new SimpleSchema([BaseSchema, {
    patient: {
        type: String,
        optional: false,
        autoform: {
            type: "hidden"
        }
    },
    patientName:patientName,
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
    admitDate: tmStamp,
    reason: {
        type: String,
        optional: true,
    },
    admissionType: {
        type: String,
        optional: true,
        autoform: {
            type: "select2",
            options: function () {
                //TODO - fix the find to use correct facility
                fac = Facilities.findOne();
                console.log(fac.specializations)
                return fac.specializations.map((c) => { return { label: c, value: c } })
            }
        }
    },
    admissionNote: {
        type: String,//orion.attribute('summernote'),
        optional: true,
        autoform: {
            type: "summernote",
            rows: 4
        }
    },
    dischargeSection: {
        type: DischargeSchema,
        optional: true
    },
    condition: {
        type: String,
        //allowedValues: ['Cheque', 'Cash', 'Card', 'Other'], 
        allowedValues: ['Recovering', 'Stable', 'Critical'],
        defaultValue: 'Stable',
        autoform: {
            type: "select-radio",
            // options:   ['Recovering','Stable', 'Critical']
        }
    },

    visits: {
        type: [VisitSchema],
        optional: true,
    },
    script: {
        type: ScriptSchema,
        optional: true,
    },
    recurringAssessments: {
        type: [RecurringAssessmentItemSchema],
        optional: true,
    },
    labsAndImages: {
        type: LabsAndImagingSchema,
        optional: true,
    },
    tests: {
        type: [TestResults],
        optional: true,
    },
    measurements: {
        type: [MeasurementSchema],
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

Comments = new SimpleSchema([BaseSchema, {
    comment: {
        type: String,
        autoform: {
            type: "textarea"
        }
    }
}])

TodoSchema = new SimpleSchema([BaseSchema, {
    patient: {
        type: String,
        optional: true,
        autoform: {
            type: "hidden"
        }
    },
    title: {
        type: String,
    },
    description: {
        type: String,
        optional: true,
        autoform: {
            type: "textarea"
        }
    },
    forUser: {
        type: String,
        autoform: {
            type: "select2",
            options: function () {
                return Meteor.users.find().map(function (c) {
                    return { label: userFullNameById(c._id).fork(e => "drx", s => s), value: c._id };
                });
            }
        }
    },
    completed: {
        type: Boolean,
        defaultValue: false,
        optional: true
    },
    dateCompleted: {
        type: Date,
        autoValue: function () {
            return new Date();
        },
        autoform: {
            type: "hidden"
        }
    },
    comments: { type: [Comments], optional: true }

}])




Patients.allow({
    insert: (userId, doc) => !!userId,
    update: function (userId, doc) {
        return !!userId
    }
})

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

PatientFiles.allow({
    insert: (userId, doc) => !!userId,
    update: function (userId, doc) {
        return !!userId
    },
    download: function (userId, fileObj) {
        return true
    }
})

TestResults.allow({
    insert: (userId, doc) => !!userId,
    update: function (userId, doc) {
        return !!userId
    }
})

Encounters.allow({
    insert: (userId, doc) => !!userId,
    update: function (userId, doc) {
        return !!userId
    }
})

Todos.allow({
    insert: (userId, doc) => !!userId,
    update: function (userId, doc) {
        return !!userId
    },
    remove: function (userId, doc) {
        return userId == doc.createdBy
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
            //console.log("found bed " + adm.currentBedStay.bed)
            return Beds.findOne(adm.currentBedStay.bed);
        }
        return null
    },
    encounters: function () {
        return Encounters.find({ patient: this._id });
    },
    testResults: function () {
        TestResults.find({ patient: this._id });
    },
    isAdmitted: function () { return !!this.currentAdmisson() },
    currentAdmisson: function () {
        return Admissions.findOne({ patient: this._id });
    }
})

Wards.helpers({
    busyBeds: function () {
        return this.roomObj().fullName() + '-' + this.name;
    },
})

Beds.helpers({
    fullName: function () {
        return this.roomObj().fullName() + '-' + this.name;
    },
    roomObj: function () { return Rooms.findOne({ _id: this.room }) },
    admission: function () {
        bed = (typeof this._id === "object") ? this._id.toHexString() : this._id;
        return Admissions.findOne({ 'currentBedStay.bed': bed })
    },
    wardObj: function () {
        return this.roomObj().wardObj()
    }
})
Rooms.helpers({
    fullName: function () {
        return this.wardObj().name + '-' + this.name;
    },
    wardObj: function () { return Wards.findOne({ _id: this.ward }) }
})

Todos.helpers({
    patientName: function () {
        pt = Patients.findOne({ _id: this.patient })
        return "<a href='/patient/" + this.patient + "'>" + pt.fullName() + "</a>";
    },
    creator: function () {
        return userFullNameById(this.createdBy).fork(err => "Dr Unknown", data => data)
    },
    assignee: function () {
        return userFullNameById(this.forUser).fork(err => "Dr Unknown", data => data)
    }
})

Admissions.helpers({
    currentBed: function () {
        if (this.currentBedStay) {
            return Beds.findOne(this.currentBedStay.bed);
        }
        return null
    },
    currentBedName: function () {
        return (this.currentBed()) ? this.currentBed().fullName() : "Discharged"
    },
    patientObj: function () {
        return Patients.findOne({ _id: this.patient })
    },
    invoice: function () {
        inv = Invoices.findOne({ admission: this._id }); //, { $set: {admission:this._id} });
        return inv;
    },
    tests: function () {
        if (!this.labsAndImages) return;

        return _(this.labsAndImages.tests)
            .map(x => LabTests.findOne(x))
            .value();
    },
    testResults: function () {
        return TestResults.find({ admission: this._id });
    },
    bedStaysObj: function () {
        stays = []
        total = 0;

        tempStays = _.cloneDeep(this.bedStays);
        if(this.currentBedStay)
            tempStays.push(this.currentBedStay)

        _.forEach(tempStays, function (stay) {
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
    },
    recentMeasurements() {
        mapResults = new Map();
        msmts = _.groupBy(this.measurements, function (a) { return a.measurement })
        _.forOwn(msmts, function (val, key) {
            msmts[key] = _(val).orderBy(['updatedAt'], ['desc'])
                .take(2)
                .value();
            // = _.take(val, 2)
        });
        //console.log(msmts)
        return msmts;
    },

})

Invoices.helpers({
    admissionObj: function () {
        return Admissions.findOne(this.admission)
    },
    patientName: function () {
        this.admissionObj().patientName();
    },
    allItems: function () {
        return _(this.items).concat(this.autoCreatedItems ? this.autoCreatedItems : []).value();
    },
    totalCurrent: function () { return findInvTotal(this); },
    grandTotal: function () {
        adm = this.admissionObj();
        bedStayTotal = adm.bedStaysObj().total;
        invTotal = findInvTotal(this)
        console.log(invTotal)
        if (adm) {
            return (this) ? bedStayTotal + invTotal : bedStayTotal;
        }
        return 0;
    },
})


Encounters.helpers({
    patientName: function () {
        pt = Patients.findOne({ _id: this.patient })
        return "<a href='/patient/" + this.patient + "'>" + pt.fullName() + "</a>";
    },
    creator: function () {
        user = Meteor.users.findOne({ _id: this.createdBy })
        return user.profile.firstName + " " + user.profile.lastName;
    },
})



TestResults.helpers({
    labTestObj: function () {
        return LabTests.findOne(this.labTest)
    },
    labTestName: function () {
        return this.labTestObj().name
    },
    valueStr: function () {
        if (this.mainValue)
            return this.mainValue
        else {
            let ret = '';
            _.forEach(this.values, function (elem) {
                ret += `${elem.name}: ${elem.value} `
            })
            return ret;
        }
    }
})


////////////////// Hooks /////////////////

Admissions.before.insert( (userId, doc) => doc.patientName = Patients.findOne(doc.patient).fullName());

Admissions.after.insert( (userId, doc) => {
    inv = { "admission": doc._id }
    InvoiceSchema.clean(inv);
    check(inv, InvoiceSchema);
    Invoices.insert(inv)
})

Admissions.before.update( (userId, doc, fieldNames, modifier, options) => {
    modifier.$set = modifier.$set || {};
    modifier.$set.patientName = Patients.findOne(doc.patient).fullName()
});

Beds.before.update( (userId, doc, fieldNames, modifier, options) => {
    modifier.$set = modifier.$set || {};
    modifier.$set.ward = Beds.findOne(bed.room).ward
})

Beds.before.insert( (userId, doc) => {
    doc.ward = Beds.findOne(bed.room).ward
})

// massageScriptItems = (items) =>
// _(items).map(item => {
//                     item.startDate = item.startDate ? item.startDate: new Date();
//                     item.endDate = new moment(item.startDate).add(item.duration.for,
//                     item.duration.type.toLowerCase()).toDate();
//                     console.log(item)
//                    }).value() 


Scripts.before.update( (userId, doc, fieldNames, modifier, options) => {
    console.log("before scirpt update")
    modifier.$set = modifier.$set || {};
    console.log(fieldNames)
    modifier.$set.items =  massageScriptItems(modifier.$set.items)
});

Scripts.before.insert( (userId, doc) => doc.items = massageScriptItems(modifier.$set.items) )



Invoices.before.insert( (userId, doc) => {
    admission = Admissions.findOne(doc.admission)
    doc.patientName = admission.patientName;
});


// Invoices.before.update( (userId, doc, fieldNames, modifier, options) => {
//      modifier.$set = modifier.$set || {};
//      (itemsVal, function (sum, item) {
//                     item.total = item.appliedPrice * item.units
//      modifier.$set.total = findInvTotal(Invoices.findOne(doc._id))
//  });

// Admissions.after.insert(function (userId, doc) {
//   doc.patientName = 
// });


//import {admHelpers} from '/imports/api/helpers'
defSearch = { caseInsensitive: true, smart: false, onEnterOnly: true, }

updateDate = {
    data: "updatedAt", title: "Updated ",
    render: (val, type, doc) => moment(val).calendar()
},

invcols =  [
        //{ data: "fullName()", title: "Full Name" },
        { data: "patientName", title: "Patient" },
        { data: "admission", title: "Admission" },
        { data: "total", title: "Total" },
        {
            data: "_id",
            render: (val, type, doc) =>
                `<a href='editInvoice/${val}'> <i class='fa fa-map'/></a>`
        },
        updateDate,
    ]

new Tabular.Table({
    name: "InvoicesTbl",
    collection: Invoices,
    search: defSearch,
    columns: invcols
})

new Tabular.Table({
    name: "allInvoicesTbl",
    collection: Invoices,
    search: defSearch,
    columns: invcols
})


new Tabular.Table({
    name: "AdmissionsTbl",
    collection: Admissions,
    search: defSearch,
    columns: [
        //{ data: "fullName()", title: "Full Name" },
        { data: "patientName", title: "Patient" },
        updateDate,
        { data: "currentBedName()", title: "Bed" },
        { data: "currentBedStay", visible: false },
        {
            data: "_id",
            render: (val, type, doc) =>
                `<a href='viewAdmission/${val}'> <i class='fa fa-map'/></a>`
        },
        {
            data: "_id",
            render: (val, type, doc) =>
                `<a href='visit/${val}' class="btn btn-primary"> Visit</a>`
        },
        
    ]
})


new Tabular.Table({
    name: "PatientsTbl",
    collection: Patients,
    search: defSearch,
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
    ]
});

commonTodoCols = [
    { data: "title", title: "Title" },
    { data: "patientName()", title: "Patient" },
    { data: "patient", visible: false },
    { data: "createdBy", visible: false },
    { data: "creator()", title: "Creator" },
    { data: "assignee()", title: "Assignee" },
    {
        data: "createdAt", title: 'Created At',
        render: function (val, type, doc) { return moment(val).calendar(); }
    }
]

mycols = _.cloneDeep(commonTodoCols);
mycols.push({ data: "description", title: "Description" });
mycols.push({
    tmpl: Meteor.isClient && Template.doneCell
}
);


bymeCols = _.cloneDeep(commonTodoCols);
//bymeCols.push({ data: "assignee()", title: "Assignee" })

//mycols.push ({ data: "description" , title:"Description"});
bymeCols.push({
    tmpl: Meteor.isClient && Template.removeTodoCell
}
);

ptTodoCols = _.cloneDeep(bymeCols);
ptTodoCols.push({
    tmpl: Meteor.isClient && Template.doneCell
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
        return { forUser: userId, completed: false };
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
        return { createdBy: userId, completed: false };
    },
    search: {
        caseInsensitive: true,
        smart: false,
        onEnterOnly: true,
    },
    columns: bymeCols,
    extraFields: ['forUser']
})

new Tabular.Table({
    name: "TodosPtTbl",
    collection: Todos,
    selector() {
        return { completed: false };
    },
    search: {
        caseInsensitive: true,
        smart: true,
        onEnterOnly: true,
    },
    columns: ptTodoCols,
    extraFields: ['forUser']
})

new Tabular.Table({
    name: "TestResultsAdmTbl",
    collection: TestResults,
    // selector() {
    //     return {   completed: false};
    // },
    search: {
        caseInsensitive: true,
        smart: false,
        onEnterOnly: true,
    },
    columns: [
        { data: "labTestName()", title: "Lab Test" },
        { data: "labTest", visible: false },
        {
            data: "valueStr()", title: "Value "
        },
        {
            data: "createdAt", title: 'Created At',
            render: function (val, type, doc) { return moment(val).calendar(); }
        }
    ],
    extraFields: ['mainValue', 'values']
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