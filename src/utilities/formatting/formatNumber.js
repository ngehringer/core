import * as errors from '../../errors/index.js';
import * as validation from '../validation/index.js';
import REFERENCE from '../../REFERENCE/index.js';


const formatNumber = (number) => {
  if (number === null) return REFERENCE.NULL_PLACEHOLDER;

  if ( !validation.validateType(number, Number) ) throw new errors.TypeValidationError('number', Number);

  return number.toLocaleString();
};


export default formatNumber;