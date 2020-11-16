import ava from 'ava';

import isNumber from '../isNumber.js';


const TEST_FIXTURES = Object.freeze({
  NON_NUMBER: '',
  NUMBER: 1
});

ava(
  'core.utilities.isNumber – number',
  (test) => {
    const result = isNumber(TEST_FIXTURES.NUMBER);

    test.is(typeof result, 'boolean');
    test.true(result);
  }
);

ava(
  'core.utilities.isNumber – non-number',
  (test) => {
    const result = isNumber(TEST_FIXTURES.NON_NUMBER);

    test.is(typeof result, 'boolean');
    test.false(result);
  }
);