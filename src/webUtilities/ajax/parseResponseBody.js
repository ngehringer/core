import * as errors from '../../errors/index.js';
import * as logging from '../../logging/index.js';
import * as utilities from '../../utilities/index.js';
import CORE_REFERENCE from '../../REFERENCE/index.js';


/**
 * The module’s defaults
 */
const DEFAULTS = Object.freeze({
  DEBUG: false,
  LOGGER: logging.ConsoleLogger
});

/**
 * The module’s ID
 */
const MODULE_ID = '@backwater-systems/core.webUtilities.ajax.parseResponse';

/**
 * The module’s reference data
 */
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
  /**
   * Whether debug mode is enabled
   * @default false
   */
  const _debug = utilities.validation.validateType(debug, Boolean)
    ? debug
    : DEFAULTS.DEBUG
  ;

  /**
   * The module’s logger
   */
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

  /**
   * The “Content-Type” header value of the specified `Response`
   */
  const contentTypeHeader = response.headers.get('Content-Type');

  /**
   * Whether the “Content-Type” header of the specified `Response` indicates that it is JSON
   */
  const isJSON = REFERENCE.JSON_CONTENT_TYPES.some(
    (contentType) => new RegExp(`^${contentType}`).test(contentTypeHeader)
  );

  /**
   * Whether the “Content-Type” header of the specified `Response` indicates that it is text
   */
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
      sourceID: MODULE_ID,
      verbose: _debug
    });
  }

  /**
   * The parsed JSON of the specified `Response` (or `null`)
   */
  const responseJSON = isJSON
    ? await response.json()
    : null
  ;

  /**
   * The parsed text of the specified `Response` (or `null`)
   */
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
      sourceID: MODULE_ID,
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
  MODULE_ID,
  REFERENCE,
  parseResponse
};