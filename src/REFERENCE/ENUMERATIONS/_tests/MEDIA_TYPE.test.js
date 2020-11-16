import ava from 'ava';

import MEDIA_TYPE from '../MEDIA_TYPE.js';


ava(
  'core.REFERENCE.ENUMERATIONS.MEDIA_TYPE',
  (test) => {
    test.is(typeof MEDIA_TYPE, 'object');
    test.is(typeof MEDIA_TYPE.HTML, 'string');
    test.is(typeof MEDIA_TYPE.JSON, 'string');
  }
);