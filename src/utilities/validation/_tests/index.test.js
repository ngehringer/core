import ava from 'ava';

import * as validation from '../index.js';


ava(
  'core.utilities.validation',
  (test) => {
    test.is(typeof validation, 'object');
    test.is(typeof validation.isDate, 'function');
    test.is(typeof validation.isNonEmptyString, 'function');
    test.is(typeof validation.isNumber, 'function');
    test.is(typeof validation.validateEnumeration, 'function');
    test.is(typeof validation.validateInheritance, 'function');
    test.is(typeof validation.validateType, 'function');
  }
);