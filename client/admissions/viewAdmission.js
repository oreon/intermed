import moment from 'moment'
var SummaryTool = require('node-summary');
import * as utils from '/imports/utils/misc.js';

export function getAdmission() {
    return Admissions.findOne({ _id: FlowRouter.getParam('id') });
}

var gloablEdit = {};



Template.ViewAdmission.onCreated(function () {

    //self.editMode = new ReactiveVar(false);
    this.editMode = new ReactiveVar(false);
    this.summary = new ReactiveVar("Visit Summary ")
    this.adm = new ReactiveVar()

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
        this.adm = adm;
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
    getSummary: function () {
        adm = getAdmission();

        visitText = _.reduce(adm.visits, function (sum, n) {
            return sum + ' \n ' + n.note;
        }, '')
        let cleanText = visitText.replace(/<\/?[^>]+(>|$)/g, "");
        cleantText = cleanText.replace(/&nbsp;/gi, '')

        title = "Mr. H is a 65 year old white male with a past medical history significant for an MI ";
        content = cleanText;

        //console.log(content)

        // SummaryTool.getSortedSentences(content, 1, function (err, sorted_sentences) {
        //     if (err) {
        //         console.log("There was an error " + err); // Need better error reporting
        //         Template.instance().summary.set("XXXX");
        //     }
        //     Template.instance().summary.set(sorted_sentences);
        // });

        // SummaryTool.summarize(title, content, function (err, summary) {
        //     if (err) console.log("Something went wrong man!");

        //     //console.log(summary);
        //     //Template.instance().summary.set(summary);
        //     //return summary;

        //     console.log("Original Length " + (title.length + cleanText.length));
        //     console.log("Summary Length " + summary.length);
        //     console.log("Summary Ratio: " + (100 - (100 * (summary.length / (title.length + content.length)))));
        // });
        return Template.instance().summary.get()
    },
    admission: function () {
        return getAdmission();
    },
    patient: function () {
        return Patients.findOne(getAdmission().patient);
    },
    conditonOpts: function () {
        return ['Recovering', 'Stable', 'Critical']
    },
    visitCreator: function () {
        try {
            return Meteor.users.findOne(this.createdBy).profile.firstName
        } catch (e) {
            return " Dr X"
        }
    },

    // currentInv: function () {
    //     adm = getAdmission()

    //     if (adm) {
    //         let current = adm.invoice()
    //         if (current) {
    //             Template.instance().formType.set('update');
    //             return current;
    //         }
    //     }
    // },

    formType: function () {
        var formType = Template.instance().formType.get();
        return formType;
    },

    isEditMode: function () { return Session.get("editAdmissionForm") },

    visits: function (admission) {
        return _.orderBy(admission.visits, ['updatedAt'], ['desc'])
    },
    summaryCalc: function () {
        return SummaryTool.summarize(title, content, function (err, summary) {
            if (err) console.log("Something went wrong man!");

            console.log(summary);
            Template.instance().summary.set(summary);
            //return summary;

            // console.log("Original Length " + (title.length + content.length));
            // console.log("Summary Length " + summary.length);
            // console.log("Summary Ratio: " + (100 - (100 * (summary.length / (title.length + content.length)))));
        });
    }
});



Template.ViewAdmission.events({

    'click .toggleDischarge': function () {
        adm = getAdmission();
        Meteor.call('toggleDischargeEligible', adm._id, adm.eligibleForDischarge);
    },
    'click .discharge': function () {

    },
    'click .fa-pencil': function (event, template) {
        Session.set("editAdmissionForm", true);
        template.editMode.set(!template.editMode.get());
    },
    'click .fac': function (event, template) {
         Meteor.call('setupFaciltiy');
    },
    
});


Template.invoiceTmpl.onCreated(function () {
    var self = this;
    self.autorun(function () {
        var id = FlowRouter.getParam('id');
        self.subscribe('Rooms')
        self.subscribe('Beds')
        self.subscribe('compAdmission', id);
    });
});

Template.invoiceTmpl.helpers({

    getBedStayTotal(adm){
        let adms = Admissions.findOne(adm._id)
        return adms.bedStaysObj()['total'] 
    },
    

})





AutoForm.hooks({
    editInvoiceForm: {

        // formToDoc: function (doc) {
        //     console.log(doc)
        //     doc.admission = FlowRouter.getParam('id');
        //     return doc;
        // },
        onSuccess: function (operation, result) {
            //console.log(result)
            //console.log(this.template.parent())
            //this.template.parent().editMode.set(false);
        },
    },

    updateAdmissionScriptForm:{
         formToDoc: function (doc) {
            doc.items = utils.massageScriptItems(doc.items)
            return doc;
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
            if (!!adm)
                doc.admission = adm._id;
            return doc;
        },
        onSuccess: function (operation, result) {
            //console.log(operation)
            console.log(result)

            testObj = TestResults.findOne(result)
            test = testObj.labTest;

            console.log(test)
            //Session.set("editEncounterForm", false);
            adm = Session.get('adm');

            Admissions.update(
                { "_id": adm._id },
                { "$pull": { "labsAndImages.tests": test } },
                function (err, res) {
                    if(err) console.error(err);
                    console.log("successfully removed test from scheduled " + test );
                }
            );

            service = Services.findOne({ name: "Lab Tests" })
            svc = service.name + '-' + testObj.labTestName()
            inv = Invoices.findOne({ "admission": adm._id })
            utils.createInvoiceItem(inv, svc, 200)

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
    },
    updateDischargeForm: {
        onSuccess: function (operation, result) {
            adm = getAdmission();
            console.log(adm)
            Meteor.call('discharge', adm, function (error, response) {
                if (error) {
                    Bert.alert(error.reason, "danger");
                    console.log(error)
                } else {
                    console.log(adm)

                    Bert.alert('Successfully discharged patient !', 'success', 'growl-top-right');
                    FlowRouter.go('/patient/' + adm.patient)
                }
            });
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