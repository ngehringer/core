import ava from 'ava';

import convertToNumber from '../convertToNumber.js';


const TEST_FIXTURES = Object.freeze({
  DECIMAL_PLACES: 2,
  NON_NUMERIC_STRING: 'null',
  NUMBER: 1000,
  NUMERIC_STRING: '1000.00'
});

ava(
  'core.utilities.conversion.convertToNumber – numeric string',
  (test) => {
    const number = convertToNumber(TEST_FIXTURES.NUMERIC_STRING);

    test.is(typeof number, 'number');
    test.false( Number.isNaN(number) );
    test.is(number.toFixed(TEST_FIXTURES.DECIMAL_PLACES), TEST_FIXTURES.NUMERIC_STRING);
  }
);

ava(
  'core.utilities.conversion.convertToNumber – Number',
  (test) => {
    const number = convertToNumber(TEST_FIXTURES.NUMBER);

    test.is(number, TEST_FIXTURES.NUMBER);
  }
);

ava(
  'core.utilities.conversion.convertToNumber – non-numeric string',
  (test) => {
    const number = convertToNumber(TEST_FIXTURES.NON_NUMERIC_STRING);

    test.is(number, null);
  }
);