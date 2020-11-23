import ava from 'ava';

import EnumerationValidationError from '../EnumerationValidationError.js';


const TEST_FIXTURES = Object.freeze({
  ENUMERATION_NAME: 'ENUMERATION_NAME',
  VALUE_NAME: 'VALUE_NAME'
});

ava(
  'core.errors.EnumerationValidationError',
  (test) => {
    const enumerationValidationError = new EnumerationValidationError(
      TEST_FIXTURES.VALUE_NAME,
      TEST_FIXTURES.ENUMERATION_NAME
    );

    test.is(typeof enumerationValidationError, 'object');
    test.true(enumerationValidationError instanceof Error);
    test.is(enumerationValidationError.message, `The specified “${TEST_FIXTURES.VALUE_NAME}” value is an invalid “${TEST_FIXTURES.ENUMERATION_NAME}” enumeration item.`);
    test.is(enumerationValidationError.name, EnumerationValidationError.name);
    test.is(enumerationValidationError.enumerationName, TEST_FIXTURES.ENUMERATION_NAME);
    test.is(enumerationValidationError.valueName, TEST_FIXTURES.VALUE_NAME);
  }
);

ava(
  'core.errors.EnumerationValidationError – unspecified parameters',
  (test) => {
    const enumerationValidationError = new EnumerationValidationError();

    test.is(typeof enumerationValidationError, 'object');
    test.true(enumerationValidationError instanceof Error);
    test.is(enumerationValidationError.message, 'The specified value is an invalid enumeration item.');
    test.is(enumerationValidationError.name, EnumerationValidationError.name);
    test.is(enumerationValidationError.enumerationName, null);
    test.is(enumerationValidationError.valueName, null);
  }
);