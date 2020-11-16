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

    // define the error name
    this.name = HTTPResponseError.name;

    // define the HTTP method
    this.method = (
      (typeof method === 'string')
      && (method !== '')
    )
      ? method
      : null
    ;

    // define the HTTP response
    this.response = (
      (typeof response === 'object')
      && (
        (typeof Response === 'object')
        && (response instanceof Response)
      )
    )
      ? response
      : null
    ;

    // define the HTTP status code of the response
    if (
      (typeof statusCode !== 'number')
      || !Number.isInteger(statusCode)
      || (statusCode < 100)
      || (statusCode > 599)
    ) throw new Error('Invalid “statusCode” parameter value specified: must be an integer between 100 and 599.');
    this.statusCode = statusCode;

    // define the HTTP status reason phrase of the response
    this.statusReasonPhrase = (
      (typeof statusReasonPhrase === 'string')
      && (statusReasonPhrase !== '')
    )
      ? statusReasonPhrase
      : null
    ;

    // define the request url
    if (
      (typeof url !== 'string')
      || (url === '')
    ) throw new Error('Invalid “url” parameter value specified.');
    this.url = url;
  }

  get message() {
    return `Error fetching ${
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