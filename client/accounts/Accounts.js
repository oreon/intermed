var myLogoutFunc = function() {
	Session.set('nav-toggle', '');
	FlowRouter.go('/');
}

AccountsTemplates.configure({
	confirmPassword: false,
	termsUrl: 'terms-of-use',
	privacyUrl: 'privacy',
	onLogoutHook: myLogoutFunc
});



AccountsTemplates.addFields([
	{
		_id: 'firstName',
		type: 'text',
		displayName: 'First Name',
		required: true,
    	re: /(?=.*[a-z])(?=.*[A-Z])/,
    	errStr: '1 lowercase and 1 uppercase letter reqiured'		
	}, 
		{
		_id: 'lastName',
		type: 'text',
		displayName: 'Last Name',
		required: true,
    	re: /(?=.*[a-z])(?=.*[A-Z])/,
    	errStr: '1 lowercase and 1 uppercase letter reqiured'		
	}, 
	
	{
		_id: 'profession',
		type: 'select',
		displayName: 'Profession',
		select: [
			{
				text:'Physician',
				value: 'physician'
			}, {
				text: 'Nurse',
				value: 'nurse'
			}, 
			{
				text: 'Lab Tech',
				value: 'labTech'
			}, {
				text: 'Clerk',
				value: 'clerk'
			}, 
			{
				text: 'Other',
				value: 'other'
			}
		]
	}

]);