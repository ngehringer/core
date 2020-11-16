import ava from 'ava';

import REFERENCE from '../../REFERENCE/index.js';
import HTTPResponseError from '../HTTPResponseError.js';


const TEST_FIXTURES = Object.freeze({
  METHOD: REFERENCE.ENUMERATIONS.HTTP_METHOD.HEAD,
  STATUS_CODE: REFERENCE.ENUMERATIONS.HTTP_STATUS_CODE['200_OK'],
  STATUS_REASON_PHRASE: 'OK',
  URL: 'https://localhost'
});

ava(
  'core.errors.HTTPResponseError',
  (test) => {
    const httpResponseError = new HTTPResponseError({
      method: TEST_FIXTURES.METHOD,
      statusCode: TEST_FIXTURES.STATUS_CODE,
      statusReasonPhrase: TEST_FIXTURES.STATUS_REASON_PHRASE,
      url: TEST_FIXTURES.URL
    });

    test.is(typeof httpResponseError, 'object');
    test.true(httpResponseError instanceof Error);
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
      method: TEST_FIXTURES.METHOD,
      statusCode: TEST_FIXTURES.STATUS_CODE,
      statusReasonPhrase: TEST_FIXTURES.STATUS_REASON_PHRASE,
      url: TEST_FIXTURES.URL
    });

    test.is(typeof httpResponseError, 'object');
    test.true(httpResponseError instanceof Error);
    test.is(httpResponseError.name, HTTPResponseError.name);
    test.is(httpResponseError.method, TEST_FIXTURES.METHOD);
    test.is(httpResponseError.response, null);
    test.is(httpResponseError.statusCode, TEST_FIXTURES.STATUS_CODE);
    test.is(httpResponseError.statusReasonPhrase, TEST_FIXTURES.STATUS_REASON_PHRASE);
    test.is(httpResponseError.url, TEST_FIXTURES.URL);
  }
);