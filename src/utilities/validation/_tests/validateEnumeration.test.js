import ava from 'ava';

import * as errors from '../../../errors/index.js';
import validateEnumeration from '../validateEnumeration.js';


const TEST_FIXTURES = Object.freeze({
  ENUMERATION: [ 1, 2 ],
  INVALID_VALUE: 3,
  VALID_VALUE: 1
});

ava(
  'core.utilities.validateEnumeration – valid value',
  (test) => {
    const result = validateEnumeration(TEST_FIXTURES.VALID_VALUE, TEST_FIXTURES.ENUMERATION);

    test.is(typeof result, 'boolean');
    test.true(result);
  }
);

ava(
  'core.utilities.validateEnumeration – invalid value',
  (test) => {
    const result = validateEnumeration(TEST_FIXTURES.INVALID_VALUE, TEST_FIXTURES.ENUMERATION);

    test.is(typeof result, 'boolean');
    test.false(result);
  }
);

ava(
  'core.utilities.validateEnumeration – invalid value type',
  (test) => {
    const result = validateEnumeration(null, TEST_FIXTURES.ENUMERATION);

    test.is(typeof result, 'boolean');
    test.false(result);
  }
);

ava(
  'core.utilities.validateEnumeration – invalid parameters',
  (test) => {
    const expectedError = new errors.TypeValidationError('enumeration', Object);

    const error = test.throws(
      () => validateEnumeration(TEST_FIXTURES.VALID_VALUE)
    );

    test.is(typeof error, 'object');
    test.deepEqual(error, expectedError);
  }
);