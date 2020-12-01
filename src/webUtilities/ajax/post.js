import REFERENCE from '../../REFERENCE/index.js';
import sendRequest from './sendRequest.js';


const post = ({ ...rest }) => sendRequest({
  httpMethod: REFERENCE.ENUMERATIONS.HTTP_METHOD.POST,
  ...rest
});


export default post;