import * as errors from '../../errors/index.js';
import * as logging from '../../logging/index.js';
import * as utilities from '../../utilities/index.js';
import REFERENCE from '../../REFERENCE/index.js';


const DEFAULTS = Object.freeze({
  'DEBUG': false
});

const PROCESS_ID = '@backwater-systems/core.webUtilities.ajax.parseResponse';

const parseResponse = async ({
  debug = DEFAULTS.DEBUG,
  response
}) => {
  // determine if debug mode is enabled (default: disabled)
  const _debug = utilities.validateType(debug, Boolean)
    ? debug
    : DEFAULTS.DEBUG
  ;

  if ( !utilities.validateType(response, Response) ) throw new errors.TypeValidationError('response', Response);

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
    logging.Logger.logDebug(
      `${parseResponse.name} → JSON: ${
        isJSON
          ? utilities.validateType(responseJSON, Object)
            ? 'Yes'
            : 'Yes – but parsing seems to have failed'
          : 'No'
      } | Text: ${
        isText
          ? utilities.validateType(responseText, String)
            ? `Yes – ${utilities.formatNumber(responseText.length)} ${utilities.pluralize('byte', responseText.length)}`
            : 'Yes – but parsing seems to have failed'
          : 'No'
      }`,
      PROCESS_ID,
      _debug
    );
  }

  return {
    'json': responseJSON,
    'text': responseText
  };
};


export default parseResponse;