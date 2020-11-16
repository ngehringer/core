import ava from 'ava';

import * as errors from '../../../errors/index.js';
import pluralize from '../pluralize.js';


const TEST_FIXTURES = Object.freeze({
  STANDARD_NOUN: 'noun'
});

ava(
  'core.utilities.pluralize – standard noun',
  (test) => {
    const pluralized = pluralize(TEST_FIXTURES.STANDARD_NOUN);

    test.is(typeof pluralized, 'string');
    test.is(pluralized, `${TEST_FIXTURES.STANDARD_NOUN}s`);
  }
);

ava(
  'core.utilities.pluralize – standard noun; count = 1',
  (test) => {
    const pluralized = pluralize(TEST_FIXTURES.STANDARD_NOUN, 1);

    test.is(typeof pluralized, 'string');
    test.is(pluralized, TEST_FIXTURES.STANDARD_NOUN);
  }
);

ava(
  'core.utilities.pluralize – invalid parameters',
  (test) => {
    const expectedError = new errors.TypeValidationError('word', String);

    const error = test.throws(
      () => pluralize(null)
    );

    test.is(typeof error, 'object');
    test.deepEqual(error, expectedError);
  }
);