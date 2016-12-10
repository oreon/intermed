import moment from 'moment'

Template.registerHelper( 'datef', (dt) => {
  return moment(dt).format('D MMM YY hh:mm');
});

Template.registerHelper( 'currentPatient', () => {
  return Session.get('patient')
});

Template.registerHelper( 'isSet', (arg) => {
  return Session.get(arg) === true
});


//AutoForm.setDefaultTemplate('plain');
