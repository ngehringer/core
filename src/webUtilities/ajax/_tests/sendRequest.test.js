import ava from 'ava';
import fetchMock from 'fetch-mock';
import * as nodeFetch from 'node-fetch';

import * as errors from '../../../errors/index.js';
import * as logging from '../../../logging/index.js';
import REFERENCE from '../../../REFERENCE/index.js';
import * as sendRequest from '../sendRequest.js';


const TEST_FIXTURES = Object.freeze({
  DEBUG: true,
  LOGGER: logging.NullLogger,
  REQUEST_1: Object.freeze({
    EXPECTED_RESPONSE: {
      request: new nodeFetch.Request(
        'http://localhost/resource1',
        {
          method: REFERENCE.ENUMERATIONS.HTTP_METHOD.GET
        }
      ),
      response: new nodeFetch.Response(
        '',
        {
          status: REFERENCE.ENUMERATIONS.HTTP_STATUS_CODE['200_OK'],
          statusText: 'OK',
          url: 'http://localhost/resource1'
        }
      ),
      responseBody: {
        json: null,
        text: ''
      },
      statusCode: REFERENCE.ENUMERATIONS.HTTP_STATUS_CODE['200_OK'],
      statusReasonPhrase: 'OK'
    },
    PARAMETERS: Object.freeze({
      httpHeaders: [],
      httpMethod: REFERENCE.ENUMERATIONS.HTTP_METHOD.GET,
      location: 'http://localhost/resource1',
      parameters: null
    })
  }),
  REQUEST_2: Object.freeze({
    EXPECTED_RESPONSE: {
      request: new nodeFetch.Request(
        'http://localhost/resource2',
        {
          body: JSON.stringify({
            request_parameter: 'request_value'
          }),
          headers: [
            [ REFERENCE.ENUMERATIONS.HTTP_HEADER.CONTENT_TYPE, REFERENCE.ENUMERATIONS.MEDIA_TYPE.JSON ]
          ],
          method: REFERENCE.ENUMERATIONS.HTTP_METHOD.POST
        }
      ),
      response: new nodeFetch.Response(
        JSON.stringify({
          response_parameter: 'response_value'
        }),
        {
          headers: [
            [ REFERENCE.ENUMERATIONS.HTTP_HEADER.CONTENT_TYPE, REFERENCE.ENUMERATIONS.MEDIA_TYPE.JSON ]
          ],
          status: REFERENCE.ENUMERATIONS.HTTP_STATUS_CODE['200_OK'],
          statusText: 'OK',
          url: 'http://localhost/resource2'
        }
      ),
      responseBody: {
        json: {
          response_parameter: 'response_value'
        },
        text: null
      },
      statusCode: REFERENCE.ENUMERATIONS.HTTP_STATUS_CODE['200_OK'],
      statusReasonPhrase: 'OK'
    },
    PARAMETERS: Object.freeze({
      httpHeaders: [],
      httpMethod: REFERENCE.ENUMERATIONS.HTTP_METHOD.POST,
      location: 'http://localhost/resource2',
      parameters: {
        request_parameter: 'request_value'
      }
    })
  }),
  REQUEST_3: Object.freeze({
    EXPECTED_RESPONSE: {
      request: new nodeFetch.Request(
        'http://localhost/resource3',
        {
          method: REFERENCE.ENUMERATIONS.HTTP_METHOD.HEAD
        }
      ),
      response: new nodeFetch.Response(
        '',
        {
          status: REFERENCE.ENUMERATIONS.HTTP_STATUS_CODE['404_NOT_FOUND'],
          statusText: 'Not Found',
          url: 'http://localhost/resource3'
        }
      ),
      responseBody: null,
      statusCode: REFERENCE.ENUMERATIONS.HTTP_STATUS_CODE['404_NOT_FOUND'],
      statusReasonPhrase: 'Not Found'
    },
    PARAMETERS: Object.freeze({
      httpHeaders: [],
      httpMethod: REFERENCE.ENUMERATIONS.HTTP_METHOD.HEAD,
      location: 'http://localhost/resource3',
      parameters: {}
    })
  })
});

ava.before(
  'core.webUtilities.ajax.sendRequest – test environment setup',
  () => {
    // use “node-fetch” to populate the following in the global scope …
    // - `Headers`
    // - `Request`
    // - `Response`
    // - `fetch()`
    global.Headers = nodeFetch.Headers;
    global.Request = nodeFetch.Request;
    global.Response = nodeFetch.Response;
    global.fetch = nodeFetch.default;

    // use “fetch-mock” to mock requests to …
    // - <http://localhost/resource1>
    fetchMock.mock(TEST_FIXTURES.REQUEST_1.PARAMETERS.location, TEST_FIXTURES.REQUEST_1.EXPECTED_RESPONSE.response);
    // - <http://localhost/resource2>
    fetchMock.mock(TEST_FIXTURES.REQUEST_2.PARAMETERS.location, TEST_FIXTURES.REQUEST_2.EXPECTED_RESPONSE.response);
    // - <http://localhost/resource3>
    fetchMock.mock(TEST_FIXTURES.REQUEST_3.PARAMETERS.location, TEST_FIXTURES.REQUEST_3.EXPECTED_RESPONSE.response);
  }
);

