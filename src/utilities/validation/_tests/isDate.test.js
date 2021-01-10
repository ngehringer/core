import ava from 'ava';

import isDate from '../isDate.js';


const TEST_FIXTURES = Object.freeze({
  INVALID_DATE: new Date(''),
  VALID_DATE: new Date()
});

ava(
  'core.utilities.validation.isDate – valid Date',
  (test) => {
    const result = isDate(TEST_FIXTURES.VALID_DATE);

    test.is(typeof result, 'boolean');
    test.true(result);
  }
);

ava(
  'core.utilities.validation.isDate – invalid Date',
  (test) => {
    const result = isDate(TEST_FIXTURES.INVALID_DATE);

    test.is(typeof result, 'boolean');
    test.false(result);
  }
);

ava(
  'core.utilities.validation.isDate – null',
  (test) => {
    const result = isDate(null);

    test.is(typeof result, 'boolean');
    test.false(result);
  }
);