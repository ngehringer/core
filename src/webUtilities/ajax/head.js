import REFERENCE from '../../REFERENCE/index.js';
import sendRequest from './sendRequest.js';


const head = ({ ...rest }) => sendRequest({
  httpMethod: REFERENCE.ENUMERATIONS.HTTP_METHOD.HEAD,
  ...rest
});


export default head;