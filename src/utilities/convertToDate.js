import validateType from './validateType.js';


const convertToDate = (value) => {
  return validateType(value, Date)
    ? value
    : new Date(value)
  ;
};


export default convertToDate;