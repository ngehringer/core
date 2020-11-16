import ava from 'ava';
import sinon from 'sinon';

import REFERENCE from '../REFERENCE.js';
import BaseLogger from '../BaseLogger.js';


const TEST_FIXTURES = Object.freeze({
  LOG_DATA: {},
  SOURCE_ID: `${BaseLogger.CLASS_NAME}::test`,
  VERBOSE: true
});

const getTestLogger = ({
  logFake
}) => class extends BaseLogger {
  static log(...rest) {
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
  'core.logging.BaseLogger.logCriticalError',
  (test) => {
    const logFake = sinon.fake();

    const TestLogger = getTestLogger({
      logFake: logFake
    });

    const rest = {
      data: TEST_FIXTURES.LOG_DATA,
      sourceID: TEST_FIXTURES.SOURCE_ID,
      verbose: TEST_FIXTURES.VERBOSE
    };

    TestLogger.logCriticalError(rest);

    test.is(logFake.callCount, 1);
    test.true(
      logFake.calledWithExactly({
        logLevel: REFERENCE.ENUMERATIONS.LOG_LEVEL.CRITICAL_ERROR,
        ...rest
      })
    );
  }
);

ava(
  'core.logging.BaseLogger.logDebug',
  (test) => {
    const logFake = sinon.fake();

    const TestLogger = getTestLogger({
      logFake: logFake
    });

    const rest = {
      data: TEST_FIXTURES.LOG_DATA,
      sourceID: TEST_FIXTURES.SOURCE_ID,
      verbose: TEST_FIXTURES.VERBOSE
    };

    TestLogger.logDebug(rest);

    test.is(logFake.callCount, 1);
    test.true(
      logFake.calledWithExactly({
        logLevel: REFERENCE.ENUMERATIONS.LOG_LEVEL.DEBUG,
        ...rest
      })
    );
  }
);

ava(
  'core.logging.BaseLogger.logError',
  (test) => {
    const logFake = sinon.fake();

    const TestLogger = getTestLogger({
      logFake: logFake
    });

    const rest = {
      data: TEST_FIXTURES.LOG_DATA,
      sourceID: TEST_FIXTURES.SOURCE_ID,
      verbose: TEST_FIXTURES.VERBOSE
    };

    TestLogger.logError(rest);

    test.is(logFake.callCount, 1);
    test.true(
      logFake.calledWithExactly({
        logLevel: REFERENCE.ENUMERATIONS.LOG_LEVEL.ERROR,
        ...rest
      })
    );
  }
);

ava(
  'core.logging.BaseLogger.logInfo',
  (test) => {
    const logFake = sinon.fake();

    const TestLogger = getTestLogger({
      logFake: logFake
    });

    const rest = {
      data: TEST_FIXTURES.LOG_DATA,
      sourceID: TEST_FIXTURES.SOURCE_ID,
      verbose: TEST_FIXTURES.VERBOSE
    };

    TestLogger.logInfo(rest);

    test.is(logFake.callCount, 1);
    test.true(
      logFake.calledWithExactly({
        logLevel: REFERENCE.ENUMERATIONS.LOG_LEVEL.INFO,
        ...rest
      })
    );
  }
);

ava(
  'core.logging.BaseLogger.logWarning',
  (test) => {
    const logFake = sinon.fake();

    const TestLogger = getTestLogger({
      logFake: logFake
    });

    const rest = {
      data: TEST_FIXTURES.LOG_DATA,
      sourceID: TEST_FIXTURES.SOURCE_ID,
      verbose: TEST_FIXTURES.VERBOSE
    };

    TestLogger.logWarning(rest);

    test.is(logFake.callCount, 1);
    test.true(
      logFake.calledWithExactly({
        logLevel: REFERENCE.ENUMERATIONS.LOG_LEVEL.WARNING,
        ...rest
      })
    );
  }
);