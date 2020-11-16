import * as errors from '../../errors/index.js';
import * as logging from '../../logging/index.js';
import * as utilities from '../../utilities/index.js';
import REFERENCE from '../../REFERENCE/index.js';


const DEFAULTS = Object.freeze({
  DEBUG: false,
  LOGGER: logging.ConsoleLogger
});

const PROCESS_ID = '@backwater-systems/core.webUtilities.ajax.parseResponse';

const parseResponse = async ({
  debug = DEFAULTS.DEBUG,
  logger = DEFAULTS.LOGGER,
  response
}) => {
  // determine if debug mode is enabled (default: disabled)
  const _debug = utilities.validation.validateType(debug, Boolean)
    ? debug
    : DEFAULTS.DEBUG
  ;

  // define the logger
  const _logger = utilities.validation.validateInheritance(logger, logging.BaseLogger)
    ? logger
    : DEFAULTS.LOGGER
  ;

  if ( !utilities.validation.validateType(response, Response) ) throw new errors.TypeValidationError('response', Response);

  // attempt to determine the response’s media type

  const contentTypeHeader = response.headers.get('Content-Type');

  const isJSON = (
    // JSON
    (contentTypeHeader.match(`${REFERENCE.ENUMERATIONS.MEDIA_TYPE.JSON}`) !== null)
  );

  const isText = (
    // HTML …
    (contentTypeHeader.match(`${REFERENCE.ENUMERATIONS.MEDIA_TYPE.HTML}`) !== null)
    // … and everything else
    || (
      !isJSON
    )
  );

  // parse the response as JSON
  const responseJSON = isJSON
    ? await response.json()
    : null
  ;

  // parse the response as text
  const responseText = isText
    ? await response.text()
    : null
  ;

  if (_debug) {
    _logger.logDebug({
      data: {
        json: {
          expected: isJSON,
          valid: utilities.validation.validateType(responseJSON, Object)
        },
        text: {
          byteCount: (responseText === null) ? null : responseText.length,
          expected: isText,
          valid: utilities.validation.validateType(responseText, String)
        }
      },
      sourceID: PROCESS_ID,
      verbose: _debug
    });
  }

  return {
    json: responseJSON,
    text: responseText
  };
};


export default parseResponse;