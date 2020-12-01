import ava from 'ava';

import * as errors from '../../../errors/index.js';
import generateQueryString from '../generateQueryString.js';


const TEST_FIXTURES = Object.freeze({
  QUERY_STRING_1: Object.freeze({
    EXPECTED_QUERY_STRING: 'parameter=value',
    PARAMETERS: {
      null_parameter: null,
      parameter: 'value'
    }
  }),
  QUERY_STRING_2: Object.freeze({
    EXPECTED_QUERY_STRING: 'parameter1=value1&parameter2=value2',
    PARAMETERS: {
      '': 'invalid_key',
      invalid_value: 0,
      parameter1: 'value1',
      parameter2: 'value2'
    }
  })
});

ava(
  'core.webUtilities.ajax.generateQueryString – single parameter',
  (t) => {
    const queryString = generateQueryString(TEST_FIXTURES.QUERY_STRING_1.PARAMETERS);

    t.is(typeof queryString, 'string');
    t.is(queryString, TEST_FIXTURES.QUERY_STRING_1.EXPECTED_QUERY_STRING);
  }
);

ava(
  'core.webUtilities.ajax.generateQueryString – multiple parameters',
  (t) => {
    const queryString = generateQueryString(TEST_FIXTURES.QUERY_STRING_2.PARAMETERS);

    t.is(typeof queryString, 'string');
    t.is(queryString, TEST_FIXTURES.QUERY_STRING_2.EXPECTED_QUERY_STRING);
  }
);

ava(
  'core.webUtilities.ajax.generateQueryString - invalid parameters',
  (t) => {
    const expectedError1 = new errors.TypeValidationError('parameters', Object);

    const error1 = t.throws(
      () => generateQueryString(null)
    );

    t.is(typeof error1, 'object');
    t.deepEqual(error1, expectedError1);
  }
);