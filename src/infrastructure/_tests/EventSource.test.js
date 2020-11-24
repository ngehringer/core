import ava from 'ava';
import sinon from 'sinon';

import * as errors from '../../errors/index.js';
import * as logging from '../../logging/index.js';
import REFERENCE from '../../REFERENCE/index.js';
import EventSource from '../EventSource.js';


const TEST_FIXTURES = Object.freeze({
  DEBUG: true,
  EVENT_HANDLER: () => {},
  EVENT_PARAMETERS: {},
  EVENT_TYPE: 'test_event',
  LOGGER: logging.NullLogger
});

ava(
  'core.infrastructure.EventSource – static data',
  (test) => {
    test.is(typeof EventSource.CLASS_NAME, 'string');
    test.is(typeof EventSource.DEFAULTS, 'object');
    test.is(EventSource.DEFAULTS.DEBUG, false);
    test.is(EventSource.DEFAULTS.LOGGER, logging.ConsoleLogger);
  }
);

ava(
  'core.infrastructure.EventSource',
  async (test) => {
    const eventSource = new EventSource({
      debug: TEST_FIXTURES.DEBUG,
      logger: TEST_FIXTURES.LOGGER
    });

    test.is(typeof eventSource.registerEventHandler, 'function');
    test.is(typeof eventSource.sendEvent, 'function');
    test.is(typeof eventSource.unregisterEventHandler, 'function');
    test.is(eventSource.debug, TEST_FIXTURES.DEBUG);
    test.deepEqual(eventSource.eventHandlerRegister, {});
    test.true( REFERENCE.UUID_REGEXP.test(eventSource.id) );
    test.is(eventSource.logger, TEST_FIXTURES.LOGGER);

    // async sendEvent(eventType: string, ...rest)

    await eventSource.sendEvent(TEST_FIXTURES.EVENT_TYPE);

    // registerEventHandler(eventType: string, eventHandler: function)

    const eventHandler = sinon.fake();

    eventSource.registerEventHandler(TEST_FIXTURES.EVENT_TYPE, eventHandler);

    test.deepEqual(
      eventSource.eventHandlerRegister,
      {
        [TEST_FIXTURES.EVENT_TYPE]: [ eventHandler ]
      }
    );

    // async sendEvent(eventType: string, ...rest)

    await eventSource.sendEvent(TEST_FIXTURES.EVENT_TYPE, TEST_FIXTURES.EVENT_PARAMETERS);

    test.is(eventHandler.callCount, 1);
    const eventHandlerCall1 = eventHandler.getCall(0);
    test.true( eventHandlerCall1.calledWithExactly(TEST_FIXTURES.EVENT_PARAMETERS) );

    await eventSource.sendEvent(TEST_FIXTURES.EVENT_TYPE);

    test.is(eventHandler.callCount, 2);
    const eventHandlerCall2 = eventHandler.getCall(1);
    test.true( eventHandlerCall2.calledWithExactly() );

    // unregisterEventHandler(eventType: string, eventHandler: function)

    eventSource.unregisterEventHandler(TEST_FIXTURES.EVENT_TYPE, eventHandler);

    test.deepEqual(
      eventSource.eventHandlerRegister,
      {
        [TEST_FIXTURES.EVENT_TYPE]: []
      }
    );
  }
);

ava(
  'core.infrastructure.EventSource – unspecified parameters',
  (test) => {
    const eventSource = new EventSource();

    test.is(typeof eventSource.registerEventHandler, 'function');
    test.is(typeof eventSource.sendEvent, 'function');
    test.is(typeof eventSource.unregisterEventHandler, 'function');
    test.is(eventSource.debug, EventSource.DEFAULTS.DEBUG);
    test.deepEqual(eventSource.eventHandlerRegister, {});
    test.true( REFERENCE.UUID_REGEXP.test(eventSource.id) );
    test.is(eventSource.logger, EventSource.DEFAULTS.LOGGER);
  }
);

