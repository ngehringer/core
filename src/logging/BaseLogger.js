import * as errors from '../errors/index.js';
import * as utilities from '../utilities/index.js';
import LogItem from './LogItem.js';
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
    /**
     * An ISO 8601–compliant timestamp of when the error occurred
     */
    const timestamp = new Date().toISOString();

    /**
     * The stack trace of the error
     */
    const stack = (
      (typeof error.stack === 'string')
      && utilities.validation.isNonEmptyString(error.stack)
    )
      ? `\n${error.stack}`
      : ''
    ;

    // write a message describing the error to the console
    console.log(`[${timestamp}] {${REFERENCE.ENUMERATIONS.LOG_LEVEL.CRITICAL_ERROR}|${this.CLASS_NAME}} ${error.message}${stack}`);
  }

  static log({
    data,
    logLevel = BaseLogger.DEFAULTS.LOG_LEVEL,
    sourceID = BaseLogger.DEFAULTS.SOURCE_ID,
    verbose = BaseLogger.DEFAULTS.VERBOSE
  }) {
    // abort if the extending class does not implement a `_log` function
    if (typeof this._log !== 'function') throw new errors.ImplementationError('_log', this.CLASS_NAME);

    try {
      /**
       * A `LogItem` constructed with the specified parameters
       */
      const logItem = new LogItem({
        data: data,
        logLevel: logLevel,
        sourceID: sourceID,
        verbose: verbose
      });

      // invoke the extending class’s `_log` function with the log item as its parameter
      this._log(logItem);
    }
    catch (error) {
      this._logInternalError(error);
    }
  }

  static logCriticalError({ ...rest }) {
    this.log({
      logLevel: REFERENCE.ENUMERATIONS.LOG_LEVEL.CRITICAL_ERROR,
      ...rest
    });
  }

  static logDebug({ ...rest }) {
    this.log({
      logLevel: REFERENCE.ENUMERATIONS.LOG_LEVEL.DEBUG,
      ...rest
    });
  }

  static logError({ ...rest }) {
    this.log({
      logLevel: REFERENCE.ENUMERATIONS.LOG_LEVEL.ERROR,
      ...rest
    });
  }

  static logInfo({ ...rest }) {
    this.log({
      logLevel: REFERENCE.ENUMERATIONS.LOG_LEVEL.INFO,
      ...rest
    });
  }

  static logWarning({ ...rest }) {
    this.log({
      logLevel: REFERENCE.ENUMERATIONS.LOG_LEVEL.WARNING,
      ...rest
    });
  }
}


export default BaseLogger;