class InvalidParameterValueError extends Error {
  constructor(
    {
      parameterName = null,
      reason = null
    } = {},
    ...rest
  ) {
    super(...rest);

    /** the error name */
    this.name = InvalidParameterValueError.name;

    /** the name of the invalid parameter (or null) */
    this.parameterName = (
      (typeof parameterName === 'string')
      && (parameterName !== '')
    )
      ? parameterName
      : null
    ;

    /** the reason describing why the parameter is invalid (or null) */
    this.reason = (
      (typeof reason === 'string')
      && (reason !== '')
    )
      ? reason
      : null
    ;

    /** the error message */
    this.message = `Invalid${(this.parameterName === null) ? '' : ` “${this.parameterName}”`} parameter value specified${(this.reason === null) ? '' : `: ${this.reason}`}.`;
  }
}


export default InvalidParameterValueError;