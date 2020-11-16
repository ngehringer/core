import ava from 'ava';

import REFERENCE from '../index.js';


ava(
  'core.REFERENCE',
  (test) => {
    test.is(typeof REFERENCE, 'object');
    test.is(typeof REFERENCE.ENUMERATIONS, 'object');
    test.is(typeof REFERENCE.NULL_PLACEHOLDER, 'string');
    test.is(typeof REFERENCE.UUID_REGEXP, 'object');
    test.true(REFERENCE.UUID_REGEXP instanceof RegExp);
  }
);