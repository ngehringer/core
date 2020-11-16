import ava from 'ava';

import Response from '../Response.js';
import REFERENCE from '../../REFERENCE/index.js';


const TEST_FIXTURES = Object.freeze({
  MESSAGE: 'message'
});

ava(
  'core.infrastructure.Response – static data',
  (test) => {
    test.is(typeof Response.CLASS_NAME, 'string');
    test.is(typeof Response.REFERENCE, 'object');
    test.is(typeof Response.REFERENCE.ENUMERATIONS, 'object');
    test.is(typeof Response.REFERENCE.ENUMERATIONS.RESPONSE_STATUS, 'object');
    test.is(typeof Response.REFERENCE.ENUMERATIONS.RESPONSE_STATUS, 'object');
    test.is(typeof Response.REFERENCE.ENUMERATIONS.RESPONSE_STATUS.ERROR, 'string');
    test.is(typeof Response.REFERENCE.ENUMERATIONS.RESPONSE_STATUS.OK, 'string');
    test.is(typeof Response.REFERENCE.ENUMERATIONS.RESPONSE_STATUS.UNKNOWN, 'string');
    test.is(typeof Response.REFERENCE.ENUMERATIONS.RESPONSE_STATUS.WARNING, 'string');
  }
);

ava(
  'core.infrastructure.Response',
  (test) => {
    const response = new Response({
      message: TEST_FIXTURES.MESSAGE
    });

    test.true( REFERENCE.UUID_REGEXP.test(response.id) );
    test.is(response.message, TEST_FIXTURES.MESSAGE);
    test.is(response.status, Response.REFERENCE.ENUMERATIONS.RESPONSE_STATUS.UNKNOWN);
    test.true( (typeof response.time === 'object') && (response.time instanceof Date) );
  }
);

ava(
  'core.infrastructure.Response.error',
  (test) => {
    const response = Response.error(TEST_FIXTURES.MESSAGE);

    test.is(typeof response, 'object');
    test.true(response instanceof Response);
    test.true( REFERENCE.UUID_REGEXP.test(response.id) );
    test.is(response.message, TEST_FIXTURES.MESSAGE);
    test.is(response.status, Response.REFERENCE.ENUMERATIONS.RESPONSE_STATUS.ERROR);
    test.true( (typeof response.time === 'object') && (response.time instanceof Date) );
  }
);

ava(
  'core.infrastructure.Response.ok',
  (test) => {
    const response = Response.ok(TEST_FIXTURES.MESSAGE);

    test.is(typeof response, 'object');
    test.true(response instanceof Response);
    test.true( REFERENCE.UUID_REGEXP.test(response.id) );
    test.is(response.message, TEST_FIXTURES.MESSAGE);
    test.is(response.status, Response.REFERENCE.ENUMERATIONS.RESPONSE_STATUS.OK);
    test.true( (typeof response.time === 'object') && (response.time instanceof Date) );
  }
);

ava(
  'core.infrastructure.Response.warning',
  (test) => {
    const response = Response.warning(TEST_FIXTURES.MESSAGE);

    test.is(typeof response, 'object');
    test.true(response instanceof Response);
    test.true( REFERENCE.UUID_REGEXP.test(response.id) );
    test.is(response.message, TEST_FIXTURES.MESSAGE);
    test.is(response.status, Response.REFERENCE.ENUMERATIONS.RESPONSE_STATUS.WARNING);
    test.true( (typeof response.time === 'object') && (response.time instanceof Date) );
  }
);