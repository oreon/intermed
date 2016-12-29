import * as utils from '/imports/utils/misc.js';
import { BaseSchema } from '/imports/api/schemas.js';

Events = new Mongo.Collection( 'events' );

Events.allow({
  insert: () => false,
  update: () => false,
  remove: () => false
});

Events.deny({
  insert: () => true,
  update: () => true,
  remove: () => true
});

let EventSchema = new SimpleSchema([BaseSchema,{
  'title': {
    type: String,
    optional:true,
    label: 'The title of this event.'
  },
  'start': {
    type: String,
    //label: 'When this event will start.',
     autoform: {
        readonly: true
    },
  },  
  'end': {
    type: String,
    //label: 'When this event will end.',
     autoform: {
        readonly: true
    },
  },
  physician:{
    type:String,
     autoform: {
        type: "hidden"
    },
  },
  patient:{
    type:String,
     autoform: {
        type: "hidden"
    },
  },
  'type': {
    type: String,
    label: 'What type of event is this?',
    allowedValues: [ 'FollowUp', 'Encounter', 'Physical', 'Other' ],
    defaultValue:'Encounter'
  },
  // 'guests': {
  //   type: Number,
  //   label: 'The number of guests expected at this event.'
  // }
}]);

Events.attachSchema( EventSchema );

Events.before.insert( (userId, doc) => {
 utils.setPtName(doc)
 doc.facility = utils.getUserFacility(userId)
} );