import ava from 'ava';
import * as nodeFetch from 'node-fetch';

import * as errors from '../../../errors/index.js';
import * as logging from '../../../logging/index.js';
import REFERENCE from '../../../REFERENCE/index.js';
import * as generateRequest from '../generateRequest.js';


const TEST_FIXTURES = Object.freeze({
  DEBUG: true,
  LOGGER: logging.NullLogger,
  REQUEST_1: Object.freeze({
    EXPECTED_REQUEST: new nodeFetch.Request(
      'http://localhost/resource1',
      {
        method: REFERENCE.ENUMERATIONS.HTTP_METHOD.GET
      }
    ),
    PARAMETERS: Object.freeze({
      httpHeaders: null,
      httpMethod: REFERENCE.ENUMERATIONS.HTTP_METHOD.GET,
      location: 'http://localhost/resource1',
      parameters: null
    })
  }),
  REQUEST_2: Object.freeze({
    EXPECTED_REQUEST: new nodeFetch.Request(
      'http://localhost/resource2?parameter=value',
      {
        headers: [
          [ REFERENCE.ENUMERATIONS.HTTP_HEADER.X_REQUESTED_WITH, `${generateRequest.default.name}` ]
        ],
        method: REFERENCE.ENUMERATIONS.HTTP_METHOD.GET
      }
    ),
    PARAMETERS: Object.freeze({
      httpHeaders: [
        [ REFERENCE.ENUMERATIONS.HTTP_HEADER.X_REQUESTED_WITH, `${generateRequest.default.name}` ]
      ],
      httpMethod: REFERENCE.ENUMERATIONS.HTTP_METHOD.GET,
      location: 'http://localhost/resource2',
      parameters: {
        null_parameter: null,
        parameter: 'value'
      }
    })
  }),
  REQUEST_3: Object.freeze({
    EXPECTED_REQUEST: new nodeFetch.Request(
      'http://localhost/resource3',
      {
        body: JSON.stringify({
          parameter: 'value'
        }),
        headers: [
          [ REFERENCE.ENUMERATIONS.HTTP_HEADER.CONTENT_TYPE, REFERENCE.ENUMERATIONS.MEDIA_TYPE.JSON ]
        ],
        method: REFERENCE.ENUMERATIONS.HTTP_METHOD.POST
      }
    ),
    PARAMETERS: Object.freeze({
      httpHeaders: [
        [ '', 'invalid_key' ],
        [ 'invalid_value', '' ]
      ],
      httpMethod: REFERENCE.ENUMERATIONS.HTTP_METHOD.POST,
      location: 'http://localhost/resource3',
      parameters: {
        parameter: 'value'
      }
    })
  })
});

ava.before(
  'core.webUtilities.ajax.generateRequest – test environment setup',
  () => {
    // use “node-fetch” to populate the following in the global scope …
    // - `Headers`
    // - `Request`
    global.Headers = nodeFetch.Headers;
    global.Request = nodeFetch.Request;
  }
);

ava(
  'core.webUtilities.ajax.generateRequest – static data',
  (t) => {
    t.is(typeof generateRequest.DEFAULTS, 'object');
    t.is(generateRequest.DEFAULTS.DEBUG, false);
    t.deepEqual(generateRequest.DEFAULTS.HTTP_HEADERS, []);
    t.is(generateRequest.DEFAULTS.LOGGER, logging.ConsoleLogger);
    t.is(generateRequest.DEFAULTS.PARAMETERS, null);
    t.is(typeof generateRequest.PROCESS_ID, 'string');
    t.is(typeof generateRequest.generateRequest, 'function');
    t.is(generateRequest.default, generateRequest.generateRequest);
  }
);

ava(
  'core.webUtilities.ajax.generateRequest – GET (no query string)',
  (t) => {
    const request = generateRequest.default({
      debug: false,
      httpHeaders: TEST_FIXTURES.REQUEST_1.PARAMETERS.httpHeaders,
      httpMethod: TEST_FIXTURES.REQUEST_1.PARAMETERS.httpMethod,
      location: TEST_FIXTURES.REQUEST_1.PARAMETERS.location,
      logger: TEST_FIXTURES.LOGGER,
      parameters: TEST_FIXTURES.REQUEST_1.PARAMETERS.parameters
    });

    t.is(typeof request, 'object');
    t.true(request instanceof nodeFetch.Request);
    t.deepEqual(request, TEST_FIXTURES.REQUEST_1.EXPECTED_REQUEST);
  }
);

ava(
  'core.webUtilities.ajax.generateRequest – GET (query string)',
  (t) => {
    const request = generateRequest.default({
      debug: TEST_FIXTURES.DEBUG,
      httpHeaders: TEST_FIXTURES.REQUEST_2.PARAMETERS.httpHeaders,
      httpMethod: TEST_FIXTURES.REQUEST_2.PARAMETERS.httpMethod,
      location: TEST_FIXTURES.REQUEST_2.PARAMETERS.location,
      logger: TEST_FIXTURES.LOGGER,
      parameters: TEST_FIXTURES.REQUEST_2.PARAMETERS.parameters
    });

    t.is(typeof request, 'object');
    t.true(request instanceof nodeFetch.Request);
    t.deepEqual(request, TEST_FIXTURES.REQUEST_2.EXPECTED_REQUEST);
  }
);

ava(
  'core.webUtilities.ajax.generateRequest – POST',
  (t) => {
    const request = generateRequest.default({
      debug: TEST_FIXTURES.DEBUG,
      httpHeaders: TEST_FIXTURES.REQUEST_3.PARAMETERS.httpHeaders,
      httpMethod: TEST_FIXTURES.REQUEST_3.PARAMETERS.httpMethod,
      location: TEST_FIXTURES.REQUEST_3.PARAMETERS.location,
      logger: TEST_FIXTURES.LOGGER,
      parameters: TEST_FIXTURES.REQUEST_3.PARAMETERS.parameters
    });

    t.is(typeof request, 'object');
    t.true(request instanceof nodeFetch.Request);
    t.deepEqual(request, TEST_FIXTURES.REQUEST_3.EXPECTED_REQUEST);
  }
);

ava(
  'core.webUtilities.ajax.generateRequest – errors',
  (t) => {
    const expectedError1 = new errors.EnumerationValidationError('httpMethod', 'HTTP method');

    const error1 = t.throws(
      () => generateRequest.default({
        httpMethod: null,
        location: TEST_FIXTURES.REQUEST_1.PARAMETERS.location
      })
    );

    t.is(typeof error1, 'object');
    t.deepEqual(error1, expectedError1);

    const expectedError2 = new errors.TypeValidationError('location', String);

    const error2 = t.throws(
      () => generateRequest.default({
        debug: null,
        httpHeaders: null,
        httpMethod: TEST_FIXTURES.REQUEST_1.PARAMETERS.httpMethod,
        location: null,
        logger: null
      })
    );

    t.is(typeof error2, 'object');
    t.deepEqual(error2, expectedError2);
  }
);