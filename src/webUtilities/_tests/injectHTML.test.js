import ava from 'ava';
import browserEnv from 'browser-env';

import * as errors from '../../errors/index.js';
import * as logging from '../../logging/index.js';
import * as injectHTML from '../injectHTML.js';


// use “browser-env” to populate the following in the global scope …
// - `document.createElement()`
// - `document.querySelector()`
// - `Element`
browserEnv();

const TEST_FIXTURES = Object.freeze({
  DEBUG: true,
  HTML: '<span><script></script><script>"</script></span>',
  LOGGER: logging.NullLogger,
  REPLACE: true,
  SOURCE_ID: 'source_id',
  TARGET_ELEMENT: document.createElement('div'),
  TARGET_HTML_ID: '#element',
  TARGET_HTML_ID_INVALID: '!',
  TARGET_HTML_ID_NONEXISTENT: '#nonexistent-element'
});

ava.before(
  'core.webUtilities.injectHTML – test environment setup',
  (t) => {
    // create the target element and add it to the DOM
    const targetElement = document.createElement('span');
    targetElement.id = TEST_FIXTURES.TARGET_HTML_ID.slice(1);
    document.body.appendChild(targetElement);
  }
);

ava(
  'core.webUtilities.injectHTML – static data',
  (t) => {
    t.is(typeof injectHTML.DEFAULTS, 'object');
    t.is(injectHTML.DEFAULTS.DEBUG, false);
    t.is(injectHTML.DEFAULTS.LOGGER, logging.ConsoleLogger);
    t.is(injectHTML.DEFAULTS.REPLACE, false);
    t.is(injectHTML.DEFAULTS.SOURCE_ID, null);
    t.is(typeof injectHTML.PROCESS_ID, 'string');
    t.is(typeof injectHTML.injectHTML, 'function');
    t.is(injectHTML.default, injectHTML.injectHTML);
  }
);

ava(
  'core.webUtilities.injectHTML – target: HTML ID (string)',
  (t) => {
    injectHTML.default({
      debug: TEST_FIXTURES.DEBUG,
      html: TEST_FIXTURES.HTML,
      logger: TEST_FIXTURES.LOGGER,
      replace: TEST_FIXTURES.REPLACE,
      sourceID: TEST_FIXTURES.SOURCE_ID,
      target: TEST_FIXTURES.TARGET_HTML_ID
    });

    const targetElement = document.querySelector(TEST_FIXTURES.TARGET_HTML_ID);

    t.is(typeof targetElement, 'object');
    t.true(targetElement instanceof Element);
    t.is(targetElement.innerHTML, TEST_FIXTURES.HTML);
  }
);

ava(
  'core.webUtilities.injectHTML – target: Element',
  (t) => {
    injectHTML.default({
      debug: false,
      html: TEST_FIXTURES.HTML,
      logger: TEST_FIXTURES.LOGGER,
      replace: false,
      sourceID: null,
      target: TEST_FIXTURES.TARGET_ELEMENT
    });

    t.is(TEST_FIXTURES.TARGET_ELEMENT.innerHTML, TEST_FIXTURES.HTML);
  }
);

ava(
  'core.webUtilities.injectHTML – invalid parameters',
  (t) => {
    const expectedError1 = new errors.InvalidParameterValueError({
      parameterName: 'target',
      reason: `“${TEST_FIXTURES.TARGET_HTML_ID_INVALID}” is not an HTML ID`
    });

    const error1 = t.throws(
      () => injectHTML.default({
        html: TEST_FIXTURES.HTML,
        target: TEST_FIXTURES.TARGET_HTML_ID_INVALID
      })
    );

    t.is(typeof error1, 'object');
    t.deepEqual(error1, expectedError1);

    const expectedError2 = new Error(`“${TEST_FIXTURES.TARGET_HTML_ID_NONEXISTENT}” does not exist.`);

    const error2 = t.throws(
      () => injectHTML.default({
        debug: null,
        html: TEST_FIXTURES.HTML,
        logger: null,
        replace: null,
        sourceID: TEST_FIXTURES.SOURCE_ID,
        target: TEST_FIXTURES.TARGET_HTML_ID_NONEXISTENT
      })
    );

    t.is(typeof error2, 'object');
    t.deepEqual(error2, expectedError2);

    const expectedError3 = new errors.TypeValidationError('target', [ String, Element ]);

    const error3 = t.throws(
      () => injectHTML.default({
        debug: TEST_FIXTURES.DEBUG,
        html: TEST_FIXTURES.HTML,
        logger: TEST_FIXTURES.LOGGER,
        replace: TEST_FIXTURES.REPLACE,
        sourceID: TEST_FIXTURES.SOURCE_ID,
        target: null
      })
    );

    t.is(typeof error3, 'object');
    t.deepEqual(error3, expectedError3);

    const expectedError4 = new errors.TypeValidationError('html', String);

    const error4 = t.throws(
      () => injectHTML.default({
        debug: TEST_FIXTURES.DEBUG,
        html: null,
        logger: TEST_FIXTURES.LOGGER,
        replace: TEST_FIXTURES.REPLACE,
        sourceID: TEST_FIXTURES.SOURCE_ID,
        target: TEST_FIXTURES.TARGET_HTML_ID
      })
    );

    t.is(typeof error4, 'object');
    t.deepEqual(error4, expectedError4);
  }
);