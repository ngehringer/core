import ava from 'ava';
import * as nodeFetch from 'node-fetch';

import REFERENCE from '../../../REFERENCE/index.js';
import * as errors from '../../../errors/index.js';
import * as logging from '../../../logging/index.js';
import * as extractResponseBody from '../extractResponseBody.js';


const TEST_FIXTURES = Object.freeze({
  DEBUG: true,
  LOGGER: logging.NullLogger,
  RESPONSES: Object.freeze({
    ARRAY_BUFFER: Object.freeze({
      EXPECTED_RESPONSE: {
        arrayBuffer: new ArrayBuffer(),
        json: null,
        text: null
      },
      RESPONSE: new nodeFetch.Response()
    }),
    JSON: Object.freeze({
      EXPECTED_RESPONSE: {
        arrayBuffer: null,
        json: {
          '1': 1,
          '2': 2,
          '3': 'three'
        },
        text: null
      },
      RESPONSE: new nodeFetch.Response(
        '{"1":1,"2":2,"3":"three"}',
        {
          headers: {
            [REFERENCE.ENUMERATIONS.HTTP_HEADER.CONTENT_TYPE]: REFERENCE.ENUMERATIONS.MEDIA_TYPE.JSON
          }
        }
      )
    }),
    TEXT_1: Object.freeze({
      EXPECTED_RESPONSE: {
        arrayBuffer: null,
        json: null,
        text: 'Response'
      },
      RESPONSE: new nodeFetch.Response('Response')
    }),
    TEXT_2: Object.freeze({
      EXPECTED_RESPONSE: {
        arrayBuffer: null,
        json: null,
        text: 'Response'
      },
      RESPONSE: new nodeFetch.Response('Response')
    })
  })
});

ava.before(
  'core.webUtilities.ajax.delete – test environment setup',
  () => {
    // use “node-fetch” to populate the following in the global scope …
    // - `Response`
    global.Response = nodeFetch.Response;
  }
);

ava(
  'core.webUtilities.ajax.extractResponseBody – static data',
  (t) => {
    t.is(typeof extractResponseBody.DEFAULTS, 'object');
    t.is(extractResponseBody.DEFAULTS.DEBUG, false);
    t.is(extractResponseBody.DEFAULTS.LOGGER, logging.ConsoleLogger);
    t.is(typeof extractResponseBody.MODULE_ID, 'string');
    t.is(typeof extractResponseBody.REFERENCE, 'object');
    t.true( Array.isArray(extractResponseBody.REFERENCE.CONTENT_TYPES.ARRAY_BUFFER) );
    t.true( Array.isArray(extractResponseBody.REFERENCE.CONTENT_TYPES.JSON) );
    t.true( Array.isArray(extractResponseBody.REFERENCE.CONTENT_TYPES.TEXT) );
    t.is(typeof extractResponseBody.extractResponseBody, 'function');
    t.is(extractResponseBody.default, extractResponseBody.extractResponseBody);
  }
);

ava(
  'core.webUtilities.ajax.extractResponseBody – text',
  async (t) => {
    const responseBody1 = await extractResponseBody.default({
      debug: TEST_FIXTURES.DEBUG,
      logger: TEST_FIXTURES.LOGGER,
      response: TEST_FIXTURES.RESPONSES.TEXT_1.RESPONSE
    });

    t.is(typeof responseBody1, 'object');
    t.is(responseBody1.arrayBuffer, null);
    t.is(responseBody1.json, null);
    t.is(typeof responseBody1.text, 'string');
    t.deepEqual(responseBody1, TEST_FIXTURES.RESPONSES.TEXT_1.EXPECTED_RESPONSE);

    const responseBody2 = await extractResponseBody.default({
      response: TEST_FIXTURES.RESPONSES.TEXT_2.RESPONSE
    });

    t.is(typeof responseBody2, 'object');
    t.is(responseBody2.arrayBuffer, null);
    t.is(responseBody2.json, null);
    t.is(typeof responseBody2.text, 'string');
    t.deepEqual(responseBody2, TEST_FIXTURES.RESPONSES.TEXT_2.EXPECTED_RESPONSE);
  }
);

ava(
  'core.webUtilities.ajax.extractResponseBody – JSON',
  async (t) => {
    const responseBody = await extractResponseBody.default({
      debug: TEST_FIXTURES.DEBUG,
      logger: TEST_FIXTURES.LOGGER,
      response: TEST_FIXTURES.RESPONSES.JSON.RESPONSE
    });

    t.is(typeof responseBody, 'object');
    t.is(typeof responseBody.json, 'object');
    t.is(responseBody.arrayBuffer, null);
    t.is(responseBody.text, null);
    t.deepEqual(responseBody, TEST_FIXTURES.RESPONSES.JSON.EXPECTED_RESPONSE);
  }
);

ava(
  'core.webUtilities.ajax.extractResponseBody – binary',
  async (t) => {
    const responseBody = await extractResponseBody.default({
      debug: TEST_FIXTURES.DEBUG,
      logger: TEST_FIXTURES.LOGGER,
      response: TEST_FIXTURES.RESPONSES.ARRAY_BUFFER.RESPONSE
    });

    t.is(typeof responseBody, 'object');
    t.is(typeof responseBody.arrayBuffer, 'object');
    t.true(responseBody.arrayBuffer instanceof ArrayBuffer);
    t.is(responseBody.json, null);
    t.is(responseBody.text, null);
    t.deepEqual(responseBody, TEST_FIXTURES.RESPONSES.ARRAY_BUFFER.EXPECTED_RESPONSE);
  }
);

ava(
  'core.webUtilities.ajax.extractResponseBody – invalid parameters',
  async (t) => {
    const expectedError1 = new errors.TypeValidationError('response', nodeFetch.Response);

    const error1 = await t.throwsAsync(
      () => extractResponseBody.default({
        debug: null,
        logger: null,
        response: null
      })
    );

    t.is(typeof error1, 'object');
    t.deepEqual(error1, expectedError1);
  }
);