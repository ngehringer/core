import ava from 'ava';

import * as errors from '../../../errors/index.js';
import REFERENCE from '../../../REFERENCE/index.js';
import formatNumber from '../formatNumber.js';


const TEST_FIXTURES = Object.freeze({
  NUMBER: 1000
});

ava(
  'core.utilities.formatNumber – number',
  (test) => {
    const formattedNumber = formatNumber(TEST_FIXTURES.NUMBER);

    test.is(typeof formattedNumber, 'string');
    test.is( formattedNumber, TEST_FIXTURES.NUMBER.toLocaleString() );
  }
);

ava(
  'core.utilities.formatNumber – null',
  (test) => {
    const formattedNumber = formatNumber(null);

    test.is(typeof formattedNumber, 'string');
    test.is(formattedNumber, REFERENCE.NULL_PLACEHOLDER);
  }
);

ava(
  'core.utilities.formatNumber – non-number',
  (test) => {
    const expectedError = new errors.TypeValidationError('number', Number);

    const error = test.throws(
      () => formatNumber('')
    );

    test.is(typeof error, 'object');
    test.deepEqual(error, expectedError);
  }
);