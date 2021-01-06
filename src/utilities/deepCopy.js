/**
 * Creates a copy of the specified `entity`, recursively traversing and copying the items of arrays and the properties of objects.
 */
const deepCopy = (entity) => {
  // non-object / null
  if (
    (typeof entity !== 'object')
    || (entity === null)
  ) return entity;

  // array
  if ( Array.isArray(entity) ) {
    return entity.map(
      (item) => deepCopy(item)
    );
  }

  // object
  return Object.fromEntries(
    Object.entries(entity).map(
      ([ key, value ]) => [ key, deepCopy(value) ]
    )
  );
};


export default deepCopy;