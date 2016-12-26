// Invoices.aggregate({$group: { _id: { $dayOfMonth: "$createdAt"  }, count: { $sum:1 } } })
// Invoices.aggregate({$group: { _id: { $month: "$createdAt" }, total: { $sum: '$total' } } })


// Patients.aggregate({$group: { _id: '$gender' , count: { $sum:1 } } })
// Admissions.aggregate({$group: { _id: '$admissionType' , count: { $sum:1 } }})


// db.admissions.aggregate([
//     { $match: { admissionType: 'Surgery' } },
//     {
//         $group:
//         {
//             _id: { type: '$admissionType', day: { $dayOfMonth: "$createdAt" } },
//             count: { $sum: 1 }
//         }
//     }
// ])



// db.admissions.aggregate({$group:
//     {
//         _id : { type:'$admissionType', day: { $dayOfMonth: "$dischargeSection.dischargeDate" } },
//         count: { $sum: 1 }
//     }
// })