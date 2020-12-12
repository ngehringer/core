import * as errors from '../../errors/index.js';


/**
 * Determines whether the `instance` parameter is an instance of the `type` parameter.
 */
const validateType = (instance, type) => {
  if (typeof type !== 'function') throw new errors.TypeValidationError('type', Function);

  return (
    // Function | Object: check the prototype chain for inheritance
    (instance instanceof type)
    // special handling for primitive types that have wrapper classes …
    || (
      // … BigInt
      (
        (typeof instance === 'bigint')
        && (type === BigInt)
      )
      // … Boolean
      || (
        (typeof instance === 'boolean')
        && (type === Boolean)
      )
      // … Number
      || (
        (typeof instance === 'number')
        && (type === Number)
      )
      // … String
      || (
        (typeof instance === 'string')
        && (type === String)
      )
      // … Symbol
      || (
        (typeof instance === 'symbol')
        && (type === Symbol)
      )
    )
  );
};


export default validateType;