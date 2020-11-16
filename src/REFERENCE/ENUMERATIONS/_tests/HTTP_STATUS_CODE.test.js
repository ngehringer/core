import ava from 'ava';

import HTTP_STATUS_CODE from '../HTTP_STATUS_CODE.js';


ava(
  'core.REFERENCE.ENUMERATIONS.HTTP_STATUS_CODE',
  (test) => {
    test.is(typeof HTTP_STATUS_CODE, 'object');
    test.is(typeof HTTP_STATUS_CODE['200_OK'], 'number');
    test.is(typeof HTTP_STATUS_CODE['404_NOT_FOUND'], 'number');
  }
);