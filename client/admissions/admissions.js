Template.Admissions.onCreated(function () {
    var self = this;
    self.autorun(function () {
        //var id = FlowRouter.getParam('id');
        //self.subscribe('FullPatient', id);
        self.subscribe('compWards')
        //self.subscribe('compPts')
        self.subscribe('compAdmissions')
        // self.subscribe('Admissions')
    });
});

Template.Admissions.helpers({

    wards: function () {
        return Wards.find();
    },

    rooms: function () {
        return Rooms.find({ ward: this._id });
    },

    rbeds: function () {
        return Beds.find({ room: this._id });
    }

})


Template.Admitted.onCreated(function () {
    var self = this;

    this.autorun(function () {
        //console.log(this)
        //self.subscribe('compPt', this.patient)
    });
});


Template.Admitted.helpers({

    bedHasPatient: function () {

        busyBeds = _.map(Admissions.find().fetch(), 'currentBedStay.bed')
        return _.includes(busyBeds, this._id);
    },

    admission: function () {
        return Admissions.findOne({ 'currentBedStay.bed': this._id })
    },

    color: function () {
        adm = Admissions.findOne({ 'currentBedStay.bed': this._id })
        if (adm.condition === 'Critical')
            return "pink"
        if (adm.condition === 'Recovering')
            return "#efe"

        return '#eee'
    },

    bedpatient: function () {
        //var id = FlowRouter.getParam('id');
        //console.log(this.patient)
        let adm = Admissions.findOne({ 'currentBedStay.bed': this._id })
        //console.log(adm)
        return Patients.findOne({ _id: adm.patient });
    },

});