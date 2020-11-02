import REFERENCE from '../REFERENCE/index.js';


class EnumerationValidationError extends Error {
  constructor(valueName, enumerationName, ...rest) {
    super(...rest);

    // define the enumeration’s name
    this.enumerationName = (
      (typeof enumerationName === 'string')
      && (enumerationName !== '')
    )
      ? enumerationName
      : null
    ;

    // define the value’s name
    this.valueName = (
      (typeof valueName === 'string')
      && (valueName !== '')
    )
      ? valueName
      : null
    ;
  }

  get message() {
    return `The value of ‘${this.valueName || REFERENCE.NULL_PLACEHOLDER}’ is an invalid ${(this.enumerationName === null) ? '' : `“${this.enumerationName}” `}enumeration item.`;
  }
}


export default EnumerationValidationError;