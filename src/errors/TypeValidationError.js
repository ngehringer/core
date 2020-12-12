class TypeValidationError extends Error {
  constructor(variableName, type, ...rest) {
    super(...rest);

    /**
     * The error name
     */
    this.name = TypeValidationError.name;

    // abort if the specified type parameter is not …
    if (
      !(
        // … a function, or …
        (typeof type === 'function')
        // … an array of functions
        || (
          Array.isArray(type)
          && (type.length > 0)
          && type.every(
            (_type) => (typeof _type === 'function')
          )
        )
      )
    ) throw new Error('Invalid “type” parameter value specified: must be an “object”, “function”, or array of { “object” | “function” }.');

    /**
     * The name of the variable that is an invalid type (or `null`)
     */
    this.variableName = (
      (typeof variableName === 'string')
      && (variableName !== '')
    )
      ? variableName
      : null
    ;

    /**
     * The list of names of valid types
     */
    this.typeNameList = (
      Array.isArray(type)
        ? type
        : [ type ]
    ).map(
      (_type) => {
        if (
          (typeof _type.CLASS_NAME === 'string')
          && (_type.CLASS_NAME !== '')
        ) return _type.CLASS_NAME;

        return _type.name;
      }
    );

    /**
     * The error name
     */
    this.message = `Variable${(this.variableName === null) ? '' : ` “${this.variableName}”`} is not a valid ${this.typeNameList.map( (typeName) => `“${typeName}”` ).join(' | ')}.`;
  }
}


export default TypeValidationError;