import ava from 'ava';

import * as utilities from '../index.js';


ava(
  'core.utilities',
  (test) => {
    test.is(typeof utilities, 'object');
    test.is(typeof utilities.conversion, 'object');
    test.is(typeof utilities.formatting, 'object');
    test.is(typeof utilities.generateUUID, 'function');
    test.is(typeof utilities.validation, 'object');
  }
);