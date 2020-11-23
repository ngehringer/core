import ava from 'ava';

import REFERENCE from '../REFERENCE.js';
import LogItem from '../LogItem.js';


const TEST_FIXTURES = Object.freeze({
  DATA_ERROR: new Error(`${LogItem.name}`),
  DATA_OBJECT: {},
  DATA_STRING: '',
  LOG_LEVEL: REFERENCE.ENUMERATIONS.LOG_LEVEL.INFO,
  SOURCE_ID: `${LogItem.CLASS_NAME}::test`,
  VERBOSE: true
});

ava(
  'core.logging.LogItem – static data',
  (test) => {
    test.is(typeof LogItem.CLASS_NAME, 'string');
    test.is(typeof LogItem.DEFAULTS, 'object');
    test.is(LogItem.DEFAULTS.LOG_LEVEL, REFERENCE.ENUMERATIONS.LOG_LEVEL.UNKNOWN);
    test.is(LogItem.DEFAULTS.SOURCE_ID, null);
    test.is(LogItem.DEFAULTS.VERBOSE, false);
  }
);

ava(
  'core.logging.LogItem',
  (test) => {
    const logItem = new LogItem({
      data: TEST_FIXTURES.DATA_OBJECT,
      logLevel: TEST_FIXTURES.LOG_LEVEL,
      sourceID: TEST_FIXTURES.SOURCE_ID,
      verbose: TEST_FIXTURES.VERBOSE
    });

    test.is(logItem.data, TEST_FIXTURES.DATA_OBJECT);
    test.is(logItem.logLevel, TEST_FIXTURES.LOG_LEVEL);
    test.is( logItem.message, JSON.stringify(TEST_FIXTURES.DATA_OBJECT) );
    test.is(logItem.sourceID, TEST_FIXTURES.SOURCE_ID);
    test.is(typeof logItem.time, 'object');
    test.true(logItem.time instanceof Date);
  }
);

ava(
  'core.logging.LogItem – Error (verbose: false)',
  (test) => {
    const logItem = new LogItem({
      data: TEST_FIXTURES.DATA_ERROR,
      logLevel: TEST_FIXTURES.LOG_LEVEL,
      sourceID: TEST_FIXTURES.SOURCE_ID,
      verbose: false
    });

    test.is(logItem.data, TEST_FIXTURES.DATA_ERROR);
    test.is(logItem.logLevel, TEST_FIXTURES.LOG_LEVEL);
    test.is(logItem.message, `${TEST_FIXTURES.DATA_ERROR.message}`);
    test.is(logItem.sourceID, TEST_FIXTURES.SOURCE_ID);
    test.is(typeof logItem.time, 'object');
    test.true(logItem.time instanceof Date);
  }
);

ava(
  'core.logging.LogItem – Error (verbose: true)',
  (test) => {
    const error = new Error(`${LogItem.name}`);

    const logItem1 = new LogItem({
      data: error,
      logLevel: TEST_FIXTURES.LOG_LEVEL,
      sourceID: TEST_FIXTURES.SOURCE_ID,
      verbose: TEST_FIXTURES.VERBOSE
    });

    test.is(logItem1.data, error);
    test.is(logItem1.logLevel, TEST_FIXTURES.LOG_LEVEL);
    test.is(typeof logItem1.message, 'string');
    test.true( new RegExp(`^\\(${error.name}\\) ${error.message}\\n`).test(logItem1.message) );
    test.is(logItem1.sourceID, TEST_FIXTURES.SOURCE_ID);
    test.is(typeof logItem1.time, 'object');
    test.true(logItem1.time instanceof Date);

    // remove the “stack” property from the error
    delete error.stack;

    const logItem2 = new LogItem({
      data: error,
      logLevel: TEST_FIXTURES.LOG_LEVEL,
      sourceID: TEST_FIXTURES.SOURCE_ID,
      verbose: TEST_FIXTURES.VERBOSE
    });

    test.is(logItem2.data, error);
    test.is(logItem2.logLevel, TEST_FIXTURES.LOG_LEVEL);
    test.is(logItem2.message, `(${error.name}) ${error.message}`);
    test.is(logItem2.sourceID, TEST_FIXTURES.SOURCE_ID);
    test.is(typeof logItem2.time, 'object');
    test.true(logItem2.time instanceof Date);
  }
);

ava(
  'core.logging.LogItem – unspecified parameters',
  (test) => {
    const logItem = new LogItem({
      data: TEST_FIXTURES.DATA_STRING
    });

    test.is(logItem.data, TEST_FIXTURES.DATA_STRING);
    test.is(logItem.logLevel, LogItem.DEFAULTS.LOG_LEVEL);
    test.is(logItem.message, TEST_FIXTURES.DATA_STRING);
    test.is(logItem.sourceID, LogItem.DEFAULTS.SOURCE_ID);
    test.is(typeof logItem.time, 'object');
    test.true(logItem.time instanceof Date);
  }
);

ava(
  'core.logging.LogItem – invalid parameters',
  (test) => {
    const logItem = new LogItem({
      data: null,
      logLevel: '',
      sourceID: TEST_FIXTURES.SOURCE_ID,
      verbose: TEST_FIXTURES.VERBOSE
    });

    test.is(logItem.data, null);
    test.is(logItem.logLevel, LogItem.DEFAULTS.LOG_LEVEL);
    test.is(logItem.message, LogItem.DEFAULTS.MESSAGE);
    test.is(logItem.sourceID, TEST_FIXTURES.SOURCE_ID);
    test.is(typeof logItem.time, 'object');
    test.true(logItem.time instanceof Date);
  }
);