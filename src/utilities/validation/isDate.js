/**
 * Determines whether the `value` parameter is a valid `Date` (i.e., not “Invalid Date”).
 */
const isDate = (value) => (
  // value is a valid date if …
  // … it is a `Date` instance
  (
    (typeof value === 'object')
    && (value instanceof Date)
  )
  // … and, `getTime()` returns a `number` (“Invalid Date” instances will return `NaN`)
  && !Number.isNaN( value.getTime() )
);


export default isDate;