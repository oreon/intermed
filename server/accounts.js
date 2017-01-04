import { AccountsCommon } from 'meteor/accounts-base'

var postSignUp = function (userId, info) {
	//console.log(userId);
	//console.log(info.profile.profession);
	Roles.addUsersToRoles(userId, info.profile.profession, Roles.GLOBAL_GROUP);

}

// var preSignUp = function (passwd, info) {
// 	//console.log(info)
// 	fac = Facilities.findOne({ '_id': info.profile.facility })
// 	if (fac) {
// 		//console.log(fac)
// 		//user.facility = fac._id;
// 	} else {
// 		throw new Meteor.error(400, "Invalid facility")
// 	}
// }

Accounts.validateNewUser(function (user) {
	//console.log(user.profile.facility)
	
	if(!user.profile.facility){
		Roles.setUserRoles(user._id, 'patient', Roles.GLOBAL_GROUP)
		return true;
	}
	let fac = Facilities.findOne({ '_id': user.profile.facility })
	if (fac) return true;
		
	throw new Meteor.Error(403, `The facitlity code ${user.profile.facility} is invalid - contact sales@oreonsconslting.com to register your facility`  );
});
// Validate username, without a specific error message.
Accounts.validateNewUser(function (user) {
	return user.username !== "root";
});

// var onLogin = function(obj){
//   var currentUser = obj.user
//   //console.log(currentUser)
// }

AccountsTemplates.configure({
	preSignUpHook: function (a, b) { console.log(a + " " + b); },
	postSignUpHook: postSignUp,
	//onLogin:onLogin

});