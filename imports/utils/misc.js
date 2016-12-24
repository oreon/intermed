/* Returns full user name give the meteor user */
import { Box, Righ, Left, tryCatch } from '/imports/utils/myfunctional'
var Task = require('data.task')
var diff = require('rus-diff').diff
import moment from 'moment'

user = { _id: 44, profile: { 'firstName': 'ddf' } }


export const getDefault = (x, y = "") => x ? x : y
//export  const getDefault = (x, y) =>  x ? x : ""

Function.prototype.getName = function () {
    // Find zero or more non-paren chars after the function start
    return /function ([^(]*)/.exec(this + "")[1];
};

export const logret = (f) => { v = f(); console.log(v); return v }



const mkf = (f) => {
    console.log(f)
    ret = (f != undefined && typeof f === "function") ? f : () => f
    console.log(ret)
    return ret;
}

export const createTask = (f) => new Task((rej, res) => {
    try {
        return res(mkf(f)())
    } catch (e) {
        console.error(`${e} in ${f} `)
        return rej(e)
    }
})



//Always returns a value - fails on null or undefined
export const safeTask = (f) => new Task((rej, res) => {
    try {
        //let g = (f != undefined && typeof f === "function")? f : () => f
        val = f()
        if (!val) {
            console.error(`undefined found in ${f} `)
            return rej("undefined or null found ")
        }
        return res(f())
    } catch (e) {
        console.error(`${e} in ${f} `)
        return rej(e)
    }
})



function groupBy(dataToGroupOn, fieldNameToGroupOn, fieldNameForGroupName, fieldNameForChildren) {
    var result = _.chain(dataToGroupOn)
        .groupBy(fieldNameToGroupOn)
        .toPairs()
        .map(function (currentItem) {
            return _.zipObject([fieldNameForGroupName, fieldNameForChildren], currentItem);
        })
        .value();
    return result;
}



export const admissionsByWards = () => _(Admissions.find().fetch())
    .groupBy((a) => {
        console.log(a);
        return Beds.findOne(a.currentBedStay.bed).roomObj().wardObj().name
    })
    .map((value, key) => ({ ward: key, adms: value }))
    .value();

export const admissionsByWard = (wards) => Object.keys(admissionsByWards())

export const userFullNameById = (id) => {

    return safeTask(() => Meteor.users.findOne(id))
        .chain(x => safeTask(() => userFullName(x)))
    //.map(y => "cc--" + y )

    //  return _([user])
    //     .map(x => Meteor.users.findOne(id))
    //     .map(x => "AAA " + userFullName(x))
    //     .value();

    //user = Meteor.users.findOne(id);
    //return userFullName(user)

}
//map(id => {console.log(id); id })
// tryCatch( () => user /* Meteor.users.findOne(id)*/  ) 
// .chain( (c) => tryCatch( (c) => userFullName(c) )  )


//export const userFullNameById = (id) => Meteor.users.findOne({ _id: this.forUser })

export const busyBedIds =() => _(Admissions.find().fetch())
        .map('currentBedStay.bed').value()

export const busyBeds = () =>
        _(Admissions.find().fetch())
        .map('currentBedStay.bed')
        .map(x => Beds.findOne(x))
        .filter(x => !!x)
        .value()

export const freeBeds = () =>
    Beds.find({_id:{$nin : busyBedIds()  }}).fetch()
    .map(x =>  Beds.findOne(x) )
    

export const busyBedsByWard = (ward) =>
    _(busyBeds())
        .filter(x => x.wardObj()._id == ward._id)

export const wardHasPatients = (ward) =>
    wardsWithPatients()
        .includes(ward.name)

export const wardHasBedsAvailable = (ward) =>
    wardsWithBedsAvailable()
        .includes(ward.name)

export const wardsWithBedsAvailable = () =>
    _(freeBeds())
        .map(x => { if(x) return x.wardObj() } )
        .uniqBy(x => x.name)
        .value()


export const wardsWithPatients = () =>
    _(busyBeds())
        .map(x => x.wardObj().name)
        .uniq()
        .value()

export const roomHasPatients = (room) =>
    roomsWithPatients()
        .includes(room._id)

export const roomsWithPatients = () =>
    _(busyBeds())
        .map(x => x.room)
        .value()



export const userFullName = (user) => {
    if (user.profile) {
        spec = getDefault(user.profile.specialization)
        profession = getDefault(user.profile.profession, "{NO ROLE}");
        if (profession === "physician") profession = "Dr."
        return `${profession} ${user.profile.firstName}  ${getDefault(user.profile.lastName)} ${spec}`
    } else {
        return user._id
    }

}

export const itemTotal = (item) => item && item.appliedPrice ? item.appliedPrice * item.units : 0

export const findInvTotal2 = (inv) =>
    _(inv.items)
        .map(console.log)
        .reduce((sum, item) => sum + itemTotal(item), 0);


export const findInvTotal = (inv) => {
    if (!inv.allItems()) return 0;

    total = _(inv.allItems()).reduce((sum, item) => {
        item.total = item.appliedPrice * item.units
        return sum + (item.total ? item.total : 0);
    }, 0);
    return total;
}

export const taskDbUpdate = (coll, id, exp) => new Task((rej, res) =>
    coll.update({ "_id": id }, exp, (err, success) => err ? rej(err) : res(success)))

export const taskDbInsert = (coll, exp) => new Task((rej, res) =>
    coll.insert(exp, (err, success) => err ? rej(err) : res(success)))

export const createInvoiceItemBasic = (inv, serviceName, price) => {
    return {
        service: serviceName,
        appliedPrice: price,
        units: 1,
        remarks: serviceName + " Sys updated",
        total: price
    }
}

export const createInvoiceItem = (inv, serviceName, price) => {
    //TODO if not invoice create it
    invoiceItem = createInvoiceItemBasic(inv, serviceName, price)

    //_.map(myinv.autoCreatedItems)
    //TODO  the pull below is not working , in case of an error multiple room stays might be created

    taskDbUpdate(Invoices, inv._id, { $pull: { "autoCreatedItems": { "service": "Room Stay XXXXX" } } })
        .chain(() => taskDbUpdate(Invoices, inv._id, { $addToSet: { "autoCreatedItems": invoiceItem } }))
        .fork(console.error, console.log)

}

export const massageScriptItems = (items) =>
    _(items).map(item => {
        console.log(item.startDate)
        item.startDate = item.startDate ? item.startDate : new Date();
        if(item.duration)
        item.endDate = new moment(item.startDate).add(item.duration.for,
            item.duration.type.toLowerCase()).toDate();
        console.log(item)
        return item;
    }).value() 