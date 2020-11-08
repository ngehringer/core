import isNonEmptyString from './isNonEmptyString.js';
import validateType from './validateType.js';


const isNumber = (value) => {
  let number;
  if ( validateType(value, Number) ) {
    number = value;
  }
  else if ( isNonEmptyString(value) ) {
    // attempt to convert the string value to a number
    number = Number(value);
  }
  else {
    return false;
  }

  // ensure that the value is a finite number
  return (
    !Number.isNaN(number)
    && Number.isFinite(number)
  );
};


export default isNumber;