//TODO use current facility id
Meteor.methods({

    admit: function (bedid, patientid) {

        Rooms.update({"beds.id": bedid}, {
            $set: {
                "beds.$.patient": patientid
            }
        });

        Patients.update({_id:patientid},  {$set:{ "bed":  bedid} })
    },
    move: function (previd, newroomid, patientid) {

        Rooms.update({"beds.id": previd}, {
            $set: {
                "beds.$.patient": null
            }
        });

        admit(newroomid, patientid)
    },
    discharge: function ( patientid) {

        pt = Patients.findOne(patientid)

        Rooms.update({"beds.id": pt.bed}, {
            $set: {
                "beds.$.patient": null
            }
        });

        Patients.update({_id:patientid},  {$set:{ "bed":  null} })
    }
});