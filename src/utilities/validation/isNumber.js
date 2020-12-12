/**
 * Determines whether the `value` parameter (a string value is coerced to a number) is a finite number.
 */
const isNumber = (value) => {
  /**
   * The converted `number`
   */
  let number;
  if (typeof value === 'number') {
    number = value;
  }
  else if (
    (typeof value === 'string')
    && (value !== '')
  ) {
    // attempt to convert the string value to a number
    number = Number(value);
  }
  else {
    return false;
  }

  // the value is a finite number if …
  return (
    // … it is not `NaN` …
    !Number.isNaN(number)
    // … and, is finite
    && Number.isFinite(number)
  );
};


export default isNumber;