Template.MainNav.onCreated(function () {
    var self = this;
    self.autorun(function () {
        self.subscribe('MyPendingTodos');
	})
})

Template.MainNav.events({
	'click .login-toggle': ()=> {
		Session.set('nav-toggle', 'open');
	},
	'click  .logout': (e)=> {
		e.preventDefault();
		AccountsTemplates.logout();
	}
});

Template.MainNav.helpers({

    user: function () {
        //console.log(Patients.findOne(FlowRouter.getParam('id')))
        return  Meteor.user().profile.firstName;
    },

	myTodoCount: function(){
		return Todos.find({ forUser: Meteor.userId(), completed: false }).count()//Counts.get('MyPendingTodos') 
	}

})