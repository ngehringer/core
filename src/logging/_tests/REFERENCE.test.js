import ava from 'ava';

import REFERENCE from '../REFERENCE.js';


ava(
  'core.logging.REFERENCE',
  (test) => {
    test.is(typeof REFERENCE, 'object');
    test.is(typeof REFERENCE.ENUMERATIONS, 'object');
    test.is(typeof REFERENCE.ENUMERATIONS.LOG_LEVEL, 'object');
    test.is(typeof REFERENCE.ENUMERATIONS.LOG_LEVEL.CRITICAL_ERROR, 'string');
    test.is(typeof REFERENCE.ENUMERATIONS.LOG_LEVEL.DEBUG, 'string');
    test.is(typeof REFERENCE.ENUMERATIONS.LOG_LEVEL.ERROR, 'string');
    test.is(typeof REFERENCE.ENUMERATIONS.LOG_LEVEL.INFO, 'string');
    test.is(typeof REFERENCE.ENUMERATIONS.LOG_LEVEL.UNKNOWN, 'string');
    test.is(typeof REFERENCE.ENUMERATIONS.LOG_LEVEL.WARNING, 'string');
  }
);