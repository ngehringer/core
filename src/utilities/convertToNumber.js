import isNumber from './isNumber.js';


const convertToNumber = (value) => {
  if ( isNumber(value) ) {
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