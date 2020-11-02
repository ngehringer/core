import * as errors from '../errors/index.js';
import * as utilities from '../utilities/index.js';
import REFERENCE from '../REFERENCE/index.js';


class Response {
  static get CLASS_NAME() { return `@backwater-systems/core.infrastructure.${Response.name}`; }

  static error(message) {
    if (
      !utilities.validateType(message, Error)
      && !utilities.validateType(message, String)
    ) throw new errors.TypeValidationError('message', [Error, String]);

    const _message = utilities.validateType(message, Error)
      ? message.message
      : message
    ;

    return new Response({
      'message': _message,
      'status': REFERENCE.ENUM.ResponseStatus.ERROR
    });
  }

  static ok(message) {
    if ( !utilities.validateType(message, String) ) throw new errors.TypeValidationError('message', String);

    return new Response({
      'message': message,
      'status': REFERENCE.ENUM.ResponseStatus.OK
    });
  }

  static warning(message) {
    if (
      !utilities.validateType(message, Error)
      && !utilities.validateType(message, String)
    ) throw new errors.TypeValidationError('message', [Error, String]);

    const _message = utilities.validateType(message, Error)
      ? message.message
      : message
    ;

    return new Response({
      'message': _message,
      'status': REFERENCE.ENUM.ResponseStatus.WARNING
    });
  }

  constructor({
    message,
    status
  }) {
    this.id = utilities.generateUUID();
    this.time = new Date();

    this.message = utilities.validateType(message, String)
      ? message
      : null
    ;

    this.status = utilities.validateEnumeration(status, REFERENCE.ENUM.ResponseStatus)
      ? status
      : REFERENCE.ENUM.ResponseStatus.UNKNOWN
    ;
  }
}


export default Response;