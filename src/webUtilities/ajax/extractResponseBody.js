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
const MODULE_ID = '@backwater-systems/core.webUtilities.ajax.extractResponseBody';

/**
 * The module’s reference data
 */
const REFERENCE = Object.freeze({
  CONTENT_TYPES: Object.freeze({
    ARRAY_BUFFER: Object.freeze([
      // application/octet-stream
      CORE_REFERENCE.ENUMERATIONS.MEDIA_TYPE.OCTET_STREAM
    ]),
    JSON: Object.freeze([
      // `application/json`
      CORE_REFERENCE.ENUMERATIONS.MEDIA_TYPE.JSON
    ]),
    TEXT: Object.freeze([
      // `text/css`
      CORE_REFERENCE.ENUMERATIONS.MEDIA_TYPE.CSS,
      // `text/csv`
      CORE_REFERENCE.ENUMERATIONS.MEDIA_TYPE.CSV,
      // `text/javascript`
      CORE_REFERENCE.ENUMERATIONS.MEDIA_TYPE.JAVASCRIPT,
      // `text/html`
      CORE_REFERENCE.ENUMERATIONS.MEDIA_TYPE.HTML,
      // `text/plain`
      CORE_REFERENCE.ENUMERATIONS.MEDIA_TYPE.TEXT,
      // `application/xml`
      CORE_REFERENCE.ENUMERATIONS.MEDIA_TYPE.XML
    ])
  })
});

/**
 * Extracts the body of a Fetch API `Response` into an object containing one non-null property – `arrayBuffer`, `json`, or `text` – depending on the specified `Response`’s “Content-Type” HTTP header.
 */
const extractResponseBody = async ({
  debug = DEFAULTS.DEBUG,
  logger = DEFAULTS.LOGGER,
  response
}) => {
  /**
   * Whether debug mode is enabled
   * @default false
   */
  const _debug = (typeof debug === 'boolean')
    ? debug
    : DEFAULTS.DEBUG
  ;

  /**
   * The module’s logger
   */
  const _logger = (
    (typeof logger === 'function')
    && utilities.validation.validateInheritance(logger, logging.BaseLogger)
  )
    ? logger
    : DEFAULTS.LOGGER
  ;

  // abort if the the specified `response` parameter value is not a `Response` object
  if (
    (typeof response !== 'object')
    || !(response instanceof Response)
  ) throw new errors.TypeValidationError('response', Response);

  // attempt to determine the response’s media type

  /**
   * The “Content-Type” header value of the specified `Response`
   */
  const contentTypeHeader = response.headers.get('Content-Type');

  /**
   * Whether the “Content-Type” header of the specified `Response` indicates that it is JSON
   */
  const isJSON = REFERENCE.CONTENT_TYPES.JSON.some(
    (contentType) => new RegExp(`^${contentType}`).test(contentTypeHeader)
  );

  /**
   * Whether the “Content-Type” header of the specified `Response` indicates that it is text
   */
  const isText = REFERENCE.CONTENT_TYPES.TEXT.some(
    (contentType) => new RegExp(`^${contentType}`).test(contentTypeHeader)
  );

  /**
   * Whether the “Content-Type” header of the specified `Response` indicates that it is an `ArrayBuffer`
   */
  const isArrayBuffer = (
    REFERENCE.CONTENT_TYPES.ARRAY_BUFFER.some(
      (contentType) => new RegExp(`^${contentType}`).test(contentTypeHeader)
    )
    // include everything that isn’t JSON or text
    || (
      !isJSON
      && !isText
    )
  );

  // in debug mode, log information about the `Response`
  if (_debug) {
    _logger.logDebug({
      data: {
        arrayBuffer: isArrayBuffer,
        contentType: contentTypeHeader,
        json: isJSON,
        responseBodyUsed: response.bodyUsed,
        text: isText
      },
      sourceID: MODULE_ID,
      verbose: _debug
    });
  }

  /**
   * The `ArrayBuffer` of the specified `Response` body (or `null`)
   */
  const arrayBuffer = isArrayBuffer
    ? await response.arrayBuffer()
    : null
  ;

  /**
   * The parsed JSON of the specified `Response` body (or `null`)
   */
  const json = isJSON
    ? await response.json()
    : null
  ;

  /**
   * The text of the specified `Response` body (or `null`)
   */
  const text = isText
    ? await response.text()
    : null
  ;

  // in debug mode, log information about the `Response`’s body
  if (_debug) {
    _logger.logDebug({
      data: {
        arrayBuffer: {
          byteCount: arrayBuffer?.byteLength ?? null,
          extracted: isArrayBuffer
        },
        contentType: contentTypeHeader,
        json: {
          byteCount: (json === null) ? null : JSON.stringify(json).length,
          extracted: isJSON
        },
        text: {
          byteCount: text?.length ?? null,
          extracted: isText
        }
      },
      sourceID: MODULE_ID,
      verbose: _debug
    });
  }

  return {
    arrayBuffer: arrayBuffer,
    json: json,
    text: text
  };
};


export default extractResponseBody;
export {
  DEFAULTS,
  MODULE_ID,
  REFERENCE,
  extractResponseBody
};