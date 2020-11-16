import ava from 'ava';

import * as conversion from '../index.js';


ava(
  'core.utilities.conversion',
  (test) => {
    test.is(typeof conversion, 'object');
    test.is(typeof conversion.convertToDate, 'function');
    test.is(typeof conversion.convertToNumber, 'function');
  }
);