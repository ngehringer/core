import * as errors from '../../errors/index.js';


/**
 * Determines whether the `child` parameter has the `parent` parameter in its prototype chain.
 */
const validateInheritance = (child, parent) => {
  // abort if the specified `child` parameter value is a not a `Function` or `Object`
  if (
    (typeof child !== 'function')
    && (typeof child !== 'object')
  ) throw new errors.TypeValidationError('child', [ Function, Object ]);

  // abort if the specified `parent` parameter value is a not a `Function` or `Object`
  if (
    (typeof parent !== 'function')
    && (typeof parent !== 'object')
  ) throw new errors.TypeValidationError('parent', [ Function, Object ]);

  // safely call and return the result of ~ `parent.prototype.isPrototypeOf(child)`
  return Object.prototype.isPrototypeOf.call(parent, child);
};


export default validateInheritance;