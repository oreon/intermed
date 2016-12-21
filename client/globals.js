import moment from 'moment'
import * as utils from '/imports/utils/misc.js';

Template.registerHelper('datef', (dt) => {
  return moment(dt).format('D MMM YY hh:mm a');
});

Template.registerHelper('datefbig', (dt) => {
  return moment(dt).format('LLLL');
});

Template.registerHelper('wardHasPatients', (ward) => {
  return utils.wardHasPatients(ward);
});

Template.registerHelper('roomHasPatients', (room) => {
  return utils.roomHasPatients(room);
});

Template.registerHelper('and', function(a, b) {  
  return a && b;
});

Template.registerHelper('or', function(a, b) {  
  return a || b;
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
    var result = [];
    for (var key in obj) {
      result.push({name:key,value:obj[key]});
    }
    return result;
});


//AutoForm.setDefaultTemplate('plain');
