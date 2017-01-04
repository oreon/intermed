// export const admHelpers =  Admissions.helpers({
//     currentBed: function () {
//         if (this.currentBedStay) {
//             return Beds.findOne(this.currentBedStay.bed);
//         }
//         return null
//     },
//     patientObj: function () {
//         return Patients.findOne({ _id: this.patient })
//     },
//     invoice: function () {
//         inv = Invoices.findOne({ admission: this._id }); //, { $set: {admission:this._id} });
//         return inv;
//     },
//     testResults: function () {
//         return TestResults.find({ admission: this._id });
//     },
//     bedStaysObj: function () {
//         stays = []
//         total = 0;

//         tempStays = this.bedStays;
//         tempStays.push(this.currentBedStay)

//         _.forEach(tempStays, function (stay) {
//             //if(stay.bed)
//             let bed = Beds.findOne({ _id: stay.bed });
//             stay.price = bed.roomObj().wardObj().price

//             stay.bed = bed

//             if (!stay.toDate) {
//                 stay.toDate = new Date();
//             }

//             let a = moment(stay.toDate);
//             let b = moment(stay.fromDate);
//             days = a.diff(b, 'days')
//             stay.days = days == 0 ? 1 : days;

//             stay.total = stay.days * stay.price

//             total += stay.total
//             stays.push(stay)
//         });

//         return { "stays": stays, "total": total };
//     },
//     recentMeasurements(){
//         mapResults = new Map();
//         msmts = _.groupBy(this.measurements, function (a) { return a.measurement })
//         _.forOwn(msmts, function (val, key) {
//             msmts[key] = _(val).orderBy( ['updatedAt'], [ 'desc'])
//                     .take( 2)
//                     .value();
//             // = _.take(val, 2)
//          });
//         ////console.log(msmts)
//         return msmts;
//     }
// })
