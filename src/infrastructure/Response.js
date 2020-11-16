import * as errors from '../errors/index.js';
import * as utilities from '../utilities/index.js';


class Response {
  static get CLASS_NAME() { return `@backwater-systems/core.infrastructure.${Response.name}`; }

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
    if (
      !utilities.validation.validateType(message, Error)
      && !utilities.validation.validateType(message, String)
    ) throw new errors.TypeValidationError('message', [ Error, String ]);

    const _message = utilities.validation.validateType(message, Error)
      ? message.message
      : message
    ;

    return new Response({
      message: _message,
      status: Response.REFERENCE.ENUMERATIONS.RESPONSE_STATUS.ERROR
    });
  }

  static ok(message) {
    if ( !utilities.validation.validateType(message, String) ) throw new errors.TypeValidationError('message', String);

    return new Response({
      message: message,
      status: Response.REFERENCE.ENUMERATIONS.RESPONSE_STATUS.OK
    });
  }

  static warning(message) {
    if (
      !utilities.validation.validateType(message, Error)
      && !utilities.validation.validateType(message, String)
    ) throw new errors.TypeValidationError('message', [ Error, String ]);

    const _message = utilities.validation.validateType(message, Error)
      ? message.message
      : message
    ;

    return new Response({
      message: _message,
      status: Response.REFERENCE.ENUMERATIONS.RESPONSE_STATUS.WARNING
    });
  }

  constructor({
    message,
    status
  }) {
    this.id = utilities.generateUUID();
    this.time = new Date();

    this.message = utilities.validation.validateType(message, String)
      ? message
      : null
    ;

    this.status = utilities.validation.validateEnumeration(status, Response.REFERENCE.ENUMERATIONS.RESPONSE_STATUS)
      ? status
      : Response.REFERENCE.ENUMERATIONS.RESPONSE_STATUS.UNKNOWN
    ;
  }
}


export default Response;