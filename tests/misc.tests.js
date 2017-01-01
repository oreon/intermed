
// import { Meteor } from 'meteor/meteor';
// import { Random } from 'meteor/random';
 
//require('babel-core/register');
import { assert } from 'meteor/practicalmeteor:chai';
import * as utils from '/imports/utils/misc';

// Tinytest.add('test title', function(test){
//   test.equal(true, true);
// });

describe('misc', function () {
  it('does something that should be tested', function () {
    assert.equal(utils.getDefault('aaa'), 'aaa')
    assert.equal(utils.getDefault(null, 'bb'), 'bb')
    
  })
})