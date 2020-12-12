/**
 * Converts the specified `value` parameter to a `Number` object.
 */
const convertToNumber = (value) => {
  if (
    (typeof value === 'number')
    || (value instanceof Number)
  ) return value;

  return Number(value);
};


export default convertToNumber;