ava(
  'core.infrastructure.EventSource.registerEventHandler – errors',
  (test) => {
    const eventSource = new EventSource({
      debug: TEST_FIXTURES.DEBUG,
      logger: TEST_FIXTURES.LOGGER
    });

    const expectedError1 = new errors.TypeValidationError('eventType', String);

    const error1 = test.throws(
      () => eventSource.registerEventHandler(null, TEST_FIXTURES.EVENT_HANDLER)
    );
    test.is(typeof error1, 'object');
    test.deepEqual(error1, expectedError1);

    const expectedError2 = new errors.TypeValidationError('eventHandler', Function);

    const error2 = test.throws(
      () => eventSource.registerEventHandler(TEST_FIXTURES.EVENT_TYPE, null)
    );
    test.is(typeof error2, 'object');
    test.deepEqual(error2, expectedError2);

    const expectedError3 = new Error(`The specified handler is already registered for “${TEST_FIXTURES.EVENT_TYPE}” events.`);

    const error3 = test.throws(
      () => {
        eventSource.registerEventHandler(TEST_FIXTURES.EVENT_TYPE, TEST_FIXTURES.EVENT_HANDLER);
        eventSource.registerEventHandler(TEST_FIXTURES.EVENT_TYPE, TEST_FIXTURES.EVENT_HANDLER);
      }
    );
    test.is(typeof error3, 'object');
    test.deepEqual(error3, expectedError3);
  }
);

ava(
  'core.infrastructure.EventSource.sendEvent – errors',
  async (test) => {
    const eventSource = new EventSource({
      debug: null,
      logger: null
    });

    const eventSourceLoggerLogErrorFake = sinon.fake();
    sinon.replace(eventSource.logger, 'logError', eventSourceLoggerLogErrorFake);

    const expectedError1 = new errors.TypeValidationError('eventType', String);

    const error1 = await test.throwsAsync(
      () => eventSource.sendEvent(null)
    );
    test.is(typeof error1, 'object');
    test.deepEqual(error1, expectedError1);

    const expectedError2 = new Error(`${EventSource.prototype.sendEvent.name}`);

    const eventHandler = sinon.fake.throws(expectedError2);
    eventSource.registerEventHandler(TEST_FIXTURES.EVENT_TYPE, eventHandler);

    await eventSource.sendEvent(TEST_FIXTURES.EVENT_TYPE);

    test.is(eventHandler.callCount, 1);
    test.true( eventHandler.calledWithExactly() );
    test.is(eventSourceLoggerLogErrorFake.callCount, 1);
    test.true(
      eventSourceLoggerLogErrorFake.calledWithExactly({
        data: expectedError2,
        sourceID: eventSource._processID,
        verbose: eventSource.debug
      })
    );

    sinon.restore();
  }
);

ava(
  'core.infrastructure.EventSource.unregisterEventHandler – errors',
  (test) => {
    const eventSource = new EventSource({
      debug: TEST_FIXTURES.DEBUG,
      logger: TEST_FIXTURES.LOGGER
    });

    const expectedError1 = new errors.TypeValidationError('eventType', String);

    const error1 = test.throws(
      () => eventSource.unregisterEventHandler(null, TEST_FIXTURES.EVENT_HANDLER)
    );
    test.is(typeof error1, 'object');
    test.deepEqual(error1, expectedError1);

    const expectedError2 = new errors.TypeValidationError('eventHandler', Function);

    const error2 = test.throws(
      () => eventSource.unregisterEventHandler(TEST_FIXTURES.EVENT_TYPE, null)
    );
    test.is(typeof error2, 'object');
    test.deepEqual(error2, expectedError2);

    const expectedError3 = new Error(`The specified handler is not registered for “${TEST_FIXTURES.EVENT_TYPE}” events.`);

    const error3 = test.throws(
      () => {
        eventSource.unregisterEventHandler(TEST_FIXTURES.EVENT_TYPE, TEST_FIXTURES.EVENT_HANDLER);
      }
    );
    test.is(typeof error3, 'object');
    test.deepEqual(error3, expectedError3);
  }
);