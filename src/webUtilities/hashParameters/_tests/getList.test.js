import ava from 'ava';
import browserEnv from 'browser-env';

import getList from '../getList.js';


// use “browser-env” to populate the following in the global scope …
// - `window.location.hash`
browserEnv();

const TEST_FIXTURES = Object.freeze({
  HASH_1: Object.freeze({
    EXPECTED_KEY_VALUE_LIST: [],
    HASH: ''
  }),
  HASH_2: Object.freeze({
    EXPECTED_KEY_VALUE_LIST: [
      {
        key: 'parameter',
        value: 'value'
      }
    ],
    HASH: 'parameter=value'
  }),
  HASH_3: Object.freeze({
    EXPECTED_KEY_VALUE_LIST: [
      {
        key: 'parameter1',
        value: 'value1'
      },
      {
        key: 'parameter2',
        value: 'value2'
      }
    ],
    HASH: 'parameter1=value1&malformedParameter1&parameter2=value2'
  })
});

ava(
  'core.webUtilities.hashParameters.getList - empty URI fragment',
  (t) => {
    window.location.hash = TEST_FIXTURES.HASH_1.HASH;

    const hashParameters = getList();

    t.is(typeof hashParameters, 'object');
    t.true( Array.isArray(hashParameters) );
    t.true(
      hashParameters.every( (hashParameter) => (typeof hashParameter.key === 'string') )
    );
    t.true(
      hashParameters.every( (hashParameter) => (typeof hashParameter.value === 'string') )
    );
    t.deepEqual(hashParameters, TEST_FIXTURES.HASH_1.EXPECTED_KEY_VALUE_LIST);
  }
);

ava(
  'core.webUtilities.hashParameters.getList – URI fragment containing a single parameter',
  (t) => {
    window.location.hash = TEST_FIXTURES.HASH_2.HASH;

    const hashParameters = getList();

    t.is(typeof hashParameters, 'object');
    t.true( Array.isArray(hashParameters) );
    t.true(
      hashParameters.every( (hashParameter) => (typeof hashParameter.key === 'string') )
    );
    t.true(
      hashParameters.every( (hashParameter) => (typeof hashParameter.value === 'string') )
    );
    t.deepEqual(hashParameters, TEST_FIXTURES.HASH_2.EXPECTED_KEY_VALUE_LIST);
  }
);

ava(
  'core.webUtilities.hashParameters.getList – URI fragment containing multiple parameters',
  (t) => {
    window.location.hash = TEST_FIXTURES.HASH_3.HASH;

    const hashParameters = getList();

    t.is(typeof hashParameters, 'object');
    t.true( Array.isArray(hashParameters) );
    t.true(
      hashParameters.every( (hashParameter) => (typeof hashParameter.key === 'string') )
    );
    t.true(
      hashParameters.every( (hashParameter) => (typeof hashParameter.value === 'string') )
    );
    t.deepEqual(hashParameters, TEST_FIXTURES.HASH_3.EXPECTED_KEY_VALUE_LIST);
  }
);