import ava from 'ava';

import TypeValidationError from '../TypeValidationError.js';


class TestType {
  static get CLASS_NAME() { return `${TestType.name}`; }
}

const TEST_FIXTURES = Object.freeze({
  TYPE: Object,
  TYPE_LIST: Object.freeze([ Array, Object, TestType ]),
  VARIABLE_NAME: 'VARIABLE_NAME'
});

ava(
  'core.errors.TypeValidationError – single type',
  (test) => {
    const typeValidationError = new TypeValidationError(
      TEST_FIXTURES.VARIABLE_NAME,
      TEST_FIXTURES.TYPE
    );

    test.is(typeof typeValidationError, 'object');
    test.true(typeValidationError instanceof Error);
    test.is(typeValidationError.message, `Variable “${TEST_FIXTURES.VARIABLE_NAME}” is not a valid “${TEST_FIXTURES.TYPE.name}”.`);
    test.is(typeValidationError.name, TypeValidationError.name);
    test.deepEqual(typeValidationError.typeNameList, [ TEST_FIXTURES.TYPE.name ]);
    test.is(typeValidationError.variableName, TEST_FIXTURES.VARIABLE_NAME);
  }
);

ava(
  'core.errors.TypeValidationError – multiple types',
  (test) => {
    const typeValidationError = new TypeValidationError(
      TEST_FIXTURES.VARIABLE_NAME,
      TEST_FIXTURES.TYPE_LIST
    );

    test.is(typeof typeValidationError, 'object');
    test.true(typeValidationError instanceof Error);
    test.is(typeValidationError.message, `Variable “${TEST_FIXTURES.VARIABLE_NAME}” is not a valid ${TEST_FIXTURES.TYPE_LIST.map( (type) => `“${type.name}”` ).join(' | ')}.`);
    test.is(typeValidationError.name, TypeValidationError.name);
    test.deepEqual( typeValidationError.typeNameList, TEST_FIXTURES.TYPE_LIST.map( (type) => type.name ) );
    test.is(typeValidationError.variableName, TEST_FIXTURES.VARIABLE_NAME);
  }
);

ava(
  'core.errors.TypeValidationError – unspecified parameters',
  (test) => {
    const error = test.throws(
      () => new TypeValidationError(TEST_FIXTURES.VARIABLE_NAME)
    );
    test.is(error.message, '‘type’ must be an “object”, “function”, or array of { “object” | “function” }.');

    const typeValidationError = new TypeValidationError(null, TEST_FIXTURES.TYPE);

    test.is(typeof typeValidationError, 'object');
    test.true(typeValidationError instanceof Error);
    test.is(typeValidationError.message, `Variable is not a valid “${TEST_FIXTURES.TYPE.name}”.`);
    test.is(typeValidationError.name, TypeValidationError.name);
    test.deepEqual(typeValidationError.typeNameList, [ TEST_FIXTURES.TYPE.name ]);
    test.is(typeValidationError.variableName, null);
  }
);