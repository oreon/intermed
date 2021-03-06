if (Meteor.isClient) {
  Accounts.onLogin(function () {
    FlowRouter.go('patients');
  });

  Accounts.onLogout(function () {
    FlowRouter.go('home');
  });
}


FlowRouter.route('/', {
  name: 'home',
  action() {
    BlazeLayout.render('HomeLayout');
  }
});

FlowRouter.route('/login', {
  name: 'login',
  action() {
    BlazeLayout.render('HomeLayout', { main: 'LoginModal' });
  }
});

FlowRouter.route('/ptsignup', {
  name: 'ptsignup',
  action() {
    BlazeLayout.render('HomeLayout', { main: 'ptsignup' });
  }
});

FlowRouter.triggers.enter([function (context, redirect) {
  //console.log(context)
  //console.log(redirect)
  
  if (!Meteor.userId() && context.path !== '/ptsignup') {
    FlowRouter.go('home');
  }
}]);


FlowRouter.route('/patients', {

  name: 'patients',
  action() {
    if (Meteor.userId()) {
      FlowRouter.go('patients');
    }
    BlazeLayout.render('MainLayout', { main: 'Patients' });
  }
});

FlowRouter.route('/editPatient/:id', {
  name: 'editPatient',
  action() {
    BlazeLayout.render('MainLayout', { main: 'EditPatient' });
  }
});


FlowRouter.route('/setupFacility', {
  name: 'setupFacility',
  action() {
    BlazeLayout.render('MainLayout', { main: 'Wards' });
  }
});

FlowRouter.route('/editEncounter', {
  name: 'editEncounter',
  action() {
    BlazeLayout.render('MainLayout', { main: 'EditEncounter' });
  }
});

FlowRouter.route('/editEncounter/:id', {
  name: 'editEncounter',
  action() {
    BlazeLayout.render('MainLayout', { main: 'EditEncounter' });
  }
});

FlowRouter.route('/invoices', {
  name: 'invoices',
  action() {
    BlazeLayout.render('MainLayout', { main: 'invoices' });
  }
});



FlowRouter.route('/editInvoice/:id', {
  name: 'editInvoice',
  action() {
    BlazeLayout.render('MainLayout', { main: 'EditInvoice' });
  }
});

FlowRouter.route('/printInvoice/:id', {
  name: 'printInvoice',
  action() {
    BlazeLayout.render('MainLayout', { main: 'PrintInvoice' });
  }
});



FlowRouter.route('/events/:patient', {
  name: 'events',
  action() {
    BlazeLayout.render('MainLayout', { main: 'events' });
  }
});

FlowRouter.route('/diffdx', {
  name: 'diffdx',
  action() {
    BlazeLayout.render('MainLayout', { main: 'diffdx' });
  }
});

FlowRouter.route('/appointments', {
  name: 'appointments',
  action() {
    BlazeLayout.render('MainLayout', { main: 'appts' });
  }
});

FlowRouter.route('/labTasks', {
  name: 'labTasks',
  action() {
    BlazeLayout.render('MainLayout', { main: 'LabAdmin' });
  }
});




FlowRouter.route('/editPatient/:id', {
  name: 'editPatient',
  action() {
    BlazeLayout.render('MainLayout', { main: 'EditPatient' });
  }
});

FlowRouter.route('/editPatient', {
  name: 'editPatient',
  action() {
    BlazeLayout.render('MainLayout', { main: 'EditPatient' });
  }
});




FlowRouter.route('/patient/:id', {
  name: 'patient',
  action() {
    BlazeLayout.render('MainLayout', { main: 'Patient' });
  }
});

FlowRouter.route('/admitPatient/:id', {
  name: 'admitPatient',
  action() {
    BlazeLayout.render('MainLayout', { main: 'AdmitPatient' });
  }
});

FlowRouter.route('/mytodos', {
  name: 'mytodos',
  action() {
    BlazeLayout.render('MainLayout', { main: 'MyTodos' });
  }
});

FlowRouter.route('/mySchedule', {
  name: 'mySchedule',
  action() {
    BlazeLayout.render('MainLayout', { main: 'MySchedule' });
  }
});

FlowRouter.route('/analytics', {
  name: 'analytics',
  action() {
    BlazeLayout.render('MainLayout', { main: 'Analytics' });
  }
});

FlowRouter.route('/reports', {
  name: 'reports',
  action() {
    BlazeLayout.render('MainLayout', { main: 'reports' });
  }
});


FlowRouter.route('/admissions', {
  name: 'admissions',
  action() {
    BlazeLayout.render('MainLayout', { main: 'Admissions' });
  }
});

FlowRouter.route('/viewAdmission/:id', {
  name: 'viewAdmission',
  action() {
    BlazeLayout.render('MainLayout', { main: 'ViewAdmission' });
  }
});

FlowRouter.route('/visit/:id', {
  name: 'visit',
  action() {
    BlazeLayout.render('MainLayout', { main: 'Visit' });
  }
});

FlowRouter.route('/editAdmission/:id', {
  name: 'editAdmission',
  action() {
    BlazeLayout.render('MainLayout', { main: 'EditAdmission' });
  }
});


FlowRouter.notFound = {
  action() {
    BlazeLayout.render('App_body', { main: 'Visit' });
  },
};
