import moment from 'moment'

Template.registerHelper('datef', (dt) => {
  return moment(dt).format('D MMM YY hh:mm');
});

Template.registerHelper('currentPatient', () => {
  return Session.get('patient')
});

Template.registerHelper('isSet', (arg) => {
  return Session.get(arg) === true
});

Template.registerHelper('drugName', (id) => {
  //console.log(id)
  //console.log(Drugs.find().count())
  drug = Drugs.findOne({ _id: id })
  return (drug)?drug.name:"Unknown"
    
})


//AutoForm.setDefaultTemplate('plain');
