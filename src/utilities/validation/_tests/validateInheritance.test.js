import ava from 'ava';

import * as errors from '../../../errors/index.js';
import validateInheritance from '../validateInheritance.js';


const TEST_FIXTURES = Object.freeze({
  CHILD: class extends Object {},
  NON_CHILD: {},
  PARENT: Object
});

ava(
  'core.utilities.validation.validateInheritance – child',
  (test) => {
    const result = validateInheritance(TEST_FIXTURES.CHILD, TEST_FIXTURES.PARENT);

    test.is(typeof result, 'boolean');
    test.true(result);
  }
);

ava(
  'core.utilities.validation.validateInheritance – non-child',
  (test) => {
    const result = validateInheritance(TEST_FIXTURES.NON_CHILD, TEST_FIXTURES.PARENT);

    test.is(typeof result, 'boolean');
    test.false(result);
  }
);

ava(
  'core.utilities.validation.validateInheritance – invalid parameters',
  (test) => {
    const expectedError1 = new errors.TypeValidationError('parent', Object);

    const error1 = test.throws(
      () => validateInheritance(TEST_FIXTURES.CHILD)
    );

    test.is(typeof error1, 'object');
    test.deepEqual(error1, expectedError1);

    const expectedError2 = new errors.TypeValidationError('child', Object);

    const error2 = test.throws(
      () => validateInheritance(undefined, TEST_FIXTURES.PARENT)
    );

    test.is(typeof error2, 'object');
    test.deepEqual(error2, expectedError2);
  }
);