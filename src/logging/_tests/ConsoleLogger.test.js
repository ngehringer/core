import ava from 'ava';

import REFERENCE from '../REFERENCE.js';
import ConsoleLogger from '../ConsoleLogger.js';


const TEST_FIXTURES = Object.freeze({
  LOG_DATA: {},
  LOG_LEVEL: REFERENCE.ENUMERATIONS.LOG_LEVEL.INFO,
  SOURCE_ID: `${ConsoleLogger.CLASS_NAME}::test`,
  VERBOSE: true
});

ava(
  'core.logging.ConsoleLogger – static data',
  (test) => {
    test.is(typeof ConsoleLogger.CLASS_NAME, 'string');
  }
);

ava(
  'core.logging.ConsoleLogger.log',
  (test) => {
    ConsoleLogger.log({
      data: TEST_FIXTURES.LOG_DATA,
      logLevel: TEST_FIXTURES.LOG_LEVEL,
      sourceID: TEST_FIXTURES.SOURCE_ID,
      verbose: TEST_FIXTURES.VERBOSE
    });

    test.pass();
  }
);

ava(
  'core.logging.ConsoleLogger.log – unspecified parameters',
  (test) => {
    ConsoleLogger.log({
      data: null
    });

    test.pass();
  }
);