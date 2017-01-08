import * as utils from '/imports/utils/misc.js';

Template.diffdx.onCreated(function () {
    var self = this;
    this.diffs = new ReactiveVar([]);
    Session.set('diffs', [])

    self.autorun(function () {
        // var id = FlowRouter.getParam('id');
        //console.log(id)
        self.subscribe('LabFindings')
        self.subscribe('PhysicalFindings')
    });

});

Template.diffdx.helpers({

    diffsPhys: function () {
        let res = Session.get('diffs')
        if (res) {
            let phys = res['p']
            return _.groupBy(phys, (a) => a.finding_id)
        }
    },


    diffsLabs: function () {
        let res = Session.get('diffs')
        if (res) {
            let phys = res['l']
            return _.groupBy(phys, (a) => a.finding_id)
        }
    },

    findPhysical: (id) => PhysicalFindings.findOne(parseInt(id)).name,
    findLab: (id) => LabFindings.findOne(parseInt(id)).name,


    diffs: function () {
        return _.flatMap(Session.get('diffs')); //Template.instance().diffs.get();
    },

    diffdxVar: function () {
        return Template.instance().diffdx;
    },
})



// Template.diffdx.events({
//     'submit form'(event, template) {
//         event.preventDefault();

//          let insertDoc = {
//                 labFindings: template.find('[name="labFindings"]').value,
//                 physicalFindings: template.find('[name="physicalFindings"]').value,
//          }

//         Meteor.call('findDiffdx', insertDoc, function (error, response) {
//             if (error) {
//                 Bert.alert(error.reason, "danger");
//                 //console.log(error)
//             } else {
//                 console.log(response)
//                 //Template.diffdx.set(response)
//                 template.diffdx.set(response);
//                 //Or reactive var, and depending on your hierarchy
//             }
//         });

//         return false;
//     }
// })


AutoForm.hooks({
    diffDxForm: {
        onSubmit: function (insertDoc, updateDoc, currentDoc) {
            console.log(insertDoc)
            console.log(this)

            let self = this

            Meteor.call('findDiffdx', insertDoc, function (error, response) {
                if (error) {
                    Bert.alert(error.reason, "danger");
                    //console.log(error)
                } else {
                    console.log(response)
                    //Template.diffdx.set(response)
                    //self.template.parent().diffs.set(response);
                    Session.set('diffs', response)
                    //Or reactive var, and depending on your hierarchy
                }
            });

            // console.log(updateDoc)
            // console.log(currentDoc)
            this.done(); // submitted successfully, call onSuccess
            return false;

        },

    }
})

