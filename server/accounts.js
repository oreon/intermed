var postSignUp = function(userId, info) {
	console.log(userId);
	console.log(info.profile.profession);
	Roles.addUsersToRoles(userId, info.profile.profession, Roles.GLOBAL_GROUP);
}

AccountsTemplates.configure({
	postSignUpHook: postSignUp
});