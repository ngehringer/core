class ImplementationError extends Error {
  constructor(propertyName, className, ...rest) {
    super(...rest);

    /**
     * The error name
     */
    this.name = ImplementationError.name;

    /**
     * The name of the class (or `null`)
     */
    this.className = (
      (typeof className === 'string')
      && (className !== '')
    )
      ? className
      : null
    ;

    /**
     * The name of the unimplemented property (or `null`)
     */
    this.propertyName = (
      (typeof propertyName === 'string')
      && (propertyName !== '')
    )
      ? propertyName
      : null
    ;

    /**
     * The error message
     */
    this.message = `Class${(this.className === null) ? '' : ` “${this.className}”`} does not implement ${(this.propertyName === null) ? 'a required' : `the required “${this.propertyName}”`} property.`;
  }
}


export default ImplementationError;