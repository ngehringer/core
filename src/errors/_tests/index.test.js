import ava from 'ava';

import * as errors from '../index.js';


ava(
  'core.errors',
  (test) => {
    test.is(typeof errors, 'object');
    test.is(typeof errors.EnumerationValidationError, 'function');
    test.is(typeof errors.HTTPResponseError, 'function');
    test.is(typeof errors.ImplementationError, 'function');
    test.is(typeof errors.ItemRetrievalError, 'function');
    test.is(typeof errors.TypeValidationError, 'function');
  }
);