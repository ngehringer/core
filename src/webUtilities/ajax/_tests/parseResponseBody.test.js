import ava from 'ava';
import * as nodeFetch from 'node-fetch';

import REFERENCE from '../../../REFERENCE/index.js';
import * as errors from '../../../errors/index.js';
import * as logging from '../../../logging/index.js';
import * as parseResponse from '../parseResponseBody.js';


const TEST_FIXTURES = Object.freeze({
  DEBUG: true,
  LOGGER: logging.NullLogger,
  RESPONSES: Object.freeze({
    JSON: Object.freeze({
      EXPECTED_RESPONSE: {
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
        json: null,
        text: 'Response'
      },
      RESPONSE: new nodeFetch.Response('Response')
    }),
    TEXT_2: Object.freeze({
      EXPECTED_RESPONSE: {
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
  'core.webUtilities.ajax.parseResponseBody – static data',
  (t) => {
    t.is(typeof parseResponse.DEFAULTS, 'object');
    t.is(parseResponse.DEFAULTS.DEBUG, false);
    t.is(parseResponse.DEFAULTS.LOGGER, logging.ConsoleLogger);
    t.is(typeof parseResponse.PROCESS_ID, 'string');
    t.is(typeof parseResponse.REFERENCE, 'object');
    t.true( Array.isArray(parseResponse.REFERENCE.JSON_CONTENT_TYPES) );
    t.true( Array.isArray(parseResponse.REFERENCE.TEXT_CONTENT_TYPES) );
    t.is(typeof parseResponse.parseResponse, 'function');
    t.is(parseResponse.default, parseResponse.parseResponse);
  }
);

ava(
  'core.webUtilities.ajax.parseResponseBody – text',
  async (t) => {
    const parsedResponse1 = await parseResponse.default({
      debug: TEST_FIXTURES.DEBUG,
      logger: TEST_FIXTURES.LOGGER,
      response: TEST_FIXTURES.RESPONSES.TEXT_1.RESPONSE
    });

    t.is(typeof parsedResponse1, 'object');
    t.is(parsedResponse1.json, null);
    t.is(typeof parsedResponse1.text, 'string');
    t.deepEqual(parsedResponse1, TEST_FIXTURES.RESPONSES.TEXT_1.EXPECTED_RESPONSE);

    const parsedResponse2 = await parseResponse.default({
      response: TEST_FIXTURES.RESPONSES.TEXT_2.RESPONSE
    });

    t.is(typeof parsedResponse2, 'object');
    t.is(parsedResponse2.json, null);
    t.is(typeof parsedResponse2.text, 'string');
    t.deepEqual(parsedResponse2, TEST_FIXTURES.RESPONSES.TEXT_2.EXPECTED_RESPONSE);
  }
);

ava(
  'core.webUtilities.ajax.parseResponseBody – JSON',
  async (t) => {
    const parsedResponse = await parseResponse.default({
      debug: TEST_FIXTURES.DEBUG,
      logger: TEST_FIXTURES.LOGGER,
      response: TEST_FIXTURES.RESPONSES.JSON.RESPONSE
    });

    t.is(typeof parsedResponse, 'object');
    t.is(typeof parsedResponse.json, 'object');
    t.is(parsedResponse.text, null);
    t.deepEqual(parsedResponse, TEST_FIXTURES.RESPONSES.JSON.EXPECTED_RESPONSE);
  }
);

ava(
  'core.webUtilities.ajax.parseResponseBody – invalid parameters',
  async (t) => {
    const expectedError1 = new errors.TypeValidationError('response', nodeFetch.Response);

    const error1 = await t.throwsAsync(
      () => parseResponse.default({
        debug: null,
        logger: null,
        response: null
      })
    );

    t.is(typeof error1, 'object');
    t.deepEqual(error1, expectedError1);
  }
);