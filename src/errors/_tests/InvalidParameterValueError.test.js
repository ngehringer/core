import ava from 'ava';

import InvalidParameterValueError from '../InvalidParameterValueError.js';


const TEST_FIXTURES = Object.freeze({
  PARAMETERS: Object.freeze({
    PARAMETER_NAME: 'parameter',
    REASON: 'reasons'
  })
});

ava(
  'core.errors.InvalidParameterValueError',
  (test) => {
    const invalidParameterValueError = new InvalidParameterValueError({
      parameterName: TEST_FIXTURES.PARAMETERS.PARAMETER_NAME,
      reason: TEST_FIXTURES.PARAMETERS.REASON
    });

    test.is(typeof invalidParameterValueError, 'object');
    test.true(invalidParameterValueError instanceof Error);
    test.is(invalidParameterValueError.message, `Invalid “${TEST_FIXTURES.PARAMETERS.PARAMETER_NAME}” parameter value specified: ${TEST_FIXTURES.PARAMETERS.REASON}.`);
    test.is(invalidParameterValueError.name, InvalidParameterValueError.name);
    test.is(invalidParameterValueError.parameterName, TEST_FIXTURES.PARAMETERS.PARAMETER_NAME);
    test.is(invalidParameterValueError.reason, TEST_FIXTURES.PARAMETERS.REASON);
  }
);

ava(
  'core.errors.InvalidParameterValueError – unspecified parameters',
  (test) => {
    const invalidParameterValueError = new InvalidParameterValueError();

    test.is(typeof invalidParameterValueError, 'object');
    test.true(invalidParameterValueError instanceof Error);
    test.is(invalidParameterValueError.message, 'Invalid parameter value specified.');
    test.is(invalidParameterValueError.name, InvalidParameterValueError.name);
    test.is(invalidParameterValueError.parameterName, null);
    test.is(invalidParameterValueError.reason, null);
  }
);