import ava from 'ava';
import sinon from 'sinon';

import * as errors from '../../errors/index.js';
import REFERENCE from '../REFERENCE.js';
import BaseLogger from '../BaseLogger.js';
import LogItem from '../LogItem.js';


const TEST_FIXTURES = Object.freeze({
  LOG_DATA_ERROR: new Error('data'),
  LOG_DATA_OBJECT: Object.freeze({
    data: {}
  }),
  LOG_DATA_STRING: 'data',
  LOG_LEVEL: REFERENCE.ENUMERATIONS.LOG_LEVEL.INFO,
  SOURCE_ID: `${BaseLogger.CLASS_NAME}::test`,
  VERBOSE: true
});

const getTestLogger = ({
  logFake
}) => class extends BaseLogger {
  static _log(...rest) {
    logFake?.(...rest);
  }
};

ava(
  'core.logging.BaseLogger – static data',
  (test) => {
    test.is(typeof BaseLogger.CLASS_NAME, 'string');
    test.is(typeof BaseLogger.DEFAULTS, 'object');
    test.is(BaseLogger.DEFAULTS.LOG_LEVEL, REFERENCE.ENUMERATIONS.LOG_LEVEL.UNKNOWN);
    test.is(BaseLogger.DEFAULTS.SOURCE_ID, null);
    test.is(BaseLogger.DEFAULTS.VERBOSE, false);
  }
);

ava(
  'core.logging.BaseLogger.log',
  (test) => {
    const {
      // remove the “time” property for comparison
      time: _expectedLogItemTime,
      ...expectedLogItem
    } = new LogItem({
      data: TEST_FIXTURES.LOG_DATA_OBJECT,
      logLevel: TEST_FIXTURES.LOG_LEVEL,
      sourceID: TEST_FIXTURES.SOURCE_ID
    });

    const logFake = sinon.fake();

    const TestLogger = getTestLogger({
      logFake: logFake
    });

    TestLogger.log({
      data: TEST_FIXTURES.LOG_DATA_OBJECT,
      logLevel: TEST_FIXTURES.LOG_LEVEL,
      sourceID: TEST_FIXTURES.SOURCE_ID,
      verbose: TEST_FIXTURES.VERBOSE
    });

    test.is(logFake.callCount, 1);
    test.true( logFake.calledWithMatch(expectedLogItem) );
  }
);

ava(
  'core.logging.BaseLogger.log – internal error',
  (test) => {
    const logError1 = new Error(`${BaseLogger.log.name}`);
    const logFake1 = sinon.fake.throws(logError1);

    const TestLogger1 = getTestLogger({
      logFake: logFake1
    });

    const {
      // remove the “time” property for comparison
      time: _expectedLogItemTime1,
      ...expectedLogItem1
    } = new LogItem({
      data: TEST_FIXTURES.LOG_DATA_STRING,
      logLevel: REFERENCE.ENUMERATIONS.LOG_LEVEL.CRITICAL_ERROR,
      sourceID: TEST_FIXTURES.SOURCE_ID,
      verbose: TEST_FIXTURES.VERBOSE
    });

    TestLogger1.log({
      data: TEST_FIXTURES.LOG_DATA_STRING,
      logLevel: REFERENCE.ENUMERATIONS.LOG_LEVEL.CRITICAL_ERROR,
      sourceID: TEST_FIXTURES.SOURCE_ID,
      verbose: TEST_FIXTURES.VERBOSE
    });

    test.is(logFake1.callCount, 1);
    test.true( logFake1.calledWithMatch(expectedLogItem1) );

    const logError2 = new Error(`${BaseLogger.log.name}`);
    // remove the “stack” property from the error
    delete logError2.stack;

    const logFake2 = sinon.fake.throws(logError2);

    const TestLogger2 = getTestLogger({
      logFake: logFake2
    });

    const {
      // remove the “time” property for comparison
      time: _expectedLogItemTime2,
      ...expectedLogItem2
    } = new LogItem({
      data: TEST_FIXTURES.LOG_DATA_STRING,
      logLevel: REFERENCE.ENUMERATIONS.LOG_LEVEL.CRITICAL_ERROR,
      sourceID: TEST_FIXTURES.SOURCE_ID,
      verbose: TEST_FIXTURES.VERBOSE
    });

    TestLogger2.log({
      data: TEST_FIXTURES.LOG_DATA_STRING,
      logLevel: REFERENCE.ENUMERATIONS.LOG_LEVEL.CRITICAL_ERROR,
      sourceID: TEST_FIXTURES.SOURCE_ID,
      verbose: TEST_FIXTURES.VERBOSE
    });

    test.is(logFake2.callCount, 1);
    test.true( logFake2.calledWithMatch(expectedLogItem2) );
  }
);

ava(
  'core.logging.BaseLogger.log – unimplemented “_log” function',
  (test) => {
    const expectedError = new errors.ImplementationError('_log', BaseLogger.CLASS_NAME);

    const TestLogger = class extends BaseLogger {};

    const error = test.throws(
      () => TestLogger.log({
        data: TEST_FIXTURES.LOG_DATA_STRING
      })
    );
    test.is(typeof error, 'object');
    test.deepEqual(error, expectedError);
  }
);

