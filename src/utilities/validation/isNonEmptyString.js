import validateType from './validateType.js';


/**
 * Determines whether the `value` parameter is a non-empty string.
 */
const isNonEmptyString = (value) => (
  validateType(value, String)
  && (value !== '')
);


export default isNonEmptyString;