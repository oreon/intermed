import moment from 'moment'

Template.registerHelper('datef', (dt) => {
  return moment(dt).format('LLLL'); //('D MMM YY hh:mm a');
});

Template.registerHelper('datecal', (dt) => {
  return moment(dt).calendar(); //('D MMM YY hh:mm a');
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

Template.registerHelper('arrayify',function(obj){
    console.log('in arrayify')
    console.log(obj)
    var result = [];
    for (var key in obj) {
      result.push({name:key,value:obj[key]});
    }
    return result;
});


//AutoForm.setDefaultTemplate('plain');
