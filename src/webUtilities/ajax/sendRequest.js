import * as errors from '../../errors/index.js';
import * as logging from '../../logging/index.js';
import * as utilities from '../../utilities/index.js';
import REFERENCE from '../../REFERENCE/index.js';
import generateRequest from './generateRequest.js';
import parseResponseBody from './parseResponseBody.js';


/** the process’s defaults */
const DEFAULTS = Object.freeze({
  DEBUG: false,
  HTTP_HEADERS: [],
  LOGGER: logging.ConsoleLogger,
  PARAMETERS: null
});

/** the process’s ID */
const PROCESS_ID = '@backwater-systems/core.webUtilities.ajax.sendRequest';

/**
  * Executes an HTTP request using the Fetch API.
  */
const sendRequest = async ({
  debug = DEFAULTS.DEBUG,
  httpHeaders = DEFAULTS.HTTP_HEADERS,
  httpMethod,
  location,
  logger = DEFAULTS.LOGGER,
  parameters = DEFAULTS.PARAMETERS
}) => {
  /** whether debug mode is enabled */
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

  if (
    !utilities.validation.validateType(httpMethod, String)
    || !utilities.validation.validateEnumeration(httpMethod.toUpperCase(), REFERENCE.ENUMERATIONS.HTTP_METHOD)
  ) throw new Error(
    `‘httpMethod’ must be { ${
      Object.values(REFERENCE.ENUMERATIONS.HTTP_METHOD)
        .map( (__httpMethod) => `“${__httpMethod}”` )
        .join(' | ')
    } }.`
  );

  /** the specified HTTP method for the request, coerced to uppercase */
  const _httpMethod = httpMethod.toUpperCase();

  /** the Fetch API `Request` */
  const request = generateRequest({
    httpHeaders: httpHeaders,
    httpMethod: _httpMethod,
    location: location,
    logger: _logger,
    parameters: parameters
  });

  /** the Fetch API `Response` */
  const response = await fetch(request);

  // in debug mode, log information about the response
  if (_debug) {
    _logger.logDebug({
      data: {
        fetchResponse: {
          httpMethod: _httpMethod,
          location: request.url,
          statusCode: response.status,
          statusReasonPhrase: response.statusText
        }
      },
      sourceID: PROCESS_ID,
      verbose: _debug
    });
  }

  // if the request was not successful, construct an error with metadata about the response
  if (!response.ok) throw new errors.HTTPResponseError({
    method: _httpMethod,
    response: response,
    statusCode: response.status,
    statusReasonPhrase: response.statusText,
    url: response.url
  });

  /** whether the `Response` may contain a body */
  const responseBodyEnabled = (_httpMethod !== REFERENCE.ENUMERATIONS.HTTP_METHOD.HEAD);

  /** the `Response`’s body, parsed (or null, if it does not contain a body) */
  const responseBody = responseBodyEnabled
    ? await parseResponseBody({
      debug: _debug,
      logger: _logger,
      response: response
    })
    : null
  ;

  return {
    request: request,
    response: response,
    responseBody: responseBody,
    statusCode: response.status,
    statusReasonPhrase: response.statusText
  };
};


export default sendRequest;
export {
  DEFAULTS,
  PROCESS_ID,
  sendRequest
};