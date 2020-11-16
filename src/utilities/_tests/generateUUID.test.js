import ava from 'ava';

import REFERENCE from '../../REFERENCE/index.js';
import generateUUID from '../generateUUID.js';


ava(
  'core.utilities.generateUUID',
  (test) => {
    const uuid = generateUUID();

    test.is(typeof uuid, 'string');
    test.true( REFERENCE.UUID_REGEXP.test(uuid) );
  }
);