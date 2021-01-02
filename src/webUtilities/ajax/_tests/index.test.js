import ava from 'ava';

import * as ajax from '../index.js';


ava(
  'core.webUtilities.ajax',
  (t) => {
    t.is(typeof ajax, 'object');
    t.is(typeof ajax.delete, 'function');
    t.is(typeof ajax.extractResponseBody, 'function');
    t.is(typeof ajax.generateQueryString, 'function');
    t.is(typeof ajax.generateRequest, 'function');
    t.is(typeof ajax.get, 'function');
    t.is(typeof ajax.head, 'function');
    t.is(typeof ajax.options, 'function');
    t.is(typeof ajax.patch, 'function');
    t.is(typeof ajax.post, 'function');
    t.is(typeof ajax.put, 'function');
    t.is(typeof ajax.sendRequest, 'function');
  }
);