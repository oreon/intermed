import moment from 'moment'
import * as utils from '/imports/utils/misc.js';
import Highcharts from 'Highcharts'

let fetchData = (template) => {
    meth = template.stat.get();
    filters = {
        from: template.from.get(),
        to: template.to.get(),
        prd: utils.radioVal(template, 'period')
    }
    //console.log(meth)
    Meteor.call(meth + 'Stats', filters, (error, response) => {
        if (error) {
            Bert.alert(error.reason);
        } else {
            //console.log(response)
            template.totalRevenue.set(response);
        }
    });
};

Template.reports.onCreated(() => {
    let template = Template.instance();
    template.totalRevenue = new ReactiveVar();
    template.from = new ReactiveVar(new Date('2016-01-01').toISOString().substring(0, 10))
    template.to = new ReactiveVar(new Date().toISOString().substring(0, 10));
    template.stat = new ReactiveVar('inv');

    //template.subscribe( 'stats' );
});

Template.reports.events({
    'submit form'(event, template) {
        event.preventDefault();


        Template.instance().from.set(template.find('[name="from"]').value)
        Template.instance().to.set(template.find('[name="to"]').value)

        fetchData(Template.instance());
    },

    'click .inv': (event, template) => {
        Template.instance().stat.set('inv');
        fetchData(Template.instance());
    },

    'click .adm': function (event, template) {
        Template.instance().stat.set('adm')
        fetchData(Template.instance());
    },

    'click .tst': function (event, template) {
        Template.instance().stat.set('tst')
        fetchData(Template.instance());
    },

    'click .pat': function (event, template) {
        Template.instance().stat.set('pat')
        fetchData(Template.instance());
    }

})

Template.reports.onRendered(() => {
    fetchData(Template.instance());
});


Template.reports.helpers({

    from: () => Template.instance().from.get(),
    to: () => Template.instance().to.get(),

    total: function () {
        return _(utils.tv('totalRevenue')).reduce((sum, n) => sum + n.summary, 0)
    },

    totalCount: () =>
        _(utils.tv('totalRevenue')).reduce((sum, n) => sum + n.count, 0),

    admissions: function () {
        return utils.getRptData(utils.tv('totalRevenue'));
    },

    hasSummary: function () {
        let data = utils.getRptData(utils.tv('totalRevenue'));
        return data && data.count > 0 && data[0].summary
    },

    lnChart: function () {
        let data = utils.getRptData(utils.tv('totalRevenue'));
        let title = utils.tv('stat') + ' ' + utils.radioVal(Template.instance(), 'period')


        Meteor.defer(function () {

            Highcharts.chart('lnChartCnt', {
                title: {
                    text: title
                },
                xAxis: {
                    //type: 'datetime',
                    //categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
                    categories: _.map(data, 'dt')
                },
                series: [
                    {
                        type: 'line',
                        name: 'Billed',
                        data: _.map(data, 'count')
                    }
                ]
            });


            Highcharts.chart('lnChartSummary', {
                title: {
                    text: title
                },
                xAxis: {
                    //type: 'datetime',
                    //categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
                    categories: _.map(data, 'dt')
                },
                series: [
                    {
                        type: 'line',
                        name: 'data',
                        data: _.map(data, 'summary')
                    }
                ]
            });



        })


    },


    // lnChart:function(){

    // }
})