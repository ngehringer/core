import ava from 'ava';

import * as errors from '../../../errors/index.js';
import validateType from '../validateType.js';


const TEST_FIXTURES = Object.freeze({
  PRIMITIVE_TYPES: Object.freeze({
    BIG_INT: Object.freeze({
      INSTANCE: 0n,
      TYPE: BigInt
    }),
    BOOLEAN: Object.freeze({
      INSTANCE: false,
      TYPE: Boolean
    }),
    NUMBER: Object.freeze({
      INSTANCE: 0,
      TYPE: Number
    }),
    OBJECT: Object.freeze({
      INSTANCE: {},
      TYPE: Object
    }),
    STRING: Object.freeze({
      INSTANCE: '',
      TYPE: String
    }),
    SYMBOL: Object.freeze({
      INSTANCE: Symbol(),
      TYPE: Symbol
    })
  })
});

ava(
  'core.utilities.validation.validateType – Object (instance)',
  (test) => {
    const result = validateType(TEST_FIXTURES.PRIMITIVE_TYPES.OBJECT.INSTANCE, TEST_FIXTURES.PRIMITIVE_TYPES.OBJECT.TYPE);

    test.is(typeof result, 'boolean');
    test.true(result);
  }
);

ava(
  'core.utilities.validation.validateType – Object (non-instance)',
  (test) => {
    const result = validateType(TEST_FIXTURES.PRIMITIVE_TYPES.STRING.INSTANCE, TEST_FIXTURES.PRIMITIVE_TYPES.OBJECT.TYPE);

    test.is(typeof result, 'boolean');
    test.false(result);
  }
);

ava(
  'core.utilities.validation.validateType – primitive BigInt',
  (test) => {
    const result = validateType(TEST_FIXTURES.PRIMITIVE_TYPES.BIG_INT.INSTANCE, TEST_FIXTURES.PRIMITIVE_TYPES.BIG_INT.TYPE);

    test.is(typeof result, 'boolean');
    test.true(result);
  }
);

ava(
  'core.utilities.validation.validateType – primitive Boolean',
  (test) => {
    const result = validateType(TEST_FIXTURES.PRIMITIVE_TYPES.BOOLEAN.INSTANCE, TEST_FIXTURES.PRIMITIVE_TYPES.BOOLEAN.TYPE);

    test.is(typeof result, 'boolean');
    test.true(result);
  }
);

ava(
  'core.utilities.validation.validateType – primitive Number',
  (test) => {
    const result = validateType(TEST_FIXTURES.PRIMITIVE_TYPES.NUMBER.INSTANCE, TEST_FIXTURES.PRIMITIVE_TYPES.NUMBER.TYPE);

    test.is(typeof result, 'boolean');
    test.true(result);
  }
);

ava(
  'core.utilities.validation.validateType – primitive String',
  (test) => {
    const result = validateType(TEST_FIXTURES.PRIMITIVE_TYPES.STRING.INSTANCE, TEST_FIXTURES.PRIMITIVE_TYPES.STRING.TYPE);

    test.is(typeof result, 'boolean');
    test.true(result);
  }
);

ava(
  'core.utilities.validation.validateType – primitive Symbol',
  (test) => {
    const result = validateType(TEST_FIXTURES.PRIMITIVE_TYPES.SYMBOL.INSTANCE, TEST_FIXTURES.PRIMITIVE_TYPES.SYMBOL.TYPE);

    test.is(typeof result, 'boolean');
    test.true(result);
  }
);

ava(
  'core.utilities.validation.validateType – invalid parameters',
  (test) => {
    const expectedError = new errors.TypeValidationError('type', Function);

    const error = test.throws(
      () => validateType(TEST_FIXTURES.INSTANCE)
    );

    test.is(typeof error, 'object');
    test.deepEqual(error, expectedError);
  }
);