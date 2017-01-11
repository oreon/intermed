import * as utils from '/imports/utils/misc.js';

Template.LabAdmin.onCreated(function () {
    var self = this;
    self.autorun(function () {
        self.subscribe('compWards')
        //self.subscribe('compPts')
        self.subscribe('compAdmissions')
        // self.subscribe('Admissions')
    });
});


Template.LabAdmin.helpers({

    wards: function () {
        ////console.log(utils.wardsWithPatients());
        return utils.wardsWithPatients() ;//Wards.find( {} );
    },

    rooms: function () {
        return Rooms.find({ ward: this._id });
    },

    rbeds: function () {
        return Beds.find({ room: this._id });
    }
,
    adm:function(){
        bed = (typeof this._id === "object")? this._id.toHexString() :this._id;
        return Admissions.findOne({ 'currentBedStay.bed': bed })
    }

})

Template.UploadLabResults.helpers({
     formId: function (testName) {
        wds = utils.admissionsByWards()
        //console.log(wds);
        utils.logret( ()=> Object.keys(wds) );
    },
    prepDoc:function(testName){
        test = LabTests.findOne({'name':testName})
        doc = {'labTest':test._id}
        return doc; 
    }
})
