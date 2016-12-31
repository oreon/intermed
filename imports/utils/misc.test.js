
// import { Meteor } from 'meteor/meteor';
// import { Random } from 'meteor/random';
// import { assert } from 'meteor/practicalmeteor:chai';
require('babel-core/register');
import * as utils from '/imports/utils/misc';

describe('my module', function () {
  it('does something that should be tested', function () {
    assert.equal(utils.getDefault('aaa'), 'aaa')
    assert.equal(utils.getDefault(null, 'bb'), 'bb')
    
  })
})