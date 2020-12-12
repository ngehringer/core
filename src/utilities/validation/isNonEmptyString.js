/**
 * Determines whether the `value` parameter is a non-empty string.
 */
const isNonEmptyString = (value) => (
  (typeof value === 'string')
  && (value !== '')
);


export default isNonEmptyString;