class ImplementationError extends Error {
  constructor(propertyName, className, ...rest) {
    super(...rest);

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
    return `${(this.className === null) ? 'Class' : `“${this.className}”`} does not implement ${(this.propertyName === null) ? 'a required' : `the “${this.propertyName}”`} property.`;
  }
}


export default ImplementationError;