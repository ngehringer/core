import ava from 'ava';

import ENVIRONMENT from '../ENVIRONMENT.js';


ava(
  'core.REFERENCE.ENUMERATIONS.ENVIRONMENT',
  (test) => {
    test.is(typeof ENVIRONMENT, 'object');
    test.is(typeof ENVIRONMENT.DEVELOPMENT, 'string');
    test.is(typeof ENVIRONMENT.PRODUCTION, 'string');
  }
);