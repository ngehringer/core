import REFERENCE from '../../REFERENCE/index.js';
import sendRequest from './sendRequest.js';


/**
 * Sends an HTTP `OPTIONS` request.
 */
const options = ({ ...rest }) => sendRequest({
  httpMethod: REFERENCE.ENUMERATIONS.HTTP_METHOD.OPTIONS,
  ...rest
});


export default options;