import isNonEmptyString from './isNonEmptyString.js';
import validateType from './validateType.js';


/**
 * Determines whether the `value` parameter (a string value is coerced to a number) is a finite number.
 */
const isNumber = (value) => {
  /**
   * The converted `number`
   */
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

  // determine whether the value is a finite number
  return (
    !Number.isNaN(number)
    && Number.isFinite(number)
  );
};


export default isNumber;