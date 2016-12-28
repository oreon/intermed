import Highcharts from 'Highcharts'
import moment from 'moment'


Template.Patient.onCreated(function () {
    var self = this;
    self.autorun(function () {
        self.subscribe('Todos')
    });
});

data = [
    [Date.UTC(2013, 5, 2), 3000],
    [Date.UTC(2013, 5, 3), 4000],
    [Date.UTC(2013, 5, 4), 7645],
    [Date.UTC(2013, 5, 5), 7638],
    [Date.UTC(2013, 5, 6), 7000],
    //[Date.UTC(2013,5,7),0.7562],
    [Date.UTC(2013, 5, 9), 7574],
]

dataMonthly = [
    ['Jan', 30000],
    ['Feb', 33000],
    ['Mar', 28000],
    ['Apr', 40200],
]

dataMonthlyPd = [
    ['Jan', 28000],
    ['Feb', 31000],
    ['Mar', 26000],
    ['Apr', 39000],
]





Template.Analytics.helpers({

    //from: function () { return Template.instance().from.get() },
    //to: () => Template.instance().to.get(),
    admisisonsReport: function () {
        Meteor.call('admitStats', null, function (error, response) {
            if (error) {
                Bert.alert(error.reason, "danger");
                console.error(error)
            } else {
                console.log(response)

                //FlowRouter.go('/viewAdmission/' + response)
            }
        });

    },

    invoicesChart: function () {
        Meteor.defer(function () {
            Highcharts.chart('invDaily', {
                title: {
                    text: 'Paid Invoices'
                },
                xAxis: {
                    type: 'datetime',
                    //categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
                },
                series: [{
                    type: 'line',
                    data: data
                }]
            });
        })
    },

    invoicesMonthly: function () {
        Meteor.defer(function () {
            Highcharts.chart('invMth', {
                title: {
                    text: 'Mothly billed/Paid Invoices'
                },
                xAxis: {
                    //type: 'datetime',
                    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
                },
                series: [
                    {
                        type: 'line',
                        name: 'Billed',
                        data: dataMonthly
                    },
                    {
                        type: 'line',
                        name: 'Paid',
                        data: dataMonthlyPd
                    },

                ]
            });
        })
    },

    todosChart: function () {
        // Gather data: 
        let allTasks = Todos.find().count()
        console.log(allTasks)

        let incompleteTask = Todos.find({ completed: { $ne: true } }).count()
        let tasksData = [{
            y: 350,
            name: "Male"
        }, {
            y: 410,//allTasks - incompleteTask,
            name: "Female"
        }];
        // Use Meteor.defer() to craete chart after DOM is ready:
        Meteor.defer(function () {
            // Create standard Highcharts chart with options:
            Highcharts.chart('todoschart', {

                title: {
                    text: 'Todos'
                },
                series: [{
                    type: 'pie',
                    data: tasksData
                }]
            });
        });
    }
    ,

    admissionCategoryChart: function () {
        // Gather data: 
        let allTasks = Todos.find().count()
        console.log(allTasks)

        let incompleteTask = Todos.find({ completed: { $ne: true } }).count()
        let tasksData = [{
            y: 150,
            name: "General"
        }, {
            y: 120,//allTasks - incompleteTask,
            name: "Gyanec"
        },
        {
            y: 180,//allTasks - incompleteTask,
            name: "Cardiac"
        },
        {
            y: 100,//allTasks - incompleteTask,
            name: "Trauma"
        },

        ]

            ;
        // Use Meteor.defer() to craete chart after DOM is ready:
        Meteor.defer(function () {
            // Create standard Highcharts chart with options:
            Highcharts.chart('admissionCategoryChart', {

                title: {
                    text: 'Admisisons By Category'
                },
                series: [{
                    type: 'pie',
                    data: tasksData
                }]
            });
        });
    }
    ,

    opdChart: function () {
        // Gather data: 
        let allTasks = Todos.find().count()
        console.log(allTasks)

        let incompleteTask = Todos.find({ completed: { $ne: true } }).count()
        let tasksData = [{
            y: 10,
            name: "Internal Medicine"
        }, {
            y: 20,//allTasks - incompleteTask,
            name: "Gyanec"
        },
        {
            y: 80,//allTasks - incompleteTask,
            name: "Cardiac"
        },
        {
            y: 40,//allTasks - incompleteTask,
            name: "Dermatolgical"
        },

        ]

            ;
        // Use Meteor.defer() to craete chart after DOM is ready:
        Meteor.defer(function () {
            // Create standard Highcharts chart with options:
            Highcharts.chart('opdChart', {

                title: {
                    text: 'OPD Encounters'
                },
                series: [{
                    type: 'pie',
                    data: tasksData
                }]
            });
        });
    }

});