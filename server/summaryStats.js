import * as utils from '/imports/utils/misc.js';


export const getSummary = (coll, filter, summary) => {

    let start = new Date(filter.from.trim())
    let end = new Date(filter.to.trim())//"2016-12-28"

    flds = {
        //type: '$admissionType', 
        year: { $year: "$createdAt" },
        month: { $month: "$createdAt" },
        day: { $dayOfMonth: "$createdAt" }
    }

    grp = {
        _id: flds,
        count: { $sum: 1 }
    }

    if (summary)
        grp['summary'] = summary

    // if (filter.prd  === 'D') { delete filter.artist; }
    if (filter.prd === 'M') { delete flds.day; }
    if (filter.prd === 'Y') { delete flds.day; delete flds.month }

    //summary: { $sum: '$total' }

    return coll.aggregate([
        // { $match: { admissionType: 'Surgery' } },
        {
            $match: {
                $and: [
                    { createdAt: { $gte: start } },
                    { createdAt: { $lte: end } }
                ]
            }
        },
        {
            $group: grp
        }
    ])
}



Meteor.methods({
    getSalesData(filter) {
        check(filter, Object);

        let group = {
            _id: {
                artist: '$artist'
            },
            total: {
                $sum: '$revenue'
            }
        };

        if (filter.artist !== 'all') { group._id.album = '$album'; }
        if (filter.artist === 'all') { delete filter.artist; }
        if (filter.album === 'all') { delete filter.album; }

        return Sales.aggregate(
            { $match: filter },
            { $group: group }
        );
    },

    getInvoiceTotal(filter) {

        Admissions.aggregate([
            // { $match: { admissionType: 'Surgery' } },
            {
                $group:
                {
                    _id: { type: '$admissionType', day: { $dayOfMonth: "$createdAt" } },
                    count: { $sum: 1 }
                }
            }
        ])
    },

    admStats(filter) { return getSummary(Admissions, filter) },
    tstStats(filter) { return getSummary(TestResults, filter) },
    invStats (filter) { return  getSummary(Invoices, filter ,  { '$sum': '$total' })  }

});