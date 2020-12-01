import REFERENCE from '../../REFERENCE/index.js';
import sendRequest from './sendRequest.js';


const patch = ({ ...rest }) => sendRequest({
  httpMethod: REFERENCE.ENUMERATIONS.HTTP_METHOD.PATCH,
  ...rest
});


export default patch;