import ava from 'ava';

import REFERENCE from '../../REFERENCE/index.js';
import generateUUID from '../generateUUID.js';


ava(
  'core.utilities.generateUUID',
  (t) => {
    const uuid = generateUUID();

    t.is(typeof uuid, 'string');
    t.true( REFERENCE.UUID_REGEXP.test(uuid) );
  }
);