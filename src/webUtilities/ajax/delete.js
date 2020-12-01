import REFERENCE from '../../REFERENCE/index.js';
import sendRequest from './sendRequest.js';


// “delete” is a JavaScript keyword
const delete_ = ({ ...rest }) => sendRequest({
  httpMethod: REFERENCE.ENUMERATIONS.HTTP_METHOD.DELETE,
  ...rest
});


export default delete_;