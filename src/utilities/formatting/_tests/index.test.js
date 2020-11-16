import ava from 'ava';

import * as formatting from '../index.js';


ava(
  'core.utilities.formatting',
  (test) => {
    test.is(typeof formatting, 'object');
    test.is(typeof formatting.formatNumber, 'function');
    test.is(typeof formatting.pluralize, 'function');
  }
);