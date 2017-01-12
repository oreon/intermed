import * as utils from '/imports/utils/misc.js';

Template.Admissions.onCreated(function () {
    var self = this;
    self.autorun(function () {
        Session.set('currentWards', { wards: null });
        self.subscribe('compWards')
        //self.subscribe('compPts')
        self.subscribe('compAdmissions')
        // self.subscribe('Admissions')
    });
});

Template.Admissions.helpers({

    getCurrentWards: () => Session.get('currentWards'),

    wards: function () {
        //console.log(utils.wardsWithPatients());
        currentWards = Session.get('currentWards');
        console.log(currentWards)
        if (currentWards && currentWards.wards)
            return Wards.find({ _id: { $in: currentWards.wards } });
        else
            return utils.wardsWithPatients();
    },

    rooms: function () {
        return Rooms.find({ ward: this._id });
    },

    rbeds: function () {
        return Beds.find({ room: this._id });
    }
    ,
    adm: function () {
        bed = (typeof this._id === "object") ? this._id.toHexString() : this._id;
        return Admissions.findOne({ 'currentBedStay.bed': bed })
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
        // busyBeds = _.map(Admissions.find().fetch(), 'currentBedStay.bed')
        // bed = (typeof this._id === "object")? this._id.toHexString() :this._id;
        // return _.includes(busyBeds, bed);
    },

    panelType: function (adm) {
        //adm = Admissions.findOne({ 'currentBedStay.bed': this._id })
        if (adm.condition === 'Critical')
            return "panel-danger"
        if (adm.condition === 'Recovering')
            return "panel-success"
        return 'panel-warning'
    },
    // msmtNames: function (adm) {
    //     adm = Admissions.findOne({ 'currentBedStay.bed': this._id })
    //     return Array.from(adm.recentMeasurements().keys())
    // },
    // // msmtVals: function (adm, key) {
    // //     adm = Admissions.findOne({ 'currentBedStay.bed': this._id })
    // //     //console.log(adm.recentMeasurements().get(key));
    // //     return adm.recentMeasurements().get(key)
    // // },

});



AutoForm.hooks({

    wardFilterForm: {
        onSubmit: function (insertDoc, updateDoc, currentDoc) {
            Session.set('currentWards', insertDoc)
            this.done();
            return false;
        },
    }

 })