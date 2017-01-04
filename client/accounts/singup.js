Template.signup.events({
  'submit form' ( event, template ) {
    event.preventDefault();
    
    let email    = template.find( "[name='emailAddress']" ).value,
        password = template.find( "[name='password']" ).value;
    
    Accounts.createUser( { email: email, password: password }, ( error ) => {
      if ( error ) {
        console.error( error.reason );
      }else {
          if(Meteor.users.count() == 1){
              console.log("First user")
              Roles.setUserRoles(Meteor.users.findOne(), 'admin', Roles.GLOBAL_GROUP)
          }else{
              console.log("patient user")
               //Roles.setUserRoles(Meteor.users.find({}), 'patient', Roles.GLOBAL_GROUP)
          } 
      }
    });
  }
});