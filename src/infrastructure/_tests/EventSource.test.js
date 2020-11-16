import ava from 'ava';
import sinon from 'sinon';

import * as logging from '../../logging/index.js';
import REFERENCE from '../../REFERENCE/index.js';
import EventSource from '../EventSource.js';


const TEST_FIXTURES = Object.freeze({
  DEBUG: true,
  EVENT_PARAMETERS: {},
  EVENT_TYPE: 'test_event',
  LOGGER: logging.ConsoleLogger
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