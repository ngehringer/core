import ava from 'ava';
import fetchMock from 'fetch-mock';
import * as nodeFetch from 'node-fetch';

import * as logging from '../../../logging/index.js';
import REFERENCE from '../../../REFERENCE/index.js';
import head from '../head.js';


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
  'core.webUtilities.ajax.head – test environment setup',
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
  'core.webUtilities.ajax.head',
  async (t) => {
    const response = await head({
      debug: TEST_FIXTURES.PARAMETERS.debug,
      httpHeaders: TEST_FIXTURES.PARAMETERS.httpHeaders,
      location: TEST_FIXTURES.PARAMETERS.location,
      logger: TEST_FIXTURES.PARAMETERS.logger,
      parameters: TEST_FIXTURES.PARAMETERS.parameters
    });

    t.is(typeof response, 'object');
    t.true(response.request instanceof nodeFetch.Request);
    t.true(response.response instanceof nodeFetch.Response);
    t.is(response.responseBody, null);
    t.is(typeof response.statusCode, 'number');
    t.is(typeof response.statusReasonPhrase, 'string');
  }
);