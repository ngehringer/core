class HTTPResponseError extends Error {
  constructor(
    {
      method,
      response = null,
      statusCode,
      statusReasonPhrase,
      url
    },
    ...rest
  ) {
    super(...rest);

    /**
     * The error name
     */
    this.name = HTTPResponseError.name;

    /**
     * The HTTP method of the request
     */
    this.method = (
      (typeof method === 'string')
      && (method !== '')
    )
      ? method
      : null
    ;

    /**
     * The HTTP response
     */
    this.response = (
      (typeof response === 'object')
      && (
        (typeof Response === 'function')
        && (response instanceof Response)
      )
    )
      ? response
      : null
    ;

    // abort if the specified `statusCode` parameter value is invalid
    if (
      (typeof statusCode !== 'number')
      || !Number.isInteger(statusCode)
      || (statusCode < 100)
      || (statusCode > 599)
    ) throw new Error('Invalid “statusCode” parameter value specified: must be an integer between 100 and 599.');

    /**
     * The HTTP status code of the response
     */
    this.statusCode = statusCode;

    /**
     * The HTTP status reason phrase of the response (or `null`)
     */
    this.statusReasonPhrase = (
      (typeof statusReasonPhrase === 'string')
      && (statusReasonPhrase !== '')
    )
      ? statusReasonPhrase
      : null
    ;

    // abort if the specified `url` parameter value is invalid
    if (
      (typeof url !== 'string')
      || (url === '')
    ) throw new Error('Invalid “url” parameter value specified.');

    /**
     * The URL of the request
     */
    this.url = url;

    /**
     * The error message
     */
    this.message = `Error fetching ${
      (this.method === null)
        ? ''
        : `(${this.method}) `
    }“${this.url}”: ${this.statusCode}${
      (this.statusReasonPhrase === null)
        ? ''
        : ` ${this.statusReasonPhrase}`
    }`;
  }
}


export default HTTPResponseError;