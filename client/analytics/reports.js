import moment from 'moment'
import * as utils from '/imports/utils/misc.js';

let fetchData = (template) => {
    meth = template.stat.get();
    filters = {
        from: template.from.get(),
        to: template.to.get(),
        prd: utils.radioVal(template, 'period')
    }
    console.log(meth)
    Meteor.call(meth + 'Stats', filters, (error, response) => {
        if (error) {
            Bert.alert(error.reason);
        } else {
            console.log(response)
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
        let revenueItems = Template.instance().totalRevenue.get();

        if (revenueItems) {
            items = revenueItems.map((item, index) => {
                let grp = item._id;

                return {
                    _id: index,

                    dt: `${grp.year}-${utils.getDefault(grp.month)}-${utils.getDefault(grp.day)}`,
                    // month:item._id.month,
                    // year:item._id.year,
                    type: grp.type,
                    summary: item.summary,
                    count: item.count
                };
            });

            return _.orderBy(items, 'dt', ['asc']);
        }
    },
})