import moment from 'moment'

export function getAdmission() {
    return Admissions.findOne({_id: FlowRouter.getParam('id')});
}


Template.ViewAdmission.onCreated(function () {

    //self.editMode = new ReactiveVar(false);
    this.editMode = new ReactiveVar(false);

    var self = this;
    self.autorun(function () {

        var id = FlowRouter.getParam('id');
        self.subscribe('compAdmission', id);

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
        return Patients.findOne();
    },
    fromDatef: function () {
        return moment(this.created).format('D MMM YY hh:mm');
    },
    toDatef: function () {
        return moment(this.created).format('D MMM YY hh:mm');
    }
    ,

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
    }
});


AutoForm.hooks({
    updateAdmission: {
        onSuccess: function(operation, result) {
            console.log(result)
            console.log(this.template.parent())
            //this.template.parent().editMode.set(false);
        },
    }
});