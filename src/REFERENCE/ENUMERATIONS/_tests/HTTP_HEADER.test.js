import ava from 'ava';

import HTTP_HEADER from '../HTTP_HEADER.js';


ava(
  'core.REFERENCE.ENUMERATIONS.HTTP_HEADER',
  (test) => {
    test.is(typeof HTTP_HEADER, 'object');
    test.is(typeof HTTP_HEADER.ACCESS_CONTROL_ALLOW_ORIGIN, 'string');
    test.is(typeof HTTP_HEADER.AUTHORIZATION, 'string');
    test.is(typeof HTTP_HEADER.CONTENT_TYPE, 'string');
    test.is(typeof HTTP_HEADER.COOKIE, 'string');
    test.is(typeof HTTP_HEADER.SET_COOKIE, 'string');
    test.is(typeof HTTP_HEADER.X_FORWARDED_FOR, 'string');
    test.is(typeof HTTP_HEADER.X_REQUESTED_WITH, 'string');
  }
);