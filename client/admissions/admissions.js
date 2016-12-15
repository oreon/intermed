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
    this.mapResults = new ReactiveVar(new Map());
    this.autorun(function () {
    
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

    panelType: function () {
        adm = Admissions.findOne({ 'currentBedStay.bed': this._id })
        if (adm.condition === 'Critical')
            return "panel-danger"
        if (adm.condition === 'Recovering')
            return "panel-success"
        return 'panel-warning'
    },

    msmtNames: function () {
        adm = Admissions.findOne({ 'currentBedStay.bed': this._id })
        return Array.from(adm.recentMeasurements().keys())
    },
    msmtVals: function (key) {
        adm = Admissions.findOne({ 'currentBedStay.bed': this._id })
        console.log(adm.recentMeasurements().get(key));
        return adm.recentMeasurements().get(key)
    },
    bedpatient: function () {
        //var id = FlowRouter.getParam('id');
        //console.log(this.patient)
        let adm = Admissions.findOne({ 'currentBedStay.bed': this._id })
        //console.log(adm)
        return Patients.findOne({ _id: adm.patient });
    },

});