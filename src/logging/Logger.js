import * as utilities from '../utilities/index.js';
import REFERENCE from './REFERENCE.js';


class Logger {
  static get DEFAULTS() {
    return Object.freeze({
      LOG_LEVEL: REFERENCE.ENUMERATIONS.LOG_LEVEL.UNKNOWN,
      VERBOSE: false
    });
  }

  static _formatMessage(logLevel, text, processID) {
    const _logLevel = utilities.validateEnumeration(logLevel, REFERENCE.ENUMERATIONS.LOG_LEVEL)
      ? logLevel
      : Logger.DEFAULTS.LOG_LEVEL
    ;

    const _text = utilities.validateType(text, String)
      ? text
      : null
    ;

    const _processID = utilities.isNonEmptyString(processID)
      ? processID
      : null
    ;

    const dateString = new Date().toISOString();

    const logMessage = `[${dateString}] {${_logLevel}${(_processID === null) ? '' : `|${_processID}`}} ${(_text === null) ? '[null]' : _text}`;

    return logMessage;
  }

  static _log(message) {
    // write the message to the console
    console.log(message);
  }

  static _logInternalError(error) {
    const date = new Date().toISOString();

    const message = utilities.validateType(error, Error)
      ? `“${error.message}”`
      : '[null]'
    ;

    const stack = utilities.validateType(error, Error)
      ? `\n${error.stack}`
      : ''
    ;

    // output logging errors to the console
    console.log(`[${date}] {${REFERENCE.ENUMERATIONS.LOG_LEVEL.CRITICAL_ERROR}|@backwater-systems/core.logging.${Logger.name}} ${message}${stack}`);
  }

  static _tryLog({
    logLevel,
    logItem,
    processID,
    verbose
  }) {
    try {
      // determine if verbose logging is enabled (default: false)
      const _verbose = utilities.validateType(verbose, Boolean)
        ? verbose
        : Logger.DEFAULTS.VERBOSE
      ;

      // set the log message to …
      let message = null;
      // … string: the content
      if ( utilities.validateType(logItem, String) ) {
        message = logItem;
      }
      // … error: …
      else if ( utilities.validateType(logItem, Error) ) {
        message = _verbose
          // … (verbose) the error type name, message, and stack trace
          ? `(${logItem.name}) ${logItem.message}${utilities.isNonEmptyString(logItem.stack) ? `\n${logItem.stack}` : ''}`
          // … (non-verbose) the error message
          : logItem.message
        ;
      }

      // format the log message
      message = Logger._formatMessage(logLevel, message, processID);

      // log the message
      Logger._log(message);
    }
    catch (error) {
      Logger._logInternalError(error);
    }
  }

  static logCriticalError(
    logItem,
    processID,
    verbose = Logger.DEFAULTS.VERBOSE
  ) {
    Logger._tryLog({
      'logItem': logItem,
      'logLevel': REFERENCE.ENUMERATIONS.LOG_LEVEL.CRITICAL_ERROR,
      'processID': processID,
      'verbose': verbose
    });
  }

  static logDebug(
    logItem,
    processID,
    verbose = Logger.DEFAULTS.VERBOSE
  ) {
    Logger._tryLog({
      'logItem': logItem,
      'logLevel': REFERENCE.ENUMERATIONS.LOG_LEVEL.DEBUG,
      'processID': processID,
      'verbose': verbose
    });
  }

  static logError(
    logItem,
    processID,
    verbose = Logger.DEFAULTS.VERBOSE
  ) {
    Logger._tryLog({
      'logItem': logItem,
      'logLevel': REFERENCE.ENUMERATIONS.LOG_LEVEL.ERROR,
      'processID': processID,
      'verbose': verbose
    });
  }

  static logInfo(
    logItem,
    processID,
    verbose = Logger.DEFAULTS.VERBOSE
  ) {
    Logger._tryLog({
      'logItem': logItem,
      'logLevel': REFERENCE.ENUMERATIONS.LOG_LEVEL.INFO,
      'processID': processID,
      'verbose': verbose
    });
  }

  static logWarning(
    logItem,
    processID,
    verbose = Logger.DEFAULTS.VERBOSE
  ) {
    Logger._tryLog({
      'logItem': logItem,
      'logLevel': REFERENCE.ENUMERATIONS.LOG_LEVEL.WARNING,
      'processID': processID,
      'verbose': verbose
    });
  }
}


export default Logger;