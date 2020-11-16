class ImplementationError extends Error {
  constructor(propertyName, className, ...rest) {
    super(...rest);

    // define the error’s name
    this.name = ImplementationError.name;

    this.className = (
      (typeof className === 'string')
      && (className !== '')
    )
      ? className
      : null
    ;

    this.propertyName = (
      (typeof propertyName === 'string')
      && (propertyName !== '')
    )
      ? propertyName
      : null
    ;
  }

  get message() {
    return `Class${(this.className === null) ? '' : ` “${this.className}”`} does not implement ${(this.propertyName === null) ? 'a required' : `the required “${this.propertyName}”`} property.`;
  }
}


export default ImplementationError;