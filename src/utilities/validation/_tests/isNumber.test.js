import ava from 'ava';

import isNumber from '../isNumber.js';


const TEST_FIXTURES = Object.freeze({
  CONVERTIBLE_NON_NUMBER: '1',
  INCONVERTIBLE_NON_NUMBER: '',
  NUMBER: 1
});

ava(
  'core.utilities.validation.isNumber – number',
  (test) => {
    const result = isNumber(TEST_FIXTURES.NUMBER);

    test.is(typeof result, 'boolean');
    test.true(result);
  }
);

ava(
  'core.utilities.validation.isNumber – convertible non-number',
  (test) => {
    const result = isNumber(TEST_FIXTURES.CONVERTIBLE_NON_NUMBER);

    test.is(typeof result, 'boolean');
    test.true(result);
  }
);

ava(
  'core.utilities.validation.isNumber – inconvertible non-number',
  (test) => {
    const result = isNumber(TEST_FIXTURES.INCONVERTIBLE_NON_NUMBER);

    test.is(typeof result, 'boolean');
    test.false(result);
  }
);