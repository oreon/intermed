import Highcharts from 'Highcharts'
import moment from 'moment'

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

            arr = []

            _.forEach(val, function (elem) {
                if (elem.mainValue) {
                    //format();
                    arr.push([moment(elem.createdAt).format("DD-MM-YY hh:mm" ), elem.mainValue])
                    Template.instance().mapResults.get().set(key, arr);
                }
                else {
                    subTests.push(elem.values);
                }
            })
        });

        //console.log(Template.instance().mapResults.get())
        subTests = _.flatten(subTests)
        //console.log(subTests)

        testsByType = _.groupBy(subTests, function (a) { return a.name })

        _.forOwn(testsByType, function (vals, key) {
            arr = []
            //console.log("chart si " + key);
            _.forEach(vals, function (elem) {
                arr.push([moment(elem.createdAt).format("DD-MM-YY hh:mm" ), elem.value])
            })
            Template.instance().mapResults.get().set(key, arr);
        })


         msmts = _.groupBy(adm.measurements, function (a) { return a.measurement })
    
        _.forOwn(msmts, function (val, key) {

            arr = []

            _.forEach(val, function (elem) {
                if (elem.mainValue) {
                    //format();
                    arr.push([moment(elem.updatedAt).format("DD-MM-YY hh:mm" ), elem.mainValue])
                    Template.instance().mapResults.get().set(key, arr);
                }
                // else {
                //     subTests.push(elem.values);
                // }
            })

            Template.instance().mapResults.get().set(key, arr);
        });
    },

    chartNames: function () {
        let mr = Template.instance().mapResults.get();
        return Array.from(mr.keys())
    },

    drawChart: function (key) {
        mapResults = Template.instance().mapResults.get();

        Meteor.defer(function () {

            data = mapResults.get(key)
            cats = []

            _.forEach(data, function (elem) {
                cats.push(elem[0])
            })

            //console.log(`${key}: ${value}`) 
            Highcharts.chart(key, {
                title: {
                    text: key
                },
                xAxis: {
                    categories: cats,
                    labels: {
                        //format: '{value:%Y-%m-%d %H:%M}',
                        rotation: 35,
                        align: 'left'
                    },
                    //type: 'datetime',
                    // labels: {
                    //     format: '{value:%Y-%m-%d %H:%M}',
                    //     rotation: 35,
                    //     align: 'left'
                    // },
                    // dateTimeLabelFormats: { // don't display the dummy year
                    //     month: '%e. %b',
                    //     year: '%b'
                    // },
                    title: {
                        text: 'Date Uploaded'
                    }
                },
                series: [{
                    type: 'line',
                    data: data,
                    name: key,
                }]
            });
            //}
        })
    },
})
