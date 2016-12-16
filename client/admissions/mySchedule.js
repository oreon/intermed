import { scheduleForTime } from '/imports/utils/drugAdminSchedule.js';
import { calcShedForIterval } from '/imports/utils/drugAdminSchedule.js';
import { scriptEnhanced } from '/imports/utils/drugAdminSchedule.js';
import moment from 'moment';

Template.MySchedule.onCreated(function () {
    var self = this;
    self.autorun(function () {
        var id = FlowRouter.getParam('id');
        self.subscribe('compAdmissions');
    });
});


Template.MySchedule.helpers({

    admCount: function () {
        return Admissions.find().count();
    },
    getColor: function(item){
        if(item.isFuture)
            return " #fff"
        else
            return "#eee"
    }
    ,
    findSchedule: function () {
        arrSched = []
        let now = new Date()
        console.log(now)
        let start =  moment(now).add(-4, 'hours') 
        //console.log(start.format('LLLL'))
        //console.log (new moment(start).format('LLLL'))
        let end =  moment(start).add(16, 'hours')
        //console.log(end.format('LLLL'))

        adms = Admissions.find().fetch();
        _.map(adms, (adm) => {
            _.map(scriptEnhanced(adm.script).items, (item) => {
                
                retItems = calcShedForIterval(item, start, end)
                itemsWithAdm = _.map(retItems, (itemTemp) => {
                itemTemp['adm'] = adm;
                    return itemTemp
                })
                arrSched.push(itemsWithAdm)
            })
        })
        console.log(arrSched)
        return _(arrSched)
            .flatten()
            .orderBy(['dateToAdmin'], ['asc'])
            .value();

    }
})   