import * as utilities from '../utilities/index.js';


class Response {
  static get CLASS_NAME() { return `@backwater-systems/core.infrastructure.${Response.name}`; }

  static get DEFAULTS() {
    return Object.freeze({
      MESSAGE: null,
      STATUS: Response.REFERENCE.ENUMERATIONS.RESPONSE_STATUS.UNKNOWN
    });
  }

  static get REFERENCE() {
    return Object.freeze({
      ENUMERATIONS: Object.freeze({
        RESPONSE_STATUS: Object.freeze({
          ERROR: 'ERROR',
          OK: 'OK',
          UNKNOWN: 'UNKNOWN',
          WARNING: 'WARNING'
        })
      })
    });
  }

  static error(message) {
    return new Response({
      message: message,
      status: Response.REFERENCE.ENUMERATIONS.RESPONSE_STATUS.ERROR
    });
  }

  static ok(message) {
    return new Response({
      message: message,
      status: Response.REFERENCE.ENUMERATIONS.RESPONSE_STATUS.OK
    });
  }

  static warning(message) {
    return new Response({
      message: message,
      status: Response.REFERENCE.ENUMERATIONS.RESPONSE_STATUS.WARNING
    });
  }

  constructor({
    message = Response.DEFAULTS.MESSAGE,
    status = Response.DEFAULTS.STATUS
  }) {
    this.id = utilities.generateUUID();
    this.time = new Date();

    if ( utilities.validation.validateType(message, Error) ) {
      this.message = message.message;
    }
    else if ( utilities.validation.validateType(message, String) ) {
      this.message = message;
    }
    else {
      this.message = Response.DEFAULTS.MESSAGE;
    }

    this.status = utilities.validation.validateEnumeration(status, Response.REFERENCE.ENUMERATIONS.RESPONSE_STATUS)
      ? status
      : Response.DEFAULTS.STATUS
    ;
  }
}


export default Response;