import * as validation from '../validation/index.js';


/**
 * Converts the specified `value` parameter to a `Number` object.
 */
const convertToNumber = (value) => {
  if ( validation.isNumber(value) ) {
    return (
      (typeof value === 'number')
      || (value instanceof Number)
    )
      ? value
      : Number(value)
    ;
  }

  return null;
};


export default convertToNumber;