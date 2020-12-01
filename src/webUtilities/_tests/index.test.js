import ava from 'ava';

import * as webUtilities from '../index.js';


ava(
  'core.webUtilities',
  (t) => {
    t.is(typeof webUtilities, 'object');
    t.is(typeof webUtilities.ajax, 'object');
    t.is(typeof webUtilities.hashParameters, 'object');
    t.is(typeof webUtilities.injectHTML, 'function');
  }
);