import moment from 'moment'

export function getAdmission() {
    return Admissions.findOne({ _id: FlowRouter.getParam('id') });
}


Template.ViewAdmission.onCreated(function () {

    //self.editMode = new ReactiveVar(false);
    this.editMode = new ReactiveVar(false);

    this.formType = new ReactiveVar('insert');

    var self = this;
    self.autorun(function () {

        var id = FlowRouter.getParam('id');
        self.subscribe('compAdmission', id);
        self.subscribe('Rooms')
        self.subscribe('Beds')
        self.subscribe('Invoices')

        //adm = Admissions.findOne({_id: FlowRouter.getParam('id')});
        // self.entity = new ReactiveVar(adm);

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
    fromDatef: function () {
        return moment(this.fromDate).format('D MMM YY hh:mm');
    },
    toDatef: function () {
        return moment(this.toDate).format('D MMM YY hh:mm');
    }
    ,
    datef:function(dt){
        return moment(dt).format('D MMM YY hh:mm');
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
    grandTotal:function(){
        adm = getAdmission()
        bedStayTotal = adm.bedStaysObj().total;
        //console.log(adm)
        if (adm) {
            let inv = adm.invoice()
            if(inv){
                return bedStayTotal  + inv.total;
            }else
                return bedStayTotal;
        }    
        return 0;
    }



    //prdName: (id) => Products.findOne({_id: id}).name
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

    updateAdmission: {
        onSuccess: function (operation, result) {
            console.log(result)
            console.log(this.template.parent())
            //this.template.parent().editMode.set(false);
        },
    }
});