import { Meteor } from 'meteor/meteor'

//TODO use current facility id
Meteor.methods({

    admit: function (bedid, patientid) {

        patient = Patients.findOne({_id: patientid});

        if(patient.bed != null)
            throw new Meteor.Error("already_admitted","Patient is already admitted to bed " + patient.bed )

        Meteor.call('performAdmit', bedid, patientid);

    },
    move: function (newroomid, patientid) {

        //check(customer, Customers.simpleSchema());

        try {

            patient = Patients.findOne({_id: patientid});

            if(patient.bed == null)
                throw new Meteor.Error("not_currently_admitted","Patient must be admitted to be moved  " )




            Meteor.call('performAdmit', newroomid, patientid);


        } catch (exception) {
            throw exception;
        }



    },
    discharge: function ( patientid) {

        pt = Patients.findOne(patientid)

        Rooms.update({"beds.id": pt.bed}, {
            $set: {
                "beds.$.patient": null
            }
        });

        Patients.update({_id:patientid},  {$set:{ "bed":  null} })
    },

    performAdmit:function(bedid, patientid){
        newbed =   Rooms.findOne({"beds.id": bedid, "beds.patient": null}).beds.filter(x => x.id === bedid)[0]

        if(newbed.patient)
            throw new Meteor.Error (404,"The bed is already taken " + newbed.name )

        //if pt is currently admitted set that bed to be empty
        Rooms.update({"beds.id": patient.bed}, {
            $set: {
                "beds.$.patient": null
            }
        });

        Rooms.update({"beds.id": bedid}, {
            $set: {
                "beds.$.patient": patientid
            }
        });

        Patients.update({_id:patientid},  {$set:{ "bed":  bedid} })
    }
});