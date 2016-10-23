Template.AdmitPatient.onCreated(function () {
    var self = this;
    self.autorun(function () {
        var id = FlowRouter.getParam('id');
        self.subscribe('FullPatient', id);
        self.subscribe('compWards')
    });
});

Template.AdmitPatient.helpers({

    patient: function () {
        var id = FlowRouter.getParam('id');
        return Patients.findOne({_id: id});

    },

    wards: function () {
        return Wards.find();
    },

    rooms: function () {
        return Rooms.find({ward: this._id});
    },


})

Template.AvailableBed.onCreated(function () {
    var self = this;

    this.autorun(function () {
        var id = FlowRouter.getParam('id');
        self.patient = Patients.findOne({_id: id});
    });
});


Template.AvailableBed.events({
    'click .admit': function (event, template) {
        console.log(this.id);
        pt = FlowRouter.getParam('id')
        patient = Patients.findOne({_id: pt});

        if (patient.bed) {
            Meteor.call('admit', this.id, pt);
            Bert.alert( 'Successfully admitted patient to  bed : ', 'success', 'growl-top-right' );

        }
        else {
            Meteor.call('move', this.bed, this.id, pt);
            Bert.alert( 'Successfully moved patient to new bed : ', 'success', 'growl-top-right' );
        }


        FlowRouter.go('/recipe/' + pt)
    }

});

