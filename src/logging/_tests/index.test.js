import ava from 'ava';

import * as logging from '../index.js';


ava(
  'core.logging',
  (test) => {
    test.is(typeof logging, 'object');
    test.is(typeof logging.BaseLogger, 'function');
    test.is(typeof logging.ConsoleLogger, 'function');
    test.is(typeof logging.LogItem, 'function');
    test.is(typeof logging.NullLogger, 'function');
    test.is(typeof logging.REFERENCE, 'object');
  }
);