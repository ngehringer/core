import * as errors from '../errors/index.js';
import REFERENCE from '../REFERENCE/index.js';
import validateType from './validateType.js';


const formatNumber = (number) => {
  if (number === null) return REFERENCE.NULL_PLACEHOLDER;

  if ( !validateType(number, Number) ) throw new errors.TypeValidationError('number', Number);

  return number.toLocaleString();
};


export default formatNumber;