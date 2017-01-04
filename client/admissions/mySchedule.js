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
    getColor: function (item) {
        if (item.isFuture)
            return " #fff"
        else
            return "#eee"
    },
    desc:  (item) =>
        (item.drug) ? ` ${item.amount} ${item.route}` : item.name ,

    from: ()=> moment(new Date()).add(-4, 'hours').format('LLLL'),
    to: ()=> moment(new Date()).add(20, 'hours').format('LLLL'),
    

    findSchedule: function () {
        arrSched = []
        let now = new Date()
        console.log(now)
        let start = moment(now).add(-4, 'hours')
        //console.log(start.format('LLLL'))
        //console.log (new moment(start).format('LLLL'))
        let end = moment(now).add(20, 'hours')
        //console.log(end.format('LLLL'))

        adms = Admissions.find().fetch();
        _.map(adms, (adm) => {
            script = Admissions.findOne(adm._id).script();
            drugAdmins = script ? script.items :[]


            let allItems = _.concat(scriptEnhanced(drugAdmins ), 
                adm.recurringAssesments? adm.recurringAssesments: [])
            
            _.map(allItems,
                (item) => {
                    let retItems = calcShedForIterval(item, start, end)
                    itemsWithAdm = _.map(retItems, (itemTemp) => {
                        itemTemp['adm'] = adm;
                        return itemTemp
                    })
                    arrSched.push(itemsWithAdm)
                })

               // console.log(adm.recurringAssessments)

            //  _.map(adm.recurringAssessments, (item) => {
            //     retItems = calcShedForIterval(item, start, end)
            //     itemsWithAdm = _.map(retItems, (itemTemp) => {
            //         itemTemp['adm'] = adm;
            //         return itemTemp
            //     })
            //     arrSched.push(itemsWithAdm)
            // })
        })
        //console.log(arrSched)
        return _(arrSched)
            .flatten()
            .orderBy(['dateToAdmin'], ['asc'])
            .value();

    }
})   