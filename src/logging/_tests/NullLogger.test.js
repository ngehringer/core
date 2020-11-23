import ava from 'ava';

import REFERENCE from '../REFERENCE.js';
import NullLogger from '../NullLogger.js';


const TEST_FIXTURES = Object.freeze({
  LOG_DATA: {},
  LOG_LEVEL: REFERENCE.ENUMERATIONS.LOG_LEVEL.INFO,
  SOURCE_ID: `${NullLogger.CLASS_NAME}::test`,
  VERBOSE: true
});

ava(
  'core.logging.NullLogger – static data',
  (test) => {
    test.is(typeof NullLogger.CLASS_NAME, 'string');
  }
);

ava(
  'core.logging.NullLogger.log',
  (test) => {
    NullLogger.log({
      data: TEST_FIXTURES.LOG_DATA,
      logLevel: TEST_FIXTURES.LOG_LEVEL,
      sourceID: TEST_FIXTURES.SOURCE_ID,
      verbose: TEST_FIXTURES.VERBOSE
    });

    test.pass();
  }
);