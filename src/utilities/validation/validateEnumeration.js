import * as errors from '../../errors/index.js';
import validateType from './validateType.js';


const validateEnumeration = (value, enumeration) => {
  if ( !validateType(enumeration, Object) ) throw new errors.TypeValidationError('enumeration', Object);

  // a valid enumeration value must be a string or a number
  if (
    !validateType(value, String)
    && !validateType(value, Number)
  ) return false;

  return Object.keys(enumeration).some(
    (key) => (enumeration[key] === value)
  );
};


export default validateEnumeration;