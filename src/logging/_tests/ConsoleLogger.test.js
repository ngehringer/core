import ava from 'ava';

import ConsoleLogger from '../ConsoleLogger.js';


const TEST_FIXTURES = Object.freeze({
  LOG_DATA: {},
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
  'core.logging.ConsoleLogger.logCriticalError',
  (test) => {
    ConsoleLogger.logCriticalError({
      data: TEST_FIXTURES.LOG_DATA,
      sourceID: TEST_FIXTURES.SOURCE_ID,
      verbose: TEST_FIXTURES.VERBOSE
    });

    test.pass();
  }
);

ava(
  'core.logging.ConsoleLogger.logDebug',
  (test) => {
    ConsoleLogger.logDebug({
      data: TEST_FIXTURES.LOG_DATA,
      sourceID: TEST_FIXTURES.SOURCE_ID,
      verbose: TEST_FIXTURES.VERBOSE
    });

    test.pass();
  }
);

ava(
  'core.logging.ConsoleLogger.logError',
  (test) => {
    ConsoleLogger.logError({
      data: TEST_FIXTURES.LOG_DATA,
      sourceID: TEST_FIXTURES.SOURCE_ID,
      verbose: TEST_FIXTURES.VERBOSE
    });

    test.pass();
  }
);

ava(
  'core.logging.ConsoleLogger.logInfo',
  (test) => {
    ConsoleLogger.logInfo({
      data: TEST_FIXTURES.LOG_DATA,
      sourceID: TEST_FIXTURES.SOURCE_ID,
      verbose: TEST_FIXTURES.VERBOSE
    });

    test.pass();
  }
);

ava(
  'core.logging.ConsoleLogger.logWarning',
  (test) => {
    ConsoleLogger.logWarning({
      data: TEST_FIXTURES.LOG_DATA,
      sourceID: TEST_FIXTURES.SOURCE_ID,
      verbose: TEST_FIXTURES.VERBOSE
    });

    test.pass();
  }
);