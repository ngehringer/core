import REFERENCE from '../../REFERENCE/index.js';
import sendRequest from './sendRequest.js';


const put = ({ ...rest }) => sendRequest({
  httpMethod: REFERENCE.ENUMERATIONS.HTTP_METHOD.PUT,
  ...rest
});


export default put;