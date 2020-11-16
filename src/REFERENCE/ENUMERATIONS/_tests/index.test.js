import ava from 'ava';

import ENUMERATIONS from '../index.js';


ava(
  'core.REFERENCE.ENUMERATIONS',
  (test) => {
    test.is(typeof ENUMERATIONS, 'object');
    test.is(typeof ENUMERATIONS.ENVIRONMENT, 'object');
    test.is(typeof ENUMERATIONS.HTTP_HEADER, 'object');
    test.is(typeof ENUMERATIONS.HTTP_METHOD, 'object');
    test.is(typeof ENUMERATIONS.HTTP_STATUS_CODE, 'object');
    test.is(typeof ENUMERATIONS.MEDIA_TYPE, 'object');
  }
);