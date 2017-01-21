/* Returns full user name give the meteor user */
import { Box, Righ, Left, tryCatch } from '/imports/utils/myfunctional'
var Task = require('data.task')
var diff = require('rus-diff').diff
import moment from 'moment'

user = { _id: 44, profile: { 'firstName': 'ddf' } }


export const print = (x) => {
    console.log(x);
}


export const getDefault = (x, y = "") => x ? x : y
//export  const getDefault = (x, y) =>  x ? x : ""

Function.prototype.getName = function () {
    // Find zero or more non-paren chars after the function start
    return /function ([^(]*)/.exec(this + "")[1];
};

export const logret = (f) => { v = f(); console.log(v); return v }



const mkf = (f) => {
    //console.log(f)
    ret = (f != undefined && typeof f === "function") ? f : () => f
    //console.log(ret)
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



// export const arrTasks = () =>
//     safeTask(() => [1, 2, 3])
//         .ap(x => x * x)
//         .fork(e => {
//             if (Meteor.isServer)
//                 throw new Meteor.Error(500, e)
//             else console.error(e)
//         },
//         s => console.log(s))


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
        //console.log(a);
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
//map(id => {//console.log(id); id })
// tryCatch( () => user /* Meteor.users.findOne(id)*/  ) 
// .chain( (c) => tryCatch( (c) => userFullName(c) )  )


//export const userFullNameById = (id) => Meteor.users.findOne({ _id: this.forUser })

export const busyBedIds = () => _(Admissions.find().fetch())
    .map('currentBedStay.bed').value()

export const busyBeds = () =>
    _(Admissions.find().fetch())
        .map('currentBedStay.bed')
        .map(x => Beds.findOne(x))
        .filter(x => !!x)
        .value()

export const freeBeds = () =>
    Beds.find({ _id: { $nin: busyBedIds() } }).fetch()
        .map(x => Beds.findOne(x))


export const busyBedsByWard = (ward) =>
    _(busyBeds())
        .filter(x => x.wardObj()._id == ward._id)

export const wardHasPatients = (ward) =>
    _(wardsWithPatients())
        .findIndex(x => x._id === ward._id) >= 0

export const wardHasBedsAvailable = (ward) =>
    wardsWithBedsAvailable()
        .includes(ward.name)

export const wardsWithBedsAvailable = () =>
    _(freeBeds())
        .map(x => { if (x) return x.wardObj() })
        .uniqBy(x => x.name)
        .value()

export const wardsWithPatients = () =>
    _(busyBeds())
        .map(x => x.wardObj())
        .uniqBy(x => x._id)
        .value()

// export const wardsWithPatients = () =>
//     _(busyBeds())
//         .map(x => x.wardObj().name)
//         .uniq()
//         .value()

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

        if (profession === "physician")
            profession = "Dr."
        else
            spec = ""; //spec != 'phsyician'?spec:"" TODO assign spec for a specialist nurse etc

        return `${profession} ${user.profile.firstName}  ${getDefault(user.profile.lastName)} ${spec}`
    } else {
        return user._id
    }

}

export const itemTotal = (item) => item && item.appliedPrice ? item.appliedPrice * item.units : 0

// export const findInvTotal2 = (inv) =>
//     _(inv.items)
//         .map(//console.log)
//         .reduce((sum, item) => sum + itemTotal(item), 0);


export const findInvTotal = (inv) => {
    items = inv.allItems() ? inv.allItems() : inv.items;

    total = _(items).reduce((sum, item) => {
        item.total = item.appliedPrice * item.units
        return sum + (item.total ? item.total : 0);
    }, 0);
    return total;
}

export const findByProp = (coll, prop, val) => _(coll).find(x => x[prop] === val)

export const drugName = (id) => {
    drug = Drugs.findOne(parseInt(id))
    return drug ? drug.name : "Unknown"
}

