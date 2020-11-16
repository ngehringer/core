import * as logging from '../../logging/index.js';
import * as utilities from '../../utilities/index.js';
import REFERENCE from '../../REFERENCE/index.js';
import parseResponse from './parseResponse.js';
import sendRequest from './sendRequest.js';


const DEFAULTS = Object.freeze({
  DEBUG: false,
  HTTP_HEADERS: null,
  LOGGER: logging.ConsoleLogger,
  PARAMETERS: null
});

const PROCESS_ID = '@backwater-systems/core.webUtilities.ajax.put';

const put = async ({
  debug = DEFAULTS.DEBUG,
  httpHeaders = DEFAULTS.HTTP_HEADERS,
  location,
  logger = DEFAULTS.LOGGER,
  parameters = DEFAULTS.PARAMETERS
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

  try {
    // execute the request
    const response = await sendRequest({
      debug: _debug,
      httpHeaders: httpHeaders,
      httpMethod: REFERENCE.ENUMERATIONS.HTTP_METHOD.PUT,
      location: location,
      parameters: parameters
    });

    // parse the response
    const parsedResponse = await parseResponse({
      debug: _debug,
      response: response.response
    });

    return {
      ...response,
      ...parsedResponse
    };
  }
  catch (error) {
    // if debug mode is enabled …
    if (_debug) {
      // … log the error
      _logger.logError({
        data: error,
        sourceID: PROCESS_ID,
        verbose: _debug
      });
    }

    // re-throw the error
    throw error;
  }
};


export default put;