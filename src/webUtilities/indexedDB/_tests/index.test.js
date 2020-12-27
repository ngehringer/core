import ava from 'ava';

import * as indexedDB from '../index.js';


ava(
  'core.webUtilities.indexedDB',
  (t) => {
    t.is(typeof indexedDB, 'object');
    t.is(typeof indexedDB.REFERENCE, 'object');
    t.is(typeof indexedDB.deleteDatabase, 'function');
    t.is(typeof indexedDB.executeRequest, 'function');
    t.is(typeof indexedDB.openDatabase, 'function');
    t.is(typeof indexedDB.openTransaction, 'function');
  }
);