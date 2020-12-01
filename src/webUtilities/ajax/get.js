import REFERENCE from '../../REFERENCE/index.js';
import sendRequest from './sendRequest.js';


const get = ({ ...rest }) => sendRequest({
  httpMethod: REFERENCE.ENUMERATIONS.HTTP_METHOD.GET,
  ...rest
});


export default get;