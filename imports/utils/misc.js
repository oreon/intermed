/* Returns full user name give the meteor user */
import { Box, Righ, Left, tryCatch } from '/imports/utils/myfunctional'
var Task = require('data.task')

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

export const userFullName = (user) => {
    if (user.profile) {
        spec = getDefault(user.profile.specialization)
        profession = getDefault(user.profile.profession, "{NO ROLE}");
        if (profession === "physician") profession = "Dr."
        return `${profession} ${user.profile.firstName}  ${getDefault(user.profile.lastName)} ${spec}`
    } else {
        return user._id
    }
    // if (profession === "developer")
    //     throw ("too wierd user")

    // ret = `${profession} ${user.profile.firstName}  ${getDefault(user.profile.lastName)} ${spec}`
    // ret = undefined
    // //console.log(ret);
    // return ret;

}
