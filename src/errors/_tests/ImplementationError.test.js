import ava from 'ava';

import ImplementationError from '../ImplementationError.js';


const TEST_FIXTURES = Object.freeze({
  CLASS_NAME: 'CLASS_NAME',
  PROPERTY_NAME: 'PROPERTY_NAME'
});

ava(
  'core.errors.ImplementationError',
  (test) => {
    const expectedMessage = `Class “${TEST_FIXTURES.CLASS_NAME}” does not implement the required “${TEST_FIXTURES.PROPERTY_NAME}” property.`;

    const implementationError = new ImplementationError(
      TEST_FIXTURES.PROPERTY_NAME,
      TEST_FIXTURES.CLASS_NAME
    );

    test.is(typeof implementationError, 'object');
    test.true(implementationError instanceof Error);
    test.is(implementationError.name, ImplementationError.name);
    test.is(implementationError.message, expectedMessage);
    test.is(implementationError.className, TEST_FIXTURES.CLASS_NAME);
    test.is(implementationError.propertyName, TEST_FIXTURES.PROPERTY_NAME);
  }
);

ava(
  'core.errors.ImplementationError – unspecified parameters',
  (test) => {
    const expectedMessage = 'Class does not implement a required property.';

    const implementationError = new ImplementationError();

    test.is(typeof implementationError, 'object');
    test.true(implementationError instanceof Error);
    test.is(implementationError.name, ImplementationError.name);
    test.is(implementationError.message, expectedMessage);
    test.is(implementationError.className, null);
    test.is(implementationError.propertyName, null);
  }
);