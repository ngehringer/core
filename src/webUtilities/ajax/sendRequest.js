import * as errors from '../../errors/index.js';
import * as logging from '../../logging/index.js';
import * as utilities from '../../utilities/index.js';
import REFERENCE from '../../REFERENCE/index.js';
import generateQueryString from './generateQueryString.js';


const DEFAULTS = Object.freeze({
  'DEBUG': false,
  'HTTP_HEADERS': [],
  'LOGGER': logging.ConsoleLogger
});

const PROCESS_ID = '@backwater-systems/core.webUtilities.ajax.sendRequest';

const sendRequest = async ({
  debug = DEFAULTS.DEBUG,
  httpHeaders = DEFAULTS.HTTP_HEADERS,
  httpMethod,
  location,
  logger = DEFAULTS.LOGGER,
  parameters
}) => {
  // define whether debug mode is enabled
  const _debug = utilities.validation.validateType(debug, Boolean)
    ? debug
    : DEFAULTS.DEBUG
  ;

  // define the logger
  const _logger = utilities.validation.validateInheritance(logger, logging.BaseLogger)
    ? logger
    : DEFAULTS.LOGGER
  ;

  // coerce the specified HTTP method to uppercase and ensure it is valid
  const _httpMethod = (
    utilities.validation.validateType(httpMethod, String)
    && utilities.validation.validateEnumeration(httpMethod.toUpperCase(), REFERENCE.ENUMERATIONS.HTTP_METHOD)
  )
    ? httpMethod.toUpperCase()
    : null
  ;
  if (_httpMethod === null) throw new Error(
    `‘httpMethod’ must be { ${
      Object.values(REFERENCE.ENUMERATIONS.HTTP_METHOD)
        .map( (__httpMethod) => `“${__httpMethod}”` )
        .join(' | ')
    } }.`
  );

  // ensure the specified location is valid
  if ( !utilities.validation.isNonEmptyString(location) ) throw new errors.TypeValidationError('location', String);

  // construct the request’s HTTP headers
  const _httpHeaders = Array.isArray(httpHeaders)
    ? httpHeaders.filter(
        (httpHeader) => (
          Array.isArray(httpHeader)
          && utilities.validation.isNonEmptyString(httpHeader[0])
          && utilities.validation.isNonEmptyString(httpHeader[1])
        )
      )
    : DEFAULTS.HTTP_HEADERS
  ;
  const headers = new Headers(_httpHeaders);

  // determine if the request should encode its parameters in a query string or the request body
  const queryStringEnabled = (
    (_httpMethod === REFERENCE.ENUMERATIONS.HTTP_METHOD.GET)
    || (_httpMethod === REFERENCE.ENUMERATIONS.HTTP_METHOD.HEAD)
  );

  let _location;
  let body;
  // if request parameters were specified …
  if ( utilities.validation.validateType(parameters, Object) ) {
    // … and query string mode is enabled …
    if (queryStringEnabled) {
      // … encode the parameters as a query string appended to the location …
      const queryString = generateQueryString(parameters);
      _location = `${location}?${queryString}`;
      // … and don’t send a request body …
      body = null;
    }
    // … or, if query string mode is not enabled …
    else {
      // … use the location as specified, …
      _location = location;
      // … encode the parameters a JSON request body, …
      body = JSON.stringify(parameters);
      // … and indicate that the request’s content type is JSON …
      headers.append(REFERENCE.ENUMERATIONS.HTTP_HEADER.CONTENT_TYPE, REFERENCE.ENUMERATIONS.MEDIA_TYPE.JSON);
    }
  }
  // … or, if request parameters were not specified …
  else {
    // … use the location as specified …
    _location = location;
    // … and don’t send a request body
    body = null;
  }

  // in debug mode, log the request’s location, headers, and parameters
  if (_debug) {
    _logger.logDebug({
      'data': {
        'fetchRequest': {
          'headers': Array.from( headers.entries() ).map(
            (headerKey_headerValue) => ({
              'name': headerKey_headerValue[0],
              'value': headerKey_headerValue[1]
            })
          ),
          'httpMethod': _httpMethod,
          'location': _location,
          'parameters': parameters
        }
      },
      'sourceID': PROCESS_ID,
      'verbose': _debug
    });
  }

  // construct the Fetch API request
  const request = new Request(
    _location,
    {
      body: body,
      headers: headers,
      method: _httpMethod
    }
  );

  // execute the Fetch request
  const response = await fetch(request);

  // in debug mode, log the response’s status code and reason phrase
  if (_debug) {
    _logger.logDebug({
      'data': {
        'fetchResponse': {
          'httpMethod': _httpMethod,
          'location': _location,
          'statusCode': response.status,
          'statusReasonPhrase': response.statusText
        }
      },
      'sourceID': PROCESS_ID,
      'verbose': _debug
    });
  }

  // if the request was not successful, construct an error with metadata about the response
  if (!response.ok) throw new errors.HTTPResponseError({
    'method': _httpMethod,
    'response': response,
    'statusCode': response.status,
    'statusReasonPhrase': response.statusText,
    'url': response.url
  });

  return {
    'request': request,
    'response': response,
    'statusCode': response.status,
    'statusReasonPhrase': response.statusText,
  };
};


export default sendRequest;