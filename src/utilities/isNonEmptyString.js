import validateType from './validateType.js';


const isNonEmptyString = (value) => (
  validateType(value, String)
  && (value !== '')
);


export default isNonEmptyString;