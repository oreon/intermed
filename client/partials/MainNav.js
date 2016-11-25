Template.MainNav.events({
	'click .login-toggle': ()=> {
		Session.set('nav-toggle', 'open');
	},
	'click .logout': ()=> {
		AccountsTemplates.logout();
	}
});

Template.MainNav.helpers({
    user: function () {
        //console.log(Patients.findOne(FlowRouter.getParam('id')))
        return  Meteor.user().profile.firstName;
    },

})