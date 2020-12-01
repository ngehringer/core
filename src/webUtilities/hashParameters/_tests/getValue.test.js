import ava from 'ava';
import browserEnv from 'browser-env';

import * as errors from '../../../errors/index.js';
import getValue from '../getValue.js';


// use “browser-env” to populate the following in the global scope …
// - `window.location.hash`
browserEnv();

const TEST_FIXTURES = Object.freeze({
  HASH_1: Object.freeze({
    EXPECTED_PARAMETER_VALUE: 'value2',
    HASH: 'parameter1=value&parameter2=value2',
    KEY: 'parameter2'
  }),
  HASH_2: Object.freeze({
    EXPECTED_PARAMETER_VALUE: null,
    HASH: 'parameter=value',
    KEY: 'nonexistent_parameter'
  }),
  KEY_INVALID: ''
});

ava(
  'core.webUtilities.hashParameters.getValue – existing parameter',
  (t) => {
    window.location.hash = TEST_FIXTURES.HASH_1.HASH;

    const parameterValue = getValue(TEST_FIXTURES.HASH_1.KEY);

    t.is(typeof parameterValue, 'string');
    t.is(parameterValue, TEST_FIXTURES.HASH_1.EXPECTED_PARAMETER_VALUE);
  }
);

ava(
  'core.webUtilities.hashParameters.getValue – non-existent parameter',
  (t) => {
    window.location.hash = TEST_FIXTURES.HASH_2.HASH;

    const parameterValue = getValue(TEST_FIXTURES.HASH_2.KEY);

    t.is(typeof parameterValue, 'object');
    t.is(parameterValue, TEST_FIXTURES.HASH_2.EXPECTED_PARAMETER_VALUE);
  }
);

ava(
  'core.webUtilities.hashParameters.getValue - invalid parameters',
  (t) => {
    const expectedError1 = new errors.TypeValidationError('key', String);

    const error1 = t.throws(
      () => getValue(TEST_FIXTURES.KEY_INVALID)
    );

    t.is(typeof error1, 'object');
    t.deepEqual(error1, expectedError1);
  }
);