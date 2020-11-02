import * as logging from '../logging/index.js';
import * as utilities from '../utilities/index.js';


class Base {
  static get CLASS_NAME() { return `@backwater-systems/core.infrastructure.${Base.name}`; }

  static get DEFAULTS() {
    return Object.freeze({
      DEBUG: false
    });
  }

  static get _defaultLogger() {
    return new logging.Logger();
  }

  static _generateUniqueID() {
    return utilities.generateUUID();
  }

  constructor({
    debug = Base.DEFAULTS.DEBUG,
    logger = null
  } = {}) {
    try {
      // initially, assign the process logger to the default instance
      this.logger = this.constructor._defaultLogger;

      // generate a UUID to identify this instance
      this.id = Base._generateUniqueID();

      // reassign the process logger from the default, if one is specified
      if ( utilities.validateType(logger, logging.Logger) ) {
        this.logger = logger;
      }

      // indicate whether debug mode is enabled
      this.debug = utilities.validateType(debug, Boolean)
        ? debug
        : Base.DEFAULTS.DEBUG
      ;
    }
    catch (error) {
      this.logError(error);

      throw error;
    }
  }

  get processID() {
    return `${utilities.isNonEmptyString(this.constructor.CLASS_NAME) ? `${this.constructor.CLASS_NAME}:` : ''}${this.id || '{unknown ID}'}`;
  }

  logDebug(logItem) {
    if (!this.debug) return;

    this.logger.logDebug(logItem, this.debug, this.processID);
  }

  logError(logItem) {
    this.logger.logError(logItem, this.debug, this.processID);
  }

  logInfo(logItem) {
    this.logger.logInfo(logItem, this.debug, this.processID);
  }

  logWarning(logItem) {
    this.logger.logWarning(logItem, this.debug, this.processID);
  }
}


export default Base;