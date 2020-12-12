/**
 * Converts the specified `value` parameter to a `Date` object.
 */
const convertToDate = (value) => (
  (
    (typeof value === 'object')
    && (value instanceof Date)
  )
    ? value
    : new Date(value)
);


export default convertToDate;