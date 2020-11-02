import * as logging from '../../logging/index.js';
import * as utilities from '../../utilities/index.js';
import REFERENCE from '../../REFERENCE/index.js';
import sendRequest from './sendRequest.js';


const DEFAULTS = Object.freeze({
  'DEBUG': false
});

const PROCESS_ID = '@backwater-systems/core.webUtilities.ajax.head';

const head = async ({
  debug = DEFAULTS.DEBUG,
  location,
  parameters = null,
  httpHeaders = null
}) => {
  // define whether debug mode is enabled
  const _debug = utilities.validateType(debug, Boolean)
    ? debug
    : DEFAULTS.DEBUG
  ;

  try {
    // execute the request
    const response = await sendRequest({
      'debug': _debug,
      'httpHeaders': httpHeaders,
      'httpMethod': REFERENCE.ENUMERATIONS.HTTP_METHOD.HEAD,
      'location': location,
      'parameters': parameters
    });

    return {
      ...response
    };
  }
  catch (error) {
    // log the error …
    logging.Logger.logError(error, PROCESS_ID, _debug);

    // … and re-throw it
    throw error;
  }
};


export default head;