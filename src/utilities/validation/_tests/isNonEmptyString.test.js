import ava from 'ava';

import isNonEmptyString from '../isNonEmptyString.js';


const TEST_FIXTURES = Object.freeze({
  EMPTY_STRING: '',
  NON_EMPTY_STRING: 'string'
});

ava(
  'core.utilities.isNonEmptyString – empty string',
  (test) => {
    const result = isNonEmptyString(TEST_FIXTURES.EMPTY_STRING);

    test.is(typeof result, 'boolean');
    test.false(result);
  }
);

ava(
  'core.utilities.isNonEmptyString – non-empty string',
  (test) => {
    const result = isNonEmptyString(TEST_FIXTURES.NON_EMPTY_STRING);

    test.is(typeof result, 'boolean');
    test.true(result);
  }
);