ava(
  'core.logging.BaseLogger.logCriticalError',
  (test) => {
    const {
      // remove the “time” property for comparison
      time: _expectedLogItemTime,
      ...expectedLogItem
    } = new LogItem({
      data: TEST_FIXTURES.LOG_DATA_ERROR,
      logLevel: REFERENCE.ENUMERATIONS.LOG_LEVEL.CRITICAL_ERROR,
      sourceID: TEST_FIXTURES.SOURCE_ID,
      verbose: TEST_FIXTURES.VERBOSE
    });

    const logFake = sinon.fake();
    const TestLogger = getTestLogger({
      logFake: logFake
    });

    TestLogger.logCriticalError({
      data: TEST_FIXTURES.LOG_DATA_ERROR,
      sourceID: TEST_FIXTURES.SOURCE_ID,
      verbose: TEST_FIXTURES.VERBOSE
    });

    test.is(logFake.callCount, 1);
    test.true( logFake.calledWithMatch(expectedLogItem) );
    test.is(typeof logFake.getCall(0).args[0].message, 'string');
    test.true( new RegExp(`^\\(${TEST_FIXTURES.LOG_DATA_ERROR.name}\\) ${TEST_FIXTURES.LOG_DATA_ERROR.message}\\n`).test(logFake.getCall(0).args[0].message) );
  }
);

ava(
  'core.logging.BaseLogger.logDebug',
  (test) => {
    const {
      // remove the “time” property for comparison
      time: _expectedLogItemTime,
      ...expectedLogItem
    } = new LogItem({
      data: TEST_FIXTURES.LOG_DATA_OBJECT,
      logLevel: REFERENCE.ENUMERATIONS.LOG_LEVEL.DEBUG,
      sourceID: TEST_FIXTURES.SOURCE_ID
    });

    const logFake = sinon.fake();
    const TestLogger = getTestLogger({
      logFake: logFake
    });

    TestLogger.logDebug({
      data: TEST_FIXTURES.LOG_DATA_OBJECT,
      sourceID: TEST_FIXTURES.SOURCE_ID,
      verbose: TEST_FIXTURES.VERBOSE
    });

    test.is(logFake.callCount, 1);
    test.true( logFake.calledWithMatch(expectedLogItem) );
  }
);

ava(
  'core.logging.BaseLogger.logError',
  (test) => {
    const {
      // remove the “time” property for comparison
      time: _expectedLogItemTime,
      ...expectedLogItem
    } = new LogItem({
      data: TEST_FIXTURES.LOG_DATA_ERROR,
      logLevel: REFERENCE.ENUMERATIONS.LOG_LEVEL.ERROR,
      sourceID: TEST_FIXTURES.SOURCE_ID
    });

    const logFake = sinon.fake();
    const TestLogger = getTestLogger({
      logFake: logFake
    });

    TestLogger.logError({
      data: TEST_FIXTURES.LOG_DATA_ERROR,
      sourceID: TEST_FIXTURES.SOURCE_ID,
      verbose: false
    });

    test.is(logFake.callCount, 1);
    test.true( logFake.calledWithMatch(expectedLogItem) );
  }
);

ava(
  'core.logging.BaseLogger.logInfo',
  (test) => {
    const {
      // remove the “time” property for comparison
      time: _expectedLogItemTime,
      ...expectedLogItem
    } = new LogItem({
      data: TEST_FIXTURES.LOG_DATA_OBJECT,
      logLevel: REFERENCE.ENUMERATIONS.LOG_LEVEL.INFO,
      sourceID: TEST_FIXTURES.SOURCE_ID
    });

    const logFake = sinon.fake();
    const TestLogger = getTestLogger({
      logFake: logFake
    });

    TestLogger.logInfo({
      data: TEST_FIXTURES.LOG_DATA_OBJECT,
      sourceID: TEST_FIXTURES.SOURCE_ID,
      verbose: TEST_FIXTURES.VERBOSE
    });

    test.is(logFake.callCount, 1);
    test.true( logFake.calledWithMatch(expectedLogItem) );
  }
);

ava(
  'core.logging.BaseLogger.logWarning',
  (test) => {
    const {
      // remove the “time” property for comparison
      time: _expectedLogItemTime,
      ...expectedLogItem
    } = new LogItem({
      data: TEST_FIXTURES.LOG_DATA_STRING,
      logLevel: REFERENCE.ENUMERATIONS.LOG_LEVEL.WARNING,
      sourceID: TEST_FIXTURES.SOURCE_ID
    });

    const logFake = sinon.fake();
    const TestLogger = getTestLogger({
      logFake: logFake
    });

    TestLogger.logWarning({
      data: TEST_FIXTURES.LOG_DATA_STRING,
      sourceID: TEST_FIXTURES.SOURCE_ID,
      verbose: TEST_FIXTURES.VERBOSE
    });

    test.is(logFake.callCount, 1);
    test.true( logFake.calledWithMatch(expectedLogItem) );
  }
);