import ava from 'ava';

import * as hashParameters from '../index.js';


ava(
  'core.webUtilities.hashParameters',
  (t) => {
    t.is(typeof hashParameters, 'object');
    t.is(typeof hashParameters.getList, 'function');
    t.is(typeof hashParameters.getValue, 'function');
    t.is(typeof hashParameters.setValue, 'function');
  }
);