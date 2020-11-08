import * as utilities from '../utilities/index.js';
import REFERENCE from './REFERENCE.js';


class BaseLogger {
  static get CLASS_NAME() { return `@backwater-systems/core.logging.${BaseLogger.name}`; }

  static get DEFAULTS() {
    return Object.freeze({
      LOG_LEVEL: REFERENCE.ENUMERATIONS.LOG_LEVEL.UNKNOWN,
      SOURCE_ID: null,
      VERBOSE: false
    });
  }

  static _logInternalError(error) {
    // define an ISO 8601–compliant timestamp for the error
    const timestamp = new Date().toISOString();

    // define the message
    const message = utilities.validation.validateType(error, Error)
      ? `“${error.message}”`
      : '[null]'
    ;

    // extract the stack from the error
    const stack = utilities.validation.validateType(error, Error)
      ? `\n${error.stack}`
      : ''
    ;

    // write a message describing the error to the console
    console.log(`[${timestamp}] {${REFERENCE.ENUMERATIONS.LOG_LEVEL.CRITICAL_ERROR}|@backwater-systems/core.logging.${BaseLogger.name}} ${message}${stack}`);
  }

  static _getLogItem({
    data,
    logLevel = BaseLogger.DEFAULTS.LOG_LEVEL,
    sourceID = BaseLogger.DEFAULTS.SOURCE_ID,
    verbose = BaseLogger.DEFAULTS.VERBOSE
  }) {
    // define the date and time of the log item
    const time = new Date();

    // validate and define the log level of the log item
    const _logLevel = utilities.validation.validateEnumeration(logLevel, REFERENCE.ENUMERATIONS.LOG_LEVEL)
      ? logLevel
      : BaseLogger.DEFAULTS.LOG_LEVEL
    ;

    // validate and define the source ID of the log item
    const _sourceID = utilities.validation.isNonEmptyString(sourceID)
      ? sourceID
      : null
    ;

    // determine if verbose logging is enabled (default: false)
    const _verbose = utilities.validation.validateType(verbose, Boolean)
      ? verbose
      : BaseLogger.DEFAULTS.VERBOSE
    ;

    // define the log message – depending on the type of the logged data – as …
    let message = null;
    // … string: itself
    if ( utilities.validation.validateType(data, String) ) {
      message = data;
    }
    // … object: stringified JSON of the object
    else if ( utilities.validation.validateType(data, Object) ) {
      message = JSON.stringify(data);
    }
    // … Error: …
    else if ( utilities.validation.validateType(data, Error) ) {
      message = _verbose
        // … (verbose) the error type name, message, and stack trace
        ? `(${data.name}) ${data.message}${utilities.validation.isNonEmptyString(data.stack) ? `\n${data.stack}` : ''}`
        // … (non-verbose) the error message
        : data.message
      ;
    }

    return {
      'data': data,
      'logLevel': _logLevel,
      'message': message,
      'sourceID': _sourceID,
      'time': time
    };
  }

  static logCriticalError({ ...rest }) {
    this.log({
      'logLevel': REFERENCE.ENUMERATIONS.LOG_LEVEL.CRITICAL_ERROR,
      ...rest
    });
  }

  static logDebug({ ...rest }) {
    this.log({
      'logLevel': REFERENCE.ENUMERATIONS.LOG_LEVEL.DEBUG,
      ...rest
    });
  }

  static logError({ ...rest }) {
    this.log({
      'logLevel': REFERENCE.ENUMERATIONS.LOG_LEVEL.ERROR,
      ...rest
    });
  }

  static logInfo({ ...rest }) {
    this.log({
      'logLevel': REFERENCE.ENUMERATIONS.LOG_LEVEL.INFO,
      ...rest
    });
  }

  static logWarning({ ...rest }) {
    this.log({
      'logLevel': REFERENCE.ENUMERATIONS.LOG_LEVEL.WARNING,
      ...rest
    });
  }
}


export default BaseLogger;