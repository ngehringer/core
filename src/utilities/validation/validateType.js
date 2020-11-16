const validateType = (instance, type) => {
  if (typeof type !== 'function') throw new Error(`‘type’ must be a “${Function.name}”.`);

  return (
    // check the prototype chain for inheritance …
    (instance instanceof type)
    // … with special handling for primitive types that have wrapper classes
    || (
      (
        (typeof instance === 'bigint')
        && (type === BigInt)
      )
      || (
        (typeof instance === 'boolean')
        && (type === Boolean)
      )
      || (
        (typeof instance === 'function')
        && (type === Function)
      )
      || (
        (typeof instance === 'number')
        && (type === Number)
      )
      || (
        (typeof instance === 'string')
        && (type === String)
      )
      || (
        (typeof instance === 'symbol')
        && (type === Symbol)
      )
    )
  );
};


export default validateType;