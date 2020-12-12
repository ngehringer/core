import * as errors from '../../errors/index.js';
import * as utilities from '../../utilities/index.js';

/**
 * Generates an HTTP query string (not including the “?” prefix) from the specified `parameters` object.
 */
const generateQueryString = (parameters) => {
  // abort if the specified `parameters` parameter is not an object
  if ( !utilities.validation.validateType(parameters, Object) ) throw new errors.TypeValidationError('parameters', Object);

  /**
   * The query string generated from the specified parameters
   */
  const queryString = Object.entries(parameters)
    // filter the list to only parameters where …
    .filter(
      ([ key, value ]) => (
        // … the key is a non-empty string …
        utilities.validation.isNonEmptyString(key)
        // … and, the value is a non-empty string
        && utilities.validation.isNonEmptyString(value)
      )
    )
    // project each parameter key / value pair into a string (delimited by “=”)
    .map( ([ key, value ]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}` )
    // concatenate the parameters into a string, delimited by “&”
    .join('&')
  ;

  return queryString;
};


export default generateQueryString;