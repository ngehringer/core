import * as errors from '../../errors/index.js';
import * as logging from '../../logging/index.js';
import * as utilities from '../../utilities/index.js';
import CORE_REFERENCE from '../../REFERENCE/index.js';


/** the process’s defaults */
const DEFAULTS = Object.freeze({
  DEBUG: false,
  LOGGER: logging.ConsoleLogger
});

/** the process’s ID */
const PROCESS_ID = '@backwater-systems/core.webUtilities.ajax.parseResponse';

/** the process’s reference data */
const REFERENCE = Object.freeze({
  JSON_CONTENT_TYPES: Object.freeze([
    // JSON
    CORE_REFERENCE.ENUMERATIONS.MEDIA_TYPE.JSON
  ]),
  TEXT_CONTENT_TYPES: Object.freeze([
    // HTML
    CORE_REFERENCE.ENUMERATIONS.MEDIA_TYPE.HTML
  ])
});

/**
  * Parses the body of a Fetch API `Response` into an object containing one non-null property – `json` or `text` – depending on the specified `Response`’s “Content-Type”.
  */
const parseResponse = async ({
  debug = DEFAULTS.DEBUG,
  logger = DEFAULTS.LOGGER,
  response
}) => {
  /** whether debug mode is enabled (default: disabled) */
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

  // abort if the the specified `response` parameter is not a `Response` object
  if ( !utilities.validation.validateType(response, Response) ) throw new errors.TypeValidationError('response', Response);

  // attempt to determine the response’s media type

  /** the specified `Response`’s “Content-Type” header value */
  const contentTypeHeader = response.headers.get('Content-Type');

  /** whether the specified `Response`’s “Content-Type” indicates that it is JSON */
  const isJSON = REFERENCE.JSON_CONTENT_TYPES.some(
    (contentType) => new RegExp(`^${contentType}`).test(contentTypeHeader)
  );

  /** whether the specified `Response`’s “Content-Type” indicates that it is text */
  const isText = (
    REFERENCE.TEXT_CONTENT_TYPES.some(
      (contentType) => new RegExp(`^${contentType}`).test(contentTypeHeader)
    )
    // include everything that isn’t JSON
    || (
      !isJSON
    )
  );

  // in debug mode, log information about the `Response`
  if (_debug) {
    _logger.logDebug({
      data: {
        contentType: contentTypeHeader,
        json: isJSON,
        text: isText
      },
      sourceID: PROCESS_ID,
      verbose: _debug
    });
  }

  /** the specified `Response`’s parsed JSON (or null) */
  const responseJSON = isJSON
    ? await response.json()
    : null
  ;

  /** the specified `Response`’s parsed text (or null) */
  const responseText = isText
    ? await response.text()
    : null
  ;

  // in debug mode, log information about the `Response`’s body
  if (_debug) {
    _logger.logDebug({
      data: {
        contentType: contentTypeHeader,
        json: {
          parsed: isJSON,
          valid: utilities.validation.validateType(responseJSON, Object)
        },
        text: {
          byteCount: (responseText === null) ? null : responseText.length,
          parsed: isText,
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
export {
  DEFAULTS,
  PROCESS_ID,
  REFERENCE,
  parseResponse
};