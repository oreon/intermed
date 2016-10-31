import { Meteor } from 'meteor/meteor'
import moment from 'moment';
//import { findBed } from '../collections/utils'
//import diff from 'diff'
var diff = require('rus-diff').diff

import { ValidatedMethod } from 'meteor/mdg:validated-method';

function findBed(bedid) {
    return Rooms.findOne({"beds.id": bedid, "beds.patient": null}).beds.filter(x => x.id === bedid)[0]
}

function findBedForAdmission(admission) {
    return admission.bedStays[admission.bedStays.length - 1].bed
    //return Rooms.findOne({"beds.id": bedid, "beds.patient": null}).beds.filter(x => x.id === bedid)[0]
}

function createBedStay(bed) {
    bedStay = {};
    bedStay.bed = bed._id;
    bedStay.fromDate = new Date();
    return bedStay;
}

//TODO errors are not being thrown to the client - maybe mdg validate method will alleviate this

async function updateAdmission(admission) {

    try {
        admId = admission._id;

        if (Meteor.isServer) {
            AdmissionSchema.clean(admission);
            check(admission, AdmissionSchema);


            let orgAdmission = Admissions.findOne({_id: admId})
            admission._id = admId //cleaning removes the id

            delta = diff(orgAdmission, admission)

            console.log(delta);

            res =  await Admissions.update({_id: admId}, delta, function (error, result) {
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
        throw exception;
    }
}


//TODO use current facility id
Meteor.methods({

    admit: async function (bed, patient) {

        //TODO major all changes should be rolled back on exception

        try {

            //patient = Patients.findOne({_id: patientid});

            if (patient.bed != null)
                throw new Meteor.Error("already_admitted", "Patient is already admitted to bed " + patient.bed)

            let admission = {};
            admission.bedStays = [];
            admission.patient = patient._id;

            admission.currentBedStay = createBedStay(bed);

            if (Meteor.isServer) {
                AdmissionSchema.clean(admission);
                check(admission, AdmissionSchema);
            }

            return Admissions.insert(admission, function (error, result) {
                if (error)
                    throw new Meteor.Error(500, error)
                //throw new Meteor.Error(500, "test error")
                console.log(result)
                return result;
                //Meteor.call('setPatientBed', bedid, result, false);
            })

        } catch (exception) {
            console.log(exception)
            throw exception;
        }

    },
    move: function (bed, admission) {

        try {

            // admission = Admissions.findOne({_id:admissionid});

            //patient = Patients.findOne({_id: patientid});

            //if (patient.bed == null)
            //    throw new Meteor.Error("not_currently_admitted", "Patient must be admitted to be moved  ")

            admission.currentBedStay.toDate = new Date();
            admission.bedStays.push(admission.currentBedStay);

            admission.currentBedStay = createBedStay(bed);

            updateAdmission(admission)

        } catch (exception) {
            console.log(exception)
            throw exception;
        }


    },
     discharge: async function (admission) {

        //if (patient.bed == null)
        //    throw new Meteor.Error("not_currently_admitted", "Patient must be admitted to be discharged ")
        try {
            admission.currentBedStay.toDate = new Date();
            admission.bedStays.push(admission.currentBedStay);

            admission.isCurrent = false;
            delete admission.currentBedStay;

            return await updateAdmission(admission)
        } catch (exception) {
            console.log(exception)
            throw exception;
        }
    },

    setPatientBed: async function (bedid, patientid, move) {
        newbed = Rooms.findOne({"beds.id": bedid, "beds.patient": null}).beds.filter(x => x.id === bedid)[0]

        if (newbed.patient)
            throw new Meteor.Error(404, "The bed is already taken " + newbed.name)


        await Rooms.update({"beds.id": bedid}, {$set: {"beds.$.patient": patientid}}
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

    toggleDischargeEligible: function (id, currentState) {

        return Admissions.update(id, {
            $set: {
                eligibleForDischarge: !currentState
            }, function(error, response){
                if (error) throw error;
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