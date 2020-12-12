import * as errors from '../../errors/index.js';
import validateType from './validateType.js';


/**
 * Determines whether the specified `value` parameter is contained in the specified `enumeration` parameter.
 */
const validateEnumeration = (value, enumeration) => {
  // abort if the specified enumeration is not an object
  if ( !validateType(enumeration, Object) ) throw new errors.TypeValidationError('enumeration', Object);

  // a valid enumeration value must be a string or a number
  if (
    !validateType(value, String)
    && !validateType(value, Number)
  ) return false;

  // return a boolean indicating whether the enumeration contains a key matching the specified value
  return Object.keys(enumeration).some(
    (key) => (enumeration[key] === value)
  );
};


export default validateEnumeration;