export const findLookup = (coll, id) => {
    drug = coll.findOne(id)
    return drug ? drug.name : "Unknown"
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
        lineItemTotal: price
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

export const getEvery = (type) => {
    if (type === "oid") return 1;
    if (type === "bid") return 2;
    if (type === "tid") return 3;
    if (type === "qid") return 4;
    if (type === "q4h") return 6;
    if (type === "q2h") return 12;
    if (type === "q1h") return 24;
}

export const massageScriptItems = (items) =>
    _(items).map(item => {
        if (!item)
            return;

        if (!item.duration || !item.duration.for) {
            item.duration = {}
            item.duration.for = item.durationSimple;  //item.frequencySimple
            item.duration.type = 'Day'
        }

        if (!item.frequency || !item.frequency.type) {
            item.frequency = {}
            item.frequency.every = getEvery(item.frequencySimple);  //item.frequencySimple
            item.frequency.type = 'Day'
        }

        if (!item.quantity) item.quantity = 1
        //debugger
        //console.log(item)
        item.startDate = item.startDate || new Date();
        if (item.duration) {
            item.endDate = new moment(item.startDate).add(item.duration.for,
                item.duration.type.toLowerCase()).toDate();
        }
        //console.log(item)
        return item;
    }).value()


export const setPtName = (doc) => doc.patientName = Patients.findOne(doc.patient).fullName()

export const getUserFacility = (userId) =>
    safeTask(() => Meteor.users.findOne(userId))
        .map(x => x.profile.facility)
        .fork(e => { console.log(userId); console.log(e) }, s => s)


export const tenatendFinder = (id, userColl = false) => {
    user = Meteor.users.findOne(id)
    if (user) {
        return userColl ? { 'profile.facility': user.profile.facility } : { facility: user.profile.facility }
    }
    console.warn("Cerebrum : no user found returing empty ")
    return {}
}

export const tenatendFinderOrNone = (id) => {
    //console.log(getUserFacility(id))
    return {
        '$or': [{ facility: null }, { facility: getUserFacility(id) }]
    };

    // console.warn("Cerebrum : no user found returing empty ")
    // return {}
}

export const findPatientAllergies = (pt, items) =>
    _(pt)
        .map('drugAllergies.drug')
        .intersectionBy(items, 'drug')
        .map(x => utils.findByProp(pt.drugAllergies, 'drug', x))
        .value();

export const tv = (varName) =>
    Template.instance()[varName].get()

export const textVal = (template, varName) => template.find(`[name="${varName}"]`).value

export const radioVal = (template, varName) => {
    var element = template.find(`input:radio[name=${varName}]:checked`);
    return $(element).val()
}

export const getRptData = (inData) => {
    if (inData) {
        items = inData.map((item, index) => {
            let grp = item._id;

            return {
                _id: index,
                dt: `${grp.year}-${getDefault(grp.month)}-${getDefault(grp.day)}`,
                type: grp.type,
                summary: item.summary,
                count: item.count
            };
        });

        return _.orderBy(items, 'dt', ['asc']);
    }
}

export const insertValidated = (schema, coll, data) => {
    schema.clean(data);
    check(data, schema);
    coll.insert(data)
}

export const getCurrentAdmission = () => Session.get('adm')
export const getCurrentPatient = () => Session.get('patient')


export const getAggregated = (arr, val) =>
    _(arr)
        .map(val)
        .flatten()
        .filter(x => !!x)
        .value()

export const timedOccurence = (item, times = 1) =>
    new moment(item.startDate).add(item.frequency.every * times, item.frequency.type.toLowerCase())


export const updateAssessmentStartDate = (chart, pt) => {
    if (chart.startFromBirthDate) {
        _.forEach(chart.assesments, y => y.startDate = pt.dob)
    }
    return chart;
}

export const applyDobAsStart = (pt) => {
    //console.log(pt)
    _.map(pt.appliedCharts, x => {
        if (x.startFromBirthDate) {
            _.foreach(x.assesments, y => y.startDate = pt.dob)
        }
    })
    //console.log(pt.appliedCharts)
    return pt.appliedCharts;
}