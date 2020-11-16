import ava from 'ava';

import * as infrastructure from '../index.js';


ava(
  'core.infrastructure',
  (test) => {
    test.is(typeof infrastructure, 'object');
    test.is(typeof infrastructure.BaseFactory, 'function');
    test.is(typeof infrastructure.BaseModel, 'function');
    test.is(typeof infrastructure.BaseViewModel, 'function');
    test.is(typeof infrastructure.EventSource, 'function');
    test.is(typeof infrastructure.PaginationOptions, 'function');
    test.is(typeof infrastructure.Response, 'function');
  }
);