ava(
  'core.webUtilities.ajax.sendRequest – static data',
  (t) => {
    t.is(typeof sendRequest.DEFAULTS, 'object');
    t.is(sendRequest.DEFAULTS.DEBUG, false);
    t.deepEqual(sendRequest.DEFAULTS.HTTP_HEADERS, []);
    t.is(sendRequest.DEFAULTS.LOGGER, logging.ConsoleLogger);
    t.is(sendRequest.DEFAULTS.PARAMETERS, null);
    t.is(typeof sendRequest.MODULE_ID, 'string');
    t.is(typeof sendRequest.sendRequest, 'function');
    t.is(sendRequest.default, sendRequest.sendRequest);
  }
);

ava(
  'core.webUtilities.ajax.sendRequest – GET',
  async (t) => {
    const response = await sendRequest.default({
      debug: TEST_FIXTURES.DEBUG,
      httpHeaders: TEST_FIXTURES.REQUEST_1.PARAMETERS.httpHeaders,
      httpMethod: TEST_FIXTURES.REQUEST_1.PARAMETERS.httpMethod,
      location: TEST_FIXTURES.REQUEST_1.PARAMETERS.location,
      logger: TEST_FIXTURES.LOGGER,
      parameters: TEST_FIXTURES.REQUEST_1.PARAMETERS.parameters
    });

    t.is(typeof response, 'object');
    t.true(response.request instanceof nodeFetch.Request);
    t.true(response.response instanceof nodeFetch.Response);
    t.is(typeof response.responseBody, 'object');
    t.not(response.responseBody, null);
    t.is(response.responseBody.json, null);
    t.is(typeof response.responseBody.text, 'string');
    t.is(typeof response.statusCode, 'number');
    t.is(typeof response.statusReasonPhrase, 'string');
    t.deepEqual(response, TEST_FIXTURES.REQUEST_1.EXPECTED_RESPONSE);
  }
);

ava(
  'core.webUtilities.ajax.sendRequest – POST',
  async (t) => {
    const response = await sendRequest.default({
      debug: TEST_FIXTURES.DEBUG,
      httpHeaders: TEST_FIXTURES.REQUEST_2.PARAMETERS.httpHeaders,
      httpMethod: TEST_FIXTURES.REQUEST_2.PARAMETERS.httpMethod,
      location: TEST_FIXTURES.REQUEST_2.PARAMETERS.location,
      logger: TEST_FIXTURES.LOGGER,
      parameters: TEST_FIXTURES.REQUEST_2.PARAMETERS.parameters
    });

    t.is(typeof response, 'object');
    t.true(response.request instanceof nodeFetch.Request);
    t.true(response.response instanceof nodeFetch.Response);
    t.is(typeof response.responseBody, 'object');
    t.not(response.responseBody, null);
    t.is(typeof response.responseBody.json, 'object');
    t.is(response.responseBody.text, null);
    t.is(typeof response.statusCode, 'number');
    t.is(typeof response.statusReasonPhrase, 'string');
    t.deepEqual(response, TEST_FIXTURES.REQUEST_2.EXPECTED_RESPONSE);
  }
);

ava(
  'core.webUtilities.ajax.sendRequest – unsuccessful request (non–200 HTTP status code)',
  async (t) => {
    const expectedError = new errors.HTTPResponseError({
      method: TEST_FIXTURES.REQUEST_3.PARAMETERS.httpMethod,
      response: TEST_FIXTURES.REQUEST_3.EXPECTED_RESPONSE.response,
      statusCode: TEST_FIXTURES.REQUEST_3.EXPECTED_RESPONSE.response.status,
      statusReasonPhrase: TEST_FIXTURES.REQUEST_3.EXPECTED_RESPONSE.response.statusText,
      url: TEST_FIXTURES.REQUEST_3.PARAMETERS.location
    });

    const error = await t.throwsAsync(
      () => sendRequest.default({
        debug: null,
        httpHeaders: TEST_FIXTURES.REQUEST_3.PARAMETERS.httpHeaders,
        httpMethod: TEST_FIXTURES.REQUEST_3.PARAMETERS.httpMethod,
        location: TEST_FIXTURES.REQUEST_3.PARAMETERS.location,
        logger: null,
        parameters: TEST_FIXTURES.REQUEST_3.PARAMETERS.parameters
      })
    );

    t.is(typeof error, 'object');
    t.deepEqual(error, expectedError);
  }
);

ava(
  'core.webUtilities.ajax.sendRequest – errors',
  async (t) => {
    const expectedError1 = new errors.InvalidParameterValueError({
      parameterName: 'httpMethod',
      reason: `must be { ${
        Object.values(REFERENCE.ENUMERATIONS.HTTP_METHOD)
          .map( (__httpMethod) => `“${__httpMethod}”` )
          .join(' | ')
      } }`
    });

    const error1 = await t.throwsAsync(
      () => sendRequest.default({
        httpMethod: null,
        location: TEST_FIXTURES.REQUEST_1.PARAMETERS.location
      })
    );

    t.is(typeof error1, 'object');
    t.deepEqual(error1, expectedError1);
  }
);