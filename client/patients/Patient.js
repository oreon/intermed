

Template.Patient.onCreated(function () {
    var self = this;
    self.autorun(function () {
        var id = FlowRouter.getParam('id');
        self.id = id;
        self.subscribe('compPt', id);
        self.subscribe('Drugs')
        self.subscribe('compAdmissions')
        // self.subscribe('TestResults')
        //self.subscribe('Encounters')
    });
});

Template.Patient.helpers({

    patient: function () {
        //console.log(this)
        return Patients.findOne(FlowRouter.getParam('id'));
    },

    encounters: function () {
        return PtEncounters.find({ patient: FlowRouter.getParam('id') });
    },

    drugName: (id) => Drugs.findOne({ _id: id }).name,

    isAdmitted: function () {
        adm = Admissions.findOne({ patient: FlowRouter.getParam('id') })
        console.log(adm)

        let testResults = TestResults.find({ patient: FlowRouter.getParam('id') }).fetch();
        //console.log(testResults)
        testsByType = _.groupBy(testResults, function (a) { return a.labTest })
        // console.log(testsByType)
        let subTests = [];

        _.forOwn(testsByType, function (val, key) {

            _.forEach(val, function (elem) {
                if(elem.mainValue) {
                    console.log(elem.mainValue + " " + elem.createdAt)
                }
                else{ 
                    subTests.push( elem.values);
                }
            })

        });
        subTests = _.flatten(subTests)
        console.log(subTests)

        testsByType = _.groupBy(subTests, function (a) { return a.name }) 

         _.forOwn(testsByType, function (vals, key) {
             console.log("chart si " + key);
            _.forEach(vals, function (elem) {
                console.log(elem.value + " " +  elem.createdAt)
            })   
        })    
             

        return !!adm
    },

    createChart: function () {
        //     let testResults = TestResults.find({patient:FlowRouter.getParam('id')}).fetch();
        //    // let testResults = patient.testResults()
        //     testsByType = _.groupBy(testResults, function (a) { return a.labTest })
        //     console.log(testsByType)
        // _.forEach(){
        //     testsByType,
        //         function (result) {
        //             let tasksData = [{
        //                 y: result.,
        //                 name: "Value"
        //             }, {
        //                 x: allTasks - incompleteTask,
        //                 name: "Date"
        //             }];
        //             // Use Meteor.defer() to craete chart after DOM is ready:
        //             Meteor.defer(function () {
        //                 // Create standard Highcharts chart with options:
        //                 Highcharts.chart('chart', {
        //                     series: [{
        //                         type: 'line',
        //                         data: tasksData
        //                     }]
        //                 });
        //             });
        //         }

        // }
    }
})

Template.Patient.events({
    'click .admit': function () {
        //.currentAdmission
        FlowRouter.go('admitPatient', { id: FlowRouter.getParam('id') })
    },
    'click .viewAdmission': function () {
        adm = Admissions.findOne({ patient: FlowRouter.getParam('id') });
        FlowRouter.go('viewAdmission', { id: adm._id })
    },

    'click .encounter': function (event, template) {
        FlowRouter.go('newEncounter', { id: FlowRouter.getParam('id') })
    },
    'click .visit': function (event, template) {
        adm = Admissions.findOne({ patient: FlowRouter.getParam('id') });
        FlowRouter.go('visit', { id: adm._id })
    },
    'click .fa-trash': function () {
        console.log("hi from trash")
        Meteor.call('deleteRecipe', this._id);
    },
    'click .fa-pencil': function (event, template) {
        FlowRouter.go('editPatient', { id: FlowRouter.getParam('id') })
    },

});