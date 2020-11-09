import * as validation from '../validation/index.js';


const convertToDate = (value) => (
  validation.validateType(value, Date)
    ? value
    : new Date(value)
);


export default convertToDate;