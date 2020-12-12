import * as validation from '../validation/index.js';

/**
 * Converts the specified `value` parameter to a `Date` object.
 */
const convertToDate = (value) => (
  validation.validateType(value, Date)
    ? value
    : new Date(value)
);


export default convertToDate;