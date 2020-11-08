import REFERENCE from '../REFERENCE/index.js';


class TypeValidationError extends Error {
  constructor(variableName, type, ...rest) {
    super(...rest);

    // define the error’s name
    this.name = TypeValidationError.name;

    // ensure the specified type parameter is …
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
    ) throw new Error('‘type’ must be an “object”, “function”, or array of { “object” | “function” }.');

    // determine the specified variable name
    this.variableName = (
      (typeof variableName === 'string')
      && (variableName !== '')
    )
      ? variableName
      : null
    ;

    // determine the specified valid type names
    this.typeNameList = (
      Array.isArray(type)
        ? type
        : [type]
    ).map(
      (_type) => {
        if (
          (typeof _type.CLASS_NAME === 'string')
          && (_type.CLASS_NAME !== '')
        ) return _type.CLASS_NAME;

        return _type.name;
      }
    );
  }

  get message() {
    return `‘${this.variableName || REFERENCE.NULL_PLACEHOLDER}’ is not a valid ${this.typeNameList.map( (typeName) => `“${typeName}”` ).join(' | ')}.`;
  }
}


export default TypeValidationError;