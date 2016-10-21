if(Meteor.isClient){
  Accounts.onLogin(function(){
    FlowRouter.go('recipe-book');
  });

  Accounts.onLogout(function(){
    FlowRouter.go('home');
  });
}
FlowRouter.triggers.enter([function(context, redirect){
  if(!Meteor.userId()) {
    FlowRouter.go('home');
  }
}]);


FlowRouter.route('/',{
  name: 'home',
  action() {
    BlazeLayout.render('HomeLayout');
  }
});


FlowRouter.route('/recipe-book',{

  name: 'recipe-book',
  action() {
    if(Meteor.userId()){
      FlowRouter.go('recipe-book');
    }
    BlazeLayout.render('MainLayout' , {main: 'Recipes'});
  }
});


FlowRouter.route('/recipe/:id', {
  name: 'recipe',
  action() {
    BlazeLayout.render('MainLayout', {main: 'Patient'});
  }
});

FlowRouter.route('/admitPatient/:id', {
  name: 'admitPatient',
  action() {
    BlazeLayout.render('MainLayout', {main: 'AdmitPatient'});
  }
});


FlowRouter.route('/menu', {
  name: 'menu',
  action() {
    BlazeLayout.render('MainLayout', {main: 'Menu'});
  }
});