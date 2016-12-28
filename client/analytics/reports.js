import moment from 'moment'

let fetchData = (  template) => {
    meth = template.stat.get();
    filters = {
            from: template.from.get(),
            to: template.to.get()
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
    template.from = new ReactiveVar('2016-1-1');
    template.to = new ReactiveVar('2016-12-31');
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

    'click .inv':  (event, template) =>{
        Template.instance().stat.set('inv'); 
       fetchData(Template.instance());
    },
    
     'click .adm': function (event, template) {
         Template.instance().stat.set('adm')
          fetchData(Template.instance());
    }

})

Template.reports.onRendered(() => {
    fetchData(Template.instance());
});


Template.reports.helpers({

    from: function () { return Template.instance().from.get() },
    to: () => Template.instance().to.get()
    ,

    total: function() {
         let revenueItems = Template.instance().totalRevenue.get();
        console.log(revenueItems)
       
        if (revenueItems) {
            return _(revenueItems).reduce((sum, n) => sum + n.summary , 0 )
        }

        return 0;
    },

    admissions: function () {
        let revenueItems = Template.instance().totalRevenue.get();

        if (revenueItems) {
            items =  revenueItems.map((item, index) => {
                let grp = item._id;

                return {
                    _id: index,

                    dt: new Date(`${grp.year}-${grp.month}-${grp.day}`),
                    // month:item._id.month,
                    // year:item._id.year,
                    type: grp.type,
                    summary : item.summary
                };
            });

            return _.orderBy(items, 'dt', ['asc']);
        }
    },
})