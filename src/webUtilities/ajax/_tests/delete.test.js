import ava from 'ava';
import fetchMock from 'fetch-mock';
import * as nodeFetch from 'node-fetch';

import * as logging from '../../../logging/index.js';
import REFERENCE from '../../../REFERENCE/index.js';
import delete_ from '../delete.js';


const TEST_FIXTURES = Object.freeze({
  PARAMETERS: Object.freeze({
    debug: true,
    httpHeaders: [],
    location: 'http://localhost/resource',
    logger: logging.NullLogger,
    parameters: null
  })
});

ava.before(
  'core.webUtilities.ajax.delete – test environment setup',
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
    // - <http://localhost/resource>
    fetchMock.mock(TEST_FIXTURES.PARAMETERS.location, REFERENCE.ENUMERATIONS.HTTP_STATUS_CODE['200_OK']);
  }
);

ava(
  'core.webUtilities.ajax.delete',
  async (t) => {
    const response = await delete_({
      debug: TEST_FIXTURES.PARAMETERS.debug,
      httpHeaders: TEST_FIXTURES.PARAMETERS.httpHeaders,
      location: TEST_FIXTURES.PARAMETERS.location,
      logger: TEST_FIXTURES.PARAMETERS.logger,
      parameters: TEST_FIXTURES.PARAMETERS.parameters
    });

    t.is(typeof response, 'object');
    t.true(response.request instanceof nodeFetch.Request);
    t.true(response.response instanceof nodeFetch.Response);
    t.is(typeof response.responseBody, 'object');
    t.not(response.responseBody, null);
    t.true( (typeof response.responseBody.json === 'object') || (response.responseBody.json === null) );
    t.true( (typeof response.responseBody.text === 'string') || (response.responseBody.text === null) );
    t.is(typeof response.statusCode, 'number');
    t.is(typeof response.statusReasonPhrase, 'string');
  }
);