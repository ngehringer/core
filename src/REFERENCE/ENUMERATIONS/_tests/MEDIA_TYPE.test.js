import ava from 'ava';

import MEDIA_TYPE from '../MEDIA_TYPE.js';


ava(
  'core.REFERENCE.ENUMERATIONS.MEDIA_TYPE',
  (test) => {
    test.is(typeof MEDIA_TYPE, 'object');
    test.is(typeof MEDIA_TYPE.CSS, 'string');
    test.is(typeof MEDIA_TYPE.CSV, 'string');
    test.is(typeof MEDIA_TYPE.HTML, 'string');
    test.is(typeof MEDIA_TYPE.JAVASCRIPT, 'string');
    test.is(typeof MEDIA_TYPE.JSON, 'string');
    test.is(typeof MEDIA_TYPE.OCTET_STREAM, 'string');
    test.is(typeof MEDIA_TYPE.TEXT, 'string');
    test.is(typeof MEDIA_TYPE.XML, 'string');
  }
);