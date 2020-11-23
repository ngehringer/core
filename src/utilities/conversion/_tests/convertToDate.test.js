import ava from 'ava';

import convertToDate from '../convertToDate.js';


const TEST_FIXTURES = Object.freeze({
  ISO_8601_DATE: new Date(2020, 0, 1, 0, 0, 0, 0),
  ISO_8601_STRING: '2020-01-01T00:00:00.000Z'
});

ava(
  'core.utilities.conversion.convertToDate – ISO 8601 string',
  (test) => {
    const date = convertToDate(TEST_FIXTURES.ISO_8601_STRING);

    test.is(typeof date, 'object');
    test.true(date instanceof Date);
    test.is(date.toISOString(), TEST_FIXTURES.ISO_8601_STRING);
  }
);

ava(
  'core.utilities.conversion.convertToDate – Date',
  (test) => {
    const date = convertToDate(TEST_FIXTURES.ISO_8601_DATE);

    test.is(date, TEST_FIXTURES.ISO_8601_DATE);
  }
);