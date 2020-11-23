import ava from 'ava';

import REFERENCE from '../../REFERENCE/index.js';
import HTTPResponseError from '../HTTPResponseError.js';


const TEST_FIXTURES = Object.freeze({
  METHOD: REFERENCE.ENUMERATIONS.HTTP_METHOD.HEAD,
  RESPONSE: {},
  STATUS_CODE: REFERENCE.ENUMERATIONS.HTTP_STATUS_CODE['200_OK'],
  STATUS_REASON_PHRASE: 'OK',
  URL: 'https://localhost'
});

ava(
  'core.errors.HTTPResponseError',
  (test) => {
    const httpResponseError = new HTTPResponseError({
      method: TEST_FIXTURES.METHOD,
      response: TEST_FIXTURES.RESPONSE,
      statusCode: TEST_FIXTURES.STATUS_CODE,
      statusReasonPhrase: TEST_FIXTURES.STATUS_REASON_PHRASE,
      url: TEST_FIXTURES.URL
    });

    test.is(typeof httpResponseError, 'object');
    test.true(httpResponseError instanceof Error);
    test.is(typeof httpResponseError.message, 'string');
    test.is(httpResponseError.message, `Error fetching (${TEST_FIXTURES.METHOD}) “${TEST_FIXTURES.URL}”: ${TEST_FIXTURES.STATUS_CODE} ${TEST_FIXTURES.STATUS_REASON_PHRASE}`);
    test.is(httpResponseError.name, HTTPResponseError.name);
    test.is(httpResponseError.method, TEST_FIXTURES.METHOD);
    test.is(httpResponseError.response, null);
    test.is(httpResponseError.statusCode, TEST_FIXTURES.STATUS_CODE);
    test.is(httpResponseError.statusReasonPhrase, TEST_FIXTURES.STATUS_REASON_PHRASE);
    test.is(httpResponseError.url, TEST_FIXTURES.URL);
  }
);

ava(
  'core.errors.HTTPResponseError – unspecified parameters',
  (test) => {
    const httpResponseError = new HTTPResponseError({
      statusCode: TEST_FIXTURES.STATUS_CODE,
      url: TEST_FIXTURES.URL
    });

    test.is(typeof httpResponseError, 'object');
    test.true(httpResponseError instanceof Error);
    test.is(typeof httpResponseError.message, 'string');
    test.is(httpResponseError.message, `Error fetching “${TEST_FIXTURES.URL}”: ${TEST_FIXTURES.STATUS_CODE}`);
    test.is(httpResponseError.name, HTTPResponseError.name);
    test.is(httpResponseError.method, null);
    test.is(httpResponseError.response, null);
    test.is(httpResponseError.statusCode, TEST_FIXTURES.STATUS_CODE);
    test.is(httpResponseError.statusReasonPhrase, null);
    test.is(httpResponseError.url, TEST_FIXTURES.URL);
  }
);

ava(
  'core.errors.HTTPResponseError – invalid parameters',
  (test) => {
    const error1 = test.throws(
      () => new HTTPResponseError({})
    );
    test.is(typeof error1, 'object');
    test.true(error1 instanceof Error);
    test.is(error1.message, 'Invalid “statusCode” parameter value specified: must be an integer between 100 and 599.');

    const error2 = test.throws(
      () => new HTTPResponseError({
        statusCode: TEST_FIXTURES.STATUS_CODE
      })
    );
    test.is(typeof error2, 'object');
    test.true(error2 instanceof Error);
    test.is(error2.message, 'Invalid “url” parameter value specified.');
  }
);