

Template.AdmitPatient.onCreated(function () {
    var self = this;
    self.autorun(function () {
        var id = FlowRouter.getParam('id');
        self.subscribe('FullPatient', id);
        self.subscribe('compWards')
        self.subscribe('compAdmissions')
    });
});

Template.AdmitPatient.helpers({

    patient: function () {
        var id = FlowRouter.getParam('id');
        return Patients.findOne({_id: id});

    },

    currentBed: function () {
        admission =  Admissions.findOne({patient: FlowRouter.getParam('id')})
        //console.log(admission)
        if(admission)
            return admission.currentBedStay.bed
        return null

    },

    wards: function () {
        return Wards.find();
    },

    rooms: function () {
        return Rooms.find({ward: this._id});
    },

    rbeds: function () {
        return Beds.find({room: this._id});
    }


})

Template.AvailableBed.onCreated(function () {
    var self = this;

    this.autorun(function () {
        var id = FlowRouter.getParam('id');
        self.patient = Patients.findOne({_id: id});
    });
});


Template.AvailableBed.helpers({
    isBedAvailable:function(){

        busyBeds = _.map(Admissions.find().fetch(), 'currentBedStay.bed')
        return  ! _.includes(busyBeds, this._id );
    }

})


Template.AvailableBed.events({
    'click .admit': function (event, template) {
        console.log(this.id);
        pt = FlowRouter.getParam('id')
        patient = Patients.findOne({_id: pt});

        adm =  Admissions.findOne({patient:pt, isCurrent:true})
        console.log(adm)


        if (!adm ) {

            console.log("admitting patient")

            Meteor.call('admit', this, patient, function (error, response) {
                if (error) {
                    Bert.alert(error.reason, "danger");
                    console.log(error)
                } else {
                    console.log(response)
                    Bert.alert( 'Successfully admitted patient to  bed : ', 'success', 'growl-top-right' );
                    FlowRouter.go('/viewAdmission/' + response)
                }
            });

        }
        else {

            console.log("moving patient")
            Meteor.call('move', this, adm, function (error, response) {
                if (error) {
                    Bert.alert(error.reason, "danger");
                } else {
                    Bert.alert( 'Successfully moved patient to  bed : ', 'success', 'growl-top-right' );
                    FlowRouter.go('/viewAdmission/' + adm._id)
                }
            });
        }

    }

});

