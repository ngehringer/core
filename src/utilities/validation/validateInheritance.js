import * as errors from '../../errors/index.js';
import validateType from './validateType.js';


const validateInheritance = (child, parent) => {
  if ( !validateType(child, Object) ) throw new errors.TypeValidationError('child', Function);
  if ( !validateType(parent, Object) ) throw new errors.TypeValidationError('parent', Function);

  return Object.prototype.isPrototypeOf.call(parent, child);
};


export default validateInheritance;