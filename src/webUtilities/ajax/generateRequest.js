import * as errors from '../../errors/index.js';
import * as logging from '../../logging/index.js';
import * as utilities from '../../utilities/index.js';
import REFERENCE from '../../REFERENCE/index.js';
import generateQueryString from './generateQueryString.js';


/** the process’s defaults */
const DEFAULTS = Object.freeze({
  DEBUG: false,
  HTTP_HEADERS: [],
  LOGGER: logging.ConsoleLogger,
  PARAMETERS: null
});

/** the process’s ID */
const PROCESS_ID = '@backwater-systems/core.webUtilities.ajax.generateRequest';

/**
  * Generates a Fetch API `Request`.
  */
const generateRequest = ({
  debug = DEFAULTS.DEBUG,
  httpHeaders = DEFAULTS.HTTP_HEADERS,
  httpMethod,
  location,
  logger = DEFAULTS.LOGGER,
  parameters = DEFAULTS.PARAMETERS
}) => {
  /** whether debug mode is enabled (default: false) */
  const _debug = utilities.validation.validateType(debug, Boolean)
    ? debug
    : DEFAULTS.DEBUG
  ;

  /** the process’s logger */
  const _logger = (
    utilities.validation.validateType(logger, Object)
    && utilities.validation.validateInheritance(logger, logging.BaseLogger)
  )
    ? logger
    : DEFAULTS.LOGGER
  ;

  // abort if the specified “httpMethod” parameter is not a valid HTTP method
  if ( !utilities.validation.validateEnumeration(httpMethod, REFERENCE.ENUMERATIONS.HTTP_METHOD) ) throw new errors.EnumerationValidationError('httpMethod', 'HTTP method');

  // abort if the specified “location” parameter is not a non-empty string
  if ( !utilities.validation.isNonEmptyString(location) ) throw new errors.TypeValidationError('location', String);

  /** the `Request`’s HTTP headers, sanitized */
  const _httpHeaders = Array.isArray(httpHeaders)
    // remove any items that are not a [ string, string ] tuple
    ? httpHeaders.filter(
      (httpHeader) => (
        Array.isArray(httpHeader)
        && utilities.validation.isNonEmptyString(httpHeader[0])
        && utilities.validation.isNonEmptyString(httpHeader[1])
      )
    )
    : DEFAULTS.HTTP_HEADERS
  ;

  /** the `Request`’s `Headers` */
  const headers = new Headers(_httpHeaders);

  // determine if the request should encode its parameters in a query string or the request body
  const queryStringEnabled = (
    (httpMethod === REFERENCE.ENUMERATIONS.HTTP_METHOD.GET)
    || (httpMethod === REFERENCE.ENUMERATIONS.HTTP_METHOD.HEAD)
  );

  /** the `Request`’s location (URI) */
  let _location;

  /** the `Request`’s body */
  let body;

  // if request parameters were specified …
  if ( utilities.validation.validateType(parameters, Object) ) {
    // … and query string mode is enabled …
    if (queryStringEnabled) {
      /** the specified parameters encoded as a query string */
      const queryString = generateQueryString(parameters);
      // … encode the parameters as a query string appended to the location …
      _location = utilities.validation.isNonEmptyString(queryString) ? `${location}?${queryString}` : location;
      // … and don’t send a request body
      body = null;
    }
    // … or, if query string mode is not enabled …
    else {
      // … use the location as specified, …
      _location = location;
      // … encode the parameters a JSON request body, …
      body = JSON.stringify(parameters);
      // … and, indicate that the request’s content type is JSON
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

  // in debug mode, log information about the request
  if (_debug) {
    _logger.logDebug({
      data: {
        fetchRequest: {
          headers: Array.from( headers.entries() ).map(
            (headerKeyValueEntry) => ({
              name: headerKeyValueEntry[0],
              value: headerKeyValueEntry[1]
            })
          ),
          httpMethod: httpMethod,
          location: _location,
          parameters: parameters
        }
      },
      sourceID: PROCESS_ID,
      verbose: _debug
    });
  }

  /** the generated Fetch API `Request` */
  const request = new Request(
    _location,
    {
      body: body,
      headers: headers,
      method: httpMethod
    }
  );

  return request;
};


export default generateRequest;
export {
  DEFAULTS,
  PROCESS_ID,
  generateRequest
};