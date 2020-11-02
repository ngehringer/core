import * as errors from '../../errors/index.js';
import * as utilities from '../../utilities/index.js';


const generateQueryString = (parameters) => {
  if ( !utilities.validateType(parameters, Object) ) throw new errors.TypeValidationError('parameters', Object);

  const queryString = Object.keys(parameters)
    .map( (key) => `${encodeURIComponent(key)}=${encodeURIComponent(parameters[key])}` )
    .join('&')
  ;

  return queryString;
};


export default generateQueryString;