import ava from 'ava';

import * as core from '../index.js';


ava(
  'core',
  (test) => {
    test.is(typeof core, 'object');
    test.is(typeof core.errors, 'object');
    test.is(typeof core.infrastructure, 'object');
    test.is(typeof core.logging, 'object');
    test.is(typeof core.utilities, 'object');
    test.is(typeof core.webUtilities, 'object');
    test.is(typeof core.REFERENCE, 'object');
  }
);