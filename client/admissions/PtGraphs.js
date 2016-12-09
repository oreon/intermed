import Highcharts from 'Highcharts'

Template.PtGraphs.onCreated(function () {
    var self = this;
    this.mapResults = new ReactiveVar(new Map());
    self.autorun(function () {

    });
});

data = [
    [Date.UTC(2013, 5, 2), 3000],
    [Date.UTC(2013, 5, 3), 4000],
]

Template.PtGraphs.helpers({

    createChartData: function (adm) {

        let testResults = TestResults.find({ admission: adm._id }).fetch();
        //console.log(testResults)
        testsByType = _.groupBy(testResults, function (a) { return a.labTestName() })
        // console.log(testsByType)
        let subTests = [];

        _.forOwn(testsByType, function (val, key) {

            console.log(key);
            arr = []

            _.forEach(val, function (elem) {
                if (elem.mainValue) {
                    arr.push([elem.createdAt.getTime(), elem.mainValue])
                    Template.instance().mapResults.get().set(key, arr);
                }
                else {
                    subTests.push(elem.values);
                }
            })
        });

        //console.log(Template.instance().mapResults.get())

        subTests = _.flatten(subTests)
        console.log(subTests)

        testsByType = _.groupBy(subTests, function (a) { return a.name })

        _.forOwn(testsByType, function (vals, key) {
            arr = []
            console.log("chart si " + key);
            _.forEach(vals, function (elem) {
                arr.push([elem.createdAt.getTime(), elem.value])
            })
            Template.instance().mapResults.get().set(key, arr);
        })
    },

    chartNames: function () {
        let mr = Template.instance().mapResults.get();
        return Array.from(mr.keys())
    },

    drawChart: function (key) {
        mapResults = Template.instance().mapResults.get();

        Meteor.defer(function () {

            //console.log(`${key}: ${value}`) 
            Highcharts.chart(key, {
                title: {
                    text: key
                },
                xAxis: {
                    type: 'datetime',
                    labels: {
                        format: '{value:%Y-%m-%d %H:%M}',
                        //rotation: 45,
                        align: 'left'
                    },
                    title: {
                        text: 'Date'
                    }
                },
                series: [{
                    type: 'line',
                    data: mapResults.get(key)
                }]
            });
            //}
        })
    },
})
