import ava from 'ava';

import * as errors from '../../../errors/index.js';
import pluralize from '../pluralize.js';
import pluralizeDictionary from '../pluralize.dictionary.js';


const TEST_FIXTURES = Object.freeze({
  INVALID_WORD: 'No.',
  IRREGULAR_WORD: Object.freeze({
    PLURAL: pluralizeDictionary[ Object.keys(pluralizeDictionary)[0] ],
    SINGULAR: Object.keys(pluralizeDictionary)[0]
  }),
  REGULAR_WORD: Object.freeze({
    PLURAL: 'nouns',
    SINGULAR: 'noun'
  })
});

ava(
  'core.utilities.formatting.pluralize – regular word',
  (test) => {
    const pluralized = pluralize(TEST_FIXTURES.REGULAR_WORD.SINGULAR);

    test.is(typeof pluralized, 'string');
    test.is(pluralized, TEST_FIXTURES.REGULAR_WORD.PLURAL);
  }
);

ava(
  'core.utilities.formatting.pluralize – regular word; count = 1',
  (test) => {
    const pluralized = pluralize(TEST_FIXTURES.REGULAR_WORD.SINGULAR, 1);

    test.is(typeof pluralized, 'string');
    test.is(pluralized, TEST_FIXTURES.REGULAR_WORD.SINGULAR);
  }
);

ava(
  'core.utilities.formatting.pluralize – irregular word',
  (test) => {
    const pluralized = pluralize(TEST_FIXTURES.IRREGULAR_WORD.SINGULAR);

    test.is(typeof pluralized, 'string');
    test.is(pluralized, TEST_FIXTURES.IRREGULAR_WORD.PLURAL);
  }
);

ava(
  'core.utilities.formatting.pluralize – invalid parameters',
  (test) => {
    const expectedError1 = new errors.TypeValidationError('word', String);

    const error1 = test.throws(
      () => pluralize(null)
    );
    test.is(typeof error1, 'object');
    test.deepEqual(error1, expectedError1);

    const expectedError2 = new Error('Invalid “word” parameter value specified: must contain only alphanumeric characters.');

    const error2 = test.throws(
      () => pluralize(TEST_FIXTURES.INVALID_WORD)
    );
    test.is(typeof error2, 'object');
    test.deepEqual(error2, expectedError2);
  }
);