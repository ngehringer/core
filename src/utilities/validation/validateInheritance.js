import * as errors from '../../errors/index.js';
import validateType from './validateType.js';


const validateInheritance = (child, parent) => {
  // abort if the `child` parameter is a not an `Object`
  if ( !validateType(child, Object) ) throw new errors.TypeValidationError('child', Object);
  // abort if the `parent` parameter is a not an `Object`
  if ( !validateType(parent, Object) ) throw new errors.TypeValidationError('parent', Object);

  // safely call and return the result of ~ `parent.prototype.isPrototypeOf(child)`
  return Object.prototype.isPrototypeOf.call(parent, child);
};


export default validateInheritance;