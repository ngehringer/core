import * as errors from '../../errors/index.js';
import REFERENCE from '../../REFERENCE/index.js';


/**
 * Formats the specified `number` parameter as a `string`.
 */
const formatNumber = (number) => {
  if (number === null) return REFERENCE.NULL_PLACEHOLDER;

  if (typeof number !== 'number') throw new errors.TypeValidationError('number', Number);

  return number.toLocaleString();
};


export default formatNumber;