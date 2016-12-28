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

    admStats(filter) {

        console.log(filter.from)

        start = new Date( filter.from.trim() )
        end =  new Date( filter.to.trim() )//"2016-12-28"

        return Admissions.aggregate([
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
                $group:
                {
                    _id: { 
                        type: '$admissionType', 
                        year: { $year: "$createdAt" },
                        month: { $month: "$createdAt" },
                        day: { $dayOfMonth: "$createdAt" } 
                    },
                    summary: { $sum: 1 }
                }
            }
        ])
    },

    invStats(filter) {

        console.log(filter.from)

        start = new Date( filter.from.trim() )
        end =  new Date( filter.to.trim() )//"2016-12-28"

        return Invoices.aggregate([
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
                $group:
                {
                    _id: { 
                        //type: '$admissionType', 
                        year: { $year: "$createdAt" },
                        month: { $month: "$createdAt" },
                        day: { $dayOfMonth: "$createdAt" } 
                    },
                    summary: { $sum: '$total' }
                }
            }
        ])
    }


});