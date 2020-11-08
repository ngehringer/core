const validateType = (instance, type) => {
  if (
    (typeof type === 'undefined')
    || (type === null)
  ) throw new Error('‘type’ cannot be “undefined” or “null”.');

  // special handling for primitive types that have wrapper classes
  if (type === Boolean) {
    return ( (typeof instance === 'boolean') || (instance instanceof type) );
  }
  else if (type === Function) {
    return ( (typeof instance === 'function') || (instance instanceof type) );
  }
  else if (type === Number) {
    return ( (typeof instance === 'number') || (instance instanceof type) );
  }
  else if (type === String) {
    return ( (typeof instance === 'string') || (instance instanceof type) );
  }

  // Object: check the prototype chain for inheritance
  return (instance instanceof type);
};


export default validateType;