import * as utilities from '../utilities/index.js';
import REFERENCE from './REFERENCE.js';


class LogItem {
  static get CLASS_NAME() { return `@backwater-systems/core.logging.${LogItem.name}`; }

  static get DEFAULTS() {
    return Object.freeze({
      LOG_LEVEL: REFERENCE.ENUMERATIONS.LOG_LEVEL.UNKNOWN,
      MESSAGE: null,
      SOURCE_ID: null,
      VERBOSE: false
    });
  }

  constructor({
    data,
    logLevel = LogItem.DEFAULTS.LOG_LEVEL,
    sourceID = LogItem.DEFAULTS.SOURCE_ID,
    verbose = LogItem.DEFAULTS.VERBOSE
  }) {
    /**
     * The timestamp of the log item
     */
    this.time = new Date();

    /**
     * The data of the log item
     */
    this.data = data;

    /**
     * The log level of the log item
     */
    this.logLevel = utilities.validation.validateEnumeration(logLevel, REFERENCE.ENUMERATIONS.LOG_LEVEL)
      ? logLevel
      : LogItem.DEFAULTS.LOG_LEVEL
    ;

    /**
     * The source ID of the log item
     */
    this.sourceID = utilities.validation.isNonEmptyString(sourceID)
      ? sourceID
      : null
    ;

    // define the log message – depending on the type of the logged data – as …
    // … string: itself
    if ( utilities.validation.validateType(data, String) ) {
      /**
       * The message of the log item
       */
      this.message = data;
    }
    // … Error: …
    else if ( utilities.validation.validateType(data, Error) ) {
      this.message = verbose
        // … (verbose) the error type name, message, and stack trace
        ? `(${data.name}) ${data.message}${utilities.validation.isNonEmptyString(data.stack) ? `\n${data.stack}` : ''}`
        // … (non-verbose) the error message
        : `${data.message}`
      ;
    }
    // … object: stringified JSON of the object
    else if ( utilities.validation.validateType(data, Object) ) {
      this.message = JSON.stringify(data);
    }
    else {
      this.message = LogItem.DEFAULTS.MESSAGE;
    }
  }
}


export default LogItem;