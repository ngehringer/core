import ava from 'ava';
import browserEnv from 'browser-env';

import * as errors from '../../../errors/index.js';
import setValue from '../setValue.js';


// use “browser-env” to populate the following in the global scope …
// - `window.location.hash`
browserEnv();

const TEST_FIXTURES = Object.freeze({
  HASH_1: Object.freeze({
    EXPECTED_STRING: 'parameter=value',
    HASH: '',
    OBJECT: {
      parameter: 'value'
    }
  }),
  HASH_2: Object.freeze({
    EXPECTED_STRING: 'parameter1=value1&parameter2=value2',
    HASH: 'parameter1=initial_value&null_parameter_1=not_null',
    VALUE_LIST: {
      null_parameter_1: null,
      null_parameter_2: null,
      parameter1: 'value1',
      parameter2: 'value2'
    }
  }),
  INVALID_HASH_1: null,
  INVALID_HASH_2: { '': 'invalid_key' },
  INVALID_HASH_3: { invalid_value: 0 }
});

ava(
  'core.webUtilities.hashParameters.setValue – single parameter',
  (t) => {
    window.location.hash = TEST_FIXTURES.HASH_1.HASH;

    const hash = setValue(TEST_FIXTURES.HASH_1.OBJECT);

    t.is(typeof hash, 'string');
    t.is(hash, TEST_FIXTURES.HASH_1.EXPECTED_STRING);
    t.is(window.location.hash, `#${TEST_FIXTURES.HASH_1.EXPECTED_STRING}`);
  }
);

ava(
  'core.webUtilities.hashParameters.setValue – multiple parameters',
  (t) => {
    window.location.hash = TEST_FIXTURES.HASH_2.HASH;

    const hash = setValue(TEST_FIXTURES.HASH_2.VALUE_LIST);

    t.is(typeof hash, 'string');
    t.is(hash, TEST_FIXTURES.HASH_2.EXPECTED_STRING);
    t.is(window.location.hash, `#${TEST_FIXTURES.HASH_2.EXPECTED_STRING}`);
  }
);

ava(
  'core.webUtilities.hashParameters.setValue - errors',
  (t) => {
    const expectedError1 = new errors.TypeValidationError('valueList', Object);

    const error1 = t.throws(
      () => setValue(TEST_FIXTURES.INVALID_HASH_1)
    );

    t.is(typeof error1, 'object');
    t.deepEqual(error1, expectedError1);

    const expectedError2 = new errors.TypeValidationError('valueList', Object);

    const error2 = t.throws(
      () => setValue(TEST_FIXTURES.INVALID_HASH_2)
    );

    t.is(typeof error2, 'object');
    t.deepEqual(error2, expectedError2);

    const expectedError3 = new errors.TypeValidationError('valueList', Object);

    const error3 = t.throws(
      () => setValue(TEST_FIXTURES.INVALID_HASH_3)
    );

    t.is(typeof error3, 'object');
    t.deepEqual(error3, expectedError3);
  }
);