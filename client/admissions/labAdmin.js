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
        wds = utils.admissionsByWards()
        console.log(wds);
        utils.logret( ()=> Object.keys(wds) );
        //console.log(ret);
        //return ret;
    },

    wardAdms: function (key) {
        return utils.admissionsByWards()[key];
    },

})