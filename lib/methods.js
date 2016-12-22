import { Meteor } from 'meteor/meteor'
import moment from 'moment';
//import { findBed } from '../collections/utils'
//import diff from 'diff'
var diff = require('rus-diff').diff

import { ValidatedMethod } from 'meteor/mdg:validated-method';

import * as utils from '/imports/utils/misc.js';

function findBed(bedid) {
    return Rooms.findOne({ "beds.id": bedid, "beds.patient": null }).beds.filter(x => x.id === bedid)[0]
}

function findBedForAdmission(admission) {
    return admission.bedStays[admission.bedStays.length - 1].bed
    //return Rooms.findOne({"beds.id": bedid, "beds.patient": null}).beds.filter(x => x.id === bedid)[0]
}

function createBedStay(bed) {
    bedStay = {};
    bedStay.bed = (typeof bed._id === "object") ? bed._id.toHexString() : bed._id;

    bedStay.fromDate = new Date();
    return bedStay;
}

//TODO errors are not being thrown to the client - maybe mdg validate method will alleviate this

function updateBedStay(admission) {
    admission.currentBedStay.toDate = new Date();
    admission.bedStays.push(admission.currentBedStay);
}


async function updateAdmission(admission) {

    try {
        admId = admission._id;

        if (Meteor.isServer) {
            AdmissionSchema.clean(admission);
            check(admission, AdmissionSchema);


            let orgAdmission = Admissions.findOne({ _id: admId })
            admission._id = admId //cleaning removes the id

            delta = diff(orgAdmission, admission)

            console.log(delta);

            res = await Admissions.update({ _id: admId }, delta, function (error, result) {
                if (error)
                    throw new Meteor.Error(500, error)

                if (result == 0) {
                    throw new Meteor.Error(500, "Something went wrong updating the admission " + newbed.name)
                }

                return result;
            });

            return res;

        }

    } catch (exception) {
        throw new Meteor.Error(500, "Something went wrong updating the admission " + exception);
    }
}


//TODO use current facility id
Meteor.methods({

    admit: async function (bed, patient) {

        //TODO major all changes should be rolled back on exception
        try {
            if (patient.bed != null)
                throw new Meteor.Error("already_admitted", "Patient is already admitted to bed " + patient.bed)

            let admission = {};
            admission.bedStays = [];
            admission.patient = patient._id;

            admission.currentBedStay = createBedStay(bed);



            if (Meteor.isServer) {
                console.log(admission.currentBedStay)
                AdmissionSchema.clean(admission);
                check(admission, AdmissionSchema);
            }

            console.log(admission)

            return Admissions.insert(admission, function (error, result) {
                if (error)
                    throw new Meteor.Error(500, error)
                console.log(result)
                return result;
                //Meteor.call('setPatientBed', bedid, result, false);
            })

        } catch (exception) {
            console.log(exception)
            throw new Meteor.Error(500, error)
        }

    },
    move: function (bed, admission) {

        try {

            // admission = Admissions.findOne({_id:admissionid});

            //patient = Patients.findOne({_id: patientid});

            //if (patient.bed == null)
            //    throw new Meteor.Error("not_currently_admitted", "Patient must be admitted to be moved  ")

            updateBedStay(admission)

            admission.currentBedStay = createBedStay(bed);

            updateAdmission(admission)

        } catch (exception) {
            console.log(exception)
            throw new Meteor.Error(500, exception)
        }


    },
    discharge: async function (admission) {

        //if (patient.bed == null)
        //    throw new Meteor.Error("not_currently_admitted", "Patient must be admitted to be discharged ")
        try {
            admission = Admissions.findOne({ "_id": admission._id })

            admission.currentBedStay.toDate = new Date();
            admission.bedStays.push(admission.currentBedStay);

            admission.isCurrent = false;
            delete admission.currentBedStay;

            service = Services.findOne({ name: "Room Stay" })
            if (!service)
                throw new Meteor.Error(400, "No 'room stay' service found - make sure the services collection is uptodate");

            res = await updateAdmission(admission)

            orginv = Invoices.findOne({ "admission": admission._id })
            inv = _.cloneDeep(orginv)


            if (inv) {
                roomStayItem = utils.createInvoiceItemBasic(inv, service.name,
                    admission.bedStaysObj()['total'])
                inv.isDue = true;
                if(!inv.autoCreatedItems) inv.autoCreatedItems = []
                inv.autoCreatedItems.push( roomStayItem);
                console.log(inv)
                inv.total = utils.findInvTotal(inv);
                
                delta = diff(orginv, inv)
                console.log(delta)
                utils.taskDbUpdate(Invoices, inv._id, delta)
                    .fork(
                    err => { console.error(err); throw new Meteor.Error(`Error on invoice update  ${err} ${inv._id} `) },
                    succ => console.log("invoice updated after discharge" + succ))

            } else {
                throw new Meteor.Error("No invoice found for admission " + admission._id)
            }

            return res;
        } catch (exception) {
            console.log(exception)
            throw new Meteor.Error(500, "Error occured -  " + exception);
        }
    },

    setPatientBed: async function (bedid, patientid, move) {
        newbed = Rooms.findOne({ "beds.id": bedid, "beds.patient": null }).beds.filter(x => x.id === bedid)[0]

        if (newbed.patient)
            throw new Meteor.Error(404, "The bed is already taken " + newbed.name)


        await Rooms.update({ "beds.id": bedid }, { $set: { "beds.$.patient": patientid } }
            , function (error, result) {
                if (error)
                    throw new Meteor.Error(500, error)

                if (result == 0) {
                    throw new Meteor.Error(500, "Something went  wrong moving patient to new bed " + newbed.name)
                }
            });

        /*
         Patients.update({_id: patientid}, {$set: {"bed": bedid}}, function (error, result) {
         if (error)
         throw new Meteor.Error(500, error)

         if (result == 0) {
         throw new Meteor.Error(500, "Something went  wrong moving patient to new bed " + newbed.name)
         }
         })*/

    },

    markDone: function (id, currentState) {

        return Todos.update(id, {
            $set: {
                completed: true
            }, function(error, response) {
                if (error) throw new Meteor.Error(500, "went wrong changing todo status " + error);
                return response;
            }
        });
    },

    toggleDischargeEligible: function (id, currentState) {

        return Admissions.update(id, {
            $set: {
                eligibleForDischarge: !currentState
            }, function(error, response) {
                if (error) throw new Meteor.Error(500, "went wrong setting discharge eligiblity " + error);
                return response;
            }
        });

        // //TODO check role is physican for this function
        // console.log(adm.eligibleForDischarge)
        //
        //// adm.eligibleForDischarge = !adm.eligibleForDischarge
        //
        //return updateAdmission(adm)
    }
    ,
})
    ;

//toggleMenuItem: function (id, currentState) {
//
//},