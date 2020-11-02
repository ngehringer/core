import validateType from './validateType.js';


const validateEnumeration = (value, enumeration) => {
  if ( !validateType(enumeration, Object) ) throw new Error('‘enumeration’ is not an “object”.');

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