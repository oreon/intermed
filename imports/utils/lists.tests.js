/* eslint-env mocha */
/* eslint-disable func-names, prefer-arrow-callback */

//import { Factory } from 'meteor/factory';
//import { PublicationCollector } from 'meteor/johanbrook:publication-collector';
import { chai, assert } from 'meteor/practicalmeteor:chai';
//import { Random } from 'meteor/random';
import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { DDP } from 'meteor/ddp-client';
//import { Lists } from './lists.js';
//import { insert, makePublic, makePrivate, updateName, remove } from './methods.js';
//import { Todos } from '../todos/todos.js';
//import '../../../i18n/en.i18n.json';

if (Meteor.isServer) {
  // eslint-disable-next-line import/no-unresolved
  //import './server/publications.js';

  describe('lists', function () {

    describe('mutators', function () {
      it('builds correctly from factory', function () {
        const list = {}
        assert.typeOf(list, 'object');
        assert.match(list.name, /List /);
      });
    });
    
  });
}
