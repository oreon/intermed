import moment from 'moment'
import * as utils from '/imports/utils/misc.js';

Template.registerHelper('datef', (dt) => {
  return moment(dt).format('D MMM YY hh:mm a');
});

Template.registerHelper('datesm', (dt) => {
  return moment(dt).format('LL');
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

Template.registerHelper('isCurrentAdmSelector', function () {
  return { 'isCurrent': true };
});

Template.registerHelper('currentPtSelector', function () {
  return { 'patient': Session.get('patient') };
});

Template.registerHelper('isUnpaidInvoicSelector', function () {
  return { 'isDue': true, amountPaid: { $exists: false } };
});

Template.registerHelper('allInvoicSelector', function () {
  return {};
});

Template.registerHelper('findAdmissionByInvoice', function (id) {
  if (!id)
    id = FlowRouter.getParam('id');
  //console.log(Invoices.findOne(id).admissionObj())
  return Invoices.findOne(id).admissionObj()
});



Template.registerHelper('and', function (a, b) {
  return a && b;
});

Template.registerHelper('or', function (a, b) {
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

Template.registerHelper('drugName', (id) => utils.drugName(id))


Template.registerHelper('encounterFromId', () => Encounters.findOne(FlowRouter.getParam('id')))



// Template.registerHelper('getScriptName', () => {
//   let currScript = Scripts.findOne({admission:utils.getCurrentAdmission()._id})
//   let currTemplate = Session.get('scriptTemplate');
//   console.log(currTemplate)
//   if(currTemplate && currScript.items.count() == 0 )
//     return currTemplate.name;
//   return "none"
// })

Template.registerHelper('getScriptItemsHelper', () => {
  // if( currScript.scriptItems || currScript.scriptItems.count()  > 0)
  //   return;

  let currScript = Scripts.findOne({ admission: utils.getCurrentAdmission()._id })
  let currTemplate = Session.get('scriptTemplate');

  return ['aaa', 'bbb']

  if (currTemplate /*&& currScript.scriptItems.count() == 0 */)
    return utils.logret(() => _(currTemplate.items).map('drug').value);
  //console.log(currTemplate.items)
  return currScript.scriptItems
})






Template.registerHelper('arrayify', function (obj) {
  var result = [];
  for (var key in obj) {
    result.push({ name: key, value: obj[key] });
  }
  utils.print(result)
  return result;
});


//AutoForm.setDefaultTemplate('plain');
