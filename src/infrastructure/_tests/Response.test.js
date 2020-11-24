import ava from 'ava';

import REFERENCE from '../../REFERENCE/index.js';
import Response from '../Response.js';


const TEST_FIXTURES = Object.freeze({
  MESSAGE_ERROR: new Error(`${Response.name}`),
  MESSAGE_STRING: 'message'
});

ava(
  'core.infrastructure.Response – static data',
  (test) => {
    test.is(typeof Response.CLASS_NAME, 'string');
    test.is(typeof Response.DEFAULTS, 'object');
    test.is(Response.DEFAULTS.MESSAGE, null);
    test.is(Response.DEFAULTS.STATUS, Response.REFERENCE.ENUMERATIONS.RESPONSE_STATUS.UNKNOWN);
    test.is(typeof Response.REFERENCE, 'object');
    test.is(typeof Response.REFERENCE.ENUMERATIONS, 'object');
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
      message: TEST_FIXTURES.MESSAGE_STRING
    });

    test.true( REFERENCE.UUID_REGEXP.test(response.id) );
    test.is(response.message, TEST_FIXTURES.MESSAGE_STRING);
    test.is(response.status, Response.REFERENCE.ENUMERATIONS.RESPONSE_STATUS.UNKNOWN);
    test.true( (typeof response.time === 'object') && (response.time instanceof Date) );
  }
);

ava(
  'core.infrastructure.Response – unspecified parameters',
  (test) => {
    const response = new Response({
      status: null
    });

    test.true( REFERENCE.UUID_REGEXP.test(response.id) );
    test.is(response.message, Response.DEFAULTS.MESSAGE);
    test.is(response.status, Response.DEFAULTS.STATUS);
    test.true( (typeof response.time === 'object') && (response.time instanceof Date) );
  }
);

ava(
  'core.infrastructure.Response.error',
  (test) => {
    const response1 = Response.error(TEST_FIXTURES.MESSAGE_STRING);

    test.is(typeof response1, 'object');
    test.true(response1 instanceof Response);
    test.true( REFERENCE.UUID_REGEXP.test(response1.id) );
    test.is(response1.message, TEST_FIXTURES.MESSAGE_STRING);
    test.is(response1.status, Response.REFERENCE.ENUMERATIONS.RESPONSE_STATUS.ERROR);
    test.true( (typeof response1.time === 'object') && (response1.time instanceof Date) );

    const response2 = Response.error(TEST_FIXTURES.MESSAGE_ERROR);

    test.is(typeof response2, 'object');
    test.true(response2 instanceof Response);
    test.true( REFERENCE.UUID_REGEXP.test(response2.id) );
    test.is(response2.message, TEST_FIXTURES.MESSAGE_ERROR.message);
    test.is(response2.status, Response.REFERENCE.ENUMERATIONS.RESPONSE_STATUS.ERROR);
    test.true( (typeof response2.time === 'object') && (response2.time instanceof Date) );
  }
);

ava(
  'core.infrastructure.Response.ok',
  (test) => {
    const response = Response.ok(TEST_FIXTURES.MESSAGE_STRING);

    test.is(typeof response, 'object');
    test.true(response instanceof Response);
    test.true( REFERENCE.UUID_REGEXP.test(response.id) );
    test.is(response.message, TEST_FIXTURES.MESSAGE_STRING);
    test.is(response.status, Response.REFERENCE.ENUMERATIONS.RESPONSE_STATUS.OK);
    test.true( (typeof response.time === 'object') && (response.time instanceof Date) );
  }
);

ava(
  'core.infrastructure.Response.warning',
  (test) => {
    const response = Response.warning(TEST_FIXTURES.MESSAGE_STRING);

    test.is(typeof response, 'object');
    test.true(response instanceof Response);
    test.true( REFERENCE.UUID_REGEXP.test(response.id) );
    test.is(response.message, TEST_FIXTURES.MESSAGE_STRING);
    test.is(response.status, Response.REFERENCE.ENUMERATIONS.RESPONSE_STATUS.WARNING);
    test.true( (typeof response.time === 'object') && (response.time instanceof Date) );
  }
);