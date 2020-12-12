class InvalidParameterValueError extends Error {
  constructor(
    {
      parameterName = null,
      reason = null
    } = {},
    ...rest
  ) {
    super(...rest);

    /**
     * The error name
     */
    this.name = InvalidParameterValueError.name;

    /**
      * The name of the invalid parameter (or `null`)
      */
    this.parameterName = (
      (typeof parameterName === 'string')
      && (parameterName !== '')
    )
      ? parameterName
      : null
    ;

    /**
     * The reason describing why the parameter is invalid (or `null`)
     */
    this.reason = (
      (typeof reason === 'string')
      && (reason !== '')
    )
      ? reason
      : null
    ;

    /**
     * The error message
     */
    this.message = `Invalid${(this.parameterName === null) ? '' : ` “${this.parameterName}”`} parameter value specified${(this.reason === null) ? '' : `: ${this.reason}`}.`;
  }
}


export default InvalidParameterValueError;