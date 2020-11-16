import ava from 'ava';

import validateType from '../validateType.js';


const TEST_FIXTURES = Object.freeze({
  INSTANCE: {},
  NON_INSTANCE: '',
  TYPE: Object
});

ava(
  'core.utilities.validateType – instance',
  (test) => {
    const result = validateType(TEST_FIXTURES.INSTANCE, TEST_FIXTURES.TYPE);

    test.is(typeof result, 'boolean');
    test.true(result);
  }
);

ava(
  'core.utilities.validateType – non-instance',
  (test) => {
    const result = validateType(TEST_FIXTURES.NON_INSTANCE, TEST_FIXTURES.TYPE);

    test.is(typeof result, 'boolean');
    test.false(result);
  }
);

ava(
  'core.utilities.validateType – invalid parameters',
  (test) => {
    const expectedError = new Error(`‘type’ must be a “${Function.name}”.`);

    const error = test.throws(
      () => validateType(TEST_FIXTURES.INSTANCE)
    );

    test.is(typeof error, 'object');
    test.deepEqual(error, expectedError);
  }
);