import ava from 'ava';

import HTTP_METHOD from '../HTTP_METHOD.js';


ava(
  'core.REFERENCE.ENUMERATIONS.HTTP_METHOD',
  (test) => {
    test.is(typeof HTTP_METHOD, 'object');
    test.is(typeof HTTP_METHOD.DELETE, 'string');
    test.is(typeof HTTP_METHOD.GET, 'string');
    test.is(typeof HTTP_METHOD.HEAD, 'string');
    test.is(typeof HTTP_METHOD.OPTIONS, 'string');
    test.is(typeof HTTP_METHOD.PATCH, 'string');
    test.is(typeof HTTP_METHOD.POST, 'string');
    test.is(typeof HTTP_METHOD.PUT, 'string');
  }
);