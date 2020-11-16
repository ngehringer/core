class EnumerationValidationError extends Error {
  constructor(valueName, enumerationName, ...rest) {
    super(...rest);

    // define the error’s name
    this.name = EnumerationValidationError.name;

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
    return `The specified${(this.valueName === null) ? '' : ` “${this.valueName}”`} value is an invalid${(this.enumerationName === null) ? '' : ` “${this.enumerationName}”`} enumeration item.`;
  }
}


export default EnumerationValidationError;