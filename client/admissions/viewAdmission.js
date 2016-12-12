import moment from 'moment'

export function getAdmission() {
    return Admissions.findOne({ _id: FlowRouter.getParam('id') });
}

var gloablEdit = {};

Template.ViewAdmission.onCreated(function () {

    //self.editMode = new ReactiveVar(false);
    this.editMode = new ReactiveVar(false);
    globalEdit = this.editMode;

    this.formType = new ReactiveVar('insert');
    Session.set("editAdmissionForm", false)


    var self = this;
    self.autorun(function () {

        var id = FlowRouter.getParam('id');
        self.subscribe('compAdmission', id);
        self.subscribe('Rooms')
        self.subscribe('Beds')
        adm = getAdmission()
        if (adm) {
            Session.set('adm', adm)
            Session.set('patient', adm.patient)
        }

        // self.subscribe('Invoices')
    });
});


Template.ViewAdmission.helpers({

    editMode: function () {
        return Template.instance().editMode.get();
    },
    admission: function () {
        return getAdmission();
    },
    patient: function () {
        return Patients.findOne(getAdmission().patient);
    },

    visitCreator: function () {
        try {
            return Meteor.users.findOne(this.createdBy).profile.firstName
        } catch (e) {
            return " Dr X"
        }
    },

    currentInv: function () {
        adm = getAdmission()
        //console.log(adm)
        if (adm) {
            let currentSchedule = adm.invoice()
            if (currentSchedule) {
                Template.instance().formType.set('update');
                //console.log(currentSchedule)
                return currentSchedule;
            }

        }
    },

    formType: function () {
        var formType = Template.instance().formType.get();
        return formType;
    },

    isEditMode: function () { return Session.get("editAdmissionForm") },

    grandTotal: function (adm) {
        bedStayTotal = adm.bedStaysObj().total;
        //console.log(adm)
        if (adm) {
            let inv = adm.invoice()
            if (inv) {
                return bedStayTotal + inv.total;
            } else
                return bedStayTotal;
        }
        return 0;
    },
});



Template.ViewAdmission.events({

    'click .toggleDischarge': function () {
        adm = getAdmission();
        Meteor.call('toggleDischargeEligible', adm._id, adm.eligibleForDischarge);
    },
    'click .discharge': function () {
        adm = getAdmission();
        Meteor.call('discharge', adm, function (error, response) {
            if (error) {
                Bert.alert(error.reason, "danger");
                console.log(error)
            } else {
                console.log(response)
                Bert.alert('Successfully discharged patient !', 'success', 'growl-top-right');
                FlowRouter.go('/recipe/' + adm.patient)
            }
        });
    },
    'click .fa-pencil': function (event, template) {
        Session.set("editAdmissionForm", true);
        template.editMode.set(!template.editMode.get());
    },
    'click .visit': function (event, template) {
        //adm = Admissions.findOne({patient:});
        FlowRouter.go('visit', { id: FlowRouter.getParam('id') })
    },
    // 'change .items.$.service': function (e) {
    //     console.log($(e.target).val())

    // }
});


Template.invoice.onCreated(function () {
    var self = this;
    self.autorun(function () {
        var id = FlowRouter.getParam('id');
        self.subscribe('Rooms')
        self.subscribe('Beds')
        //self.subscribe('compAdmission', id);
    });
});

Template.invoice.helpers({

    grandTotal: function (adm) {

        // bedStayTotal = adm.bedStaysObj().total;
        // //console.log(adm)
        // if (adm) {
        //     let inv = adm.invoice()
        //     if(inv){
        //         return bedStayTotal  + inv.total;
        //     }else
        //         return bedStayTotal;
        // }    
        return 0;
    },
})



AutoForm.hooks({
    editInvoiceForm: {

        formToDoc: function (doc) {
            console.log(doc)
            doc.admission = FlowRouter.getParam('id');
            return doc;
        },
        onSuccess: function (operation, result) {
            //console.log(result)
            //console.log(this.template.parent())
            //this.template.parent().editMode.set(false);
        },
    },

    newTodoForm: {
        formToDoc: function (doc) {
            doc.patient = getAdmission().patient
            return doc;
        },
    },

    newTestResultsForm: {
        
        formToDoc: function (doc) {
             adm = Session.get('adm');
            patient = Session.get('patient')
            doc.patient = patient
            if(!!adm)
                doc.admission = adm._id;
            return doc;
        },
    },

    newEncounterForm22: {
        formToDoc: function (doc) {
            //console.log(getCurrentPatient());
            doc.patient = FlowRouter.getParam('id') //getCurrentPatient();
            return doc;
        },
        onSuccess: function (operation, result) {
            Session.set("editEncounterForm", false);
        },

    },

    updateAdmissionForm: {
        onSuccess: function (operation, result) {
            Session.set("editAdmissionForm", false);
            globalEdit.set(false)
        },
    }
});

Template.todosPt.helpers({
    selector() {
        return { patient: Session.get('adm').patient };
    }
});

Template.testResults.helpers({
    selector() {
        adm = Session.get('adm');
        patient = Session.get('patient')
        if (adm && adm != null)
            return { admission: adm._id };
        else
            return { patient: patient };

    }
});