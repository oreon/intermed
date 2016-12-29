var postSignUp = function(userId, info) {
	console.log(userId);
	console.log(info.profile.profession);
	Roles.addUsersToRoles(userId, info.profile.profession, Roles.GLOBAL_GROUP);
	
}

var preSignUp = function(passwd, info){
	console.log(info)
	fac = Facilities.findOne({'code':info.profile.facility})
	if(fac){
		console.log(fac)
		//user.facility = fac._id;
	}else{
		throw new Meteor.error(400,"Invalid facility")
	}
}

AccountsTemplates.configure({
	preSignUpHook:  function(a,b) { console.log(a + " "  + b);},
	postSignUpHook: postSignUp,
	
});