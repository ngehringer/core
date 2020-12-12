class EnumerationValidationError extends Error {
  constructor(valueName, enumerationName, ...rest) {
    super(...rest);

    /**
     * The error name
     */
    this.name = EnumerationValidationError.name;

    /**
     * The enumeration’s name
     */
    this.enumerationName = (
      (typeof enumerationName === 'string')
      && (enumerationName !== '')
    )
      ? enumerationName
      : null
    ;

    /**
     * The invalid value’s name
     */
    this.valueName = (
      (typeof valueName === 'string')
      && (valueName !== '')
    )
      ? valueName
      : null
    ;

    /**
     * The error message
     */
    this.message = `The specified${(this.valueName === null) ? '' : ` “${this.valueName}”`} value is an invalid${(this.enumerationName === null) ? '' : ` “${this.enumerationName}”`} enumeration item.`;
  }
}


export default EnumerationValidationError;