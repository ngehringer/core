import * as logging from '../logging/index.js';
import * as utilities from '../utilities/index.js';


class Base {
  static get CLASS_NAME() { return `@backwater-systems/core.infrastructure.${Base.name}`; }

  static get DEFAULTS() {
    return Object.freeze({
      DEBUG: false,
      LOGGER: logging.ConsoleLogger
    });
  }

  static _generateUniqueID() {
    return utilities.generateUUID();
  }

  constructor({
    debug = Base.DEFAULTS.DEBUG,
    logger = Base.DEFAULTS.LOGGER
  } = {}) {
    try {
      // initially, assign the process logger to the default instance to ensure logging works as soon as possible
      this.logger = Base.DEFAULTS.LOGGER;

      // generate a UUID to identify this instance
      this.id = Base._generateUniqueID();

      // define whether debug mode is enabled
      this.debug = utilities.validation.validateType(debug, Boolean)
        ? debug
        : Base.DEFAULTS.DEBUG
      ;

      // if specified, reassign the process logger from the default
      if ( utilities.validation.validateInheritance(logger, logging.BaseLogger) ) {
        this.logger = logger;
      }
    }
    catch (error) {
      this.logError(error);

      throw error;
    }
  }

  get processID() {
    return `${utilities.validation.isNonEmptyString(this.constructor.CLASS_NAME) ? `${this.constructor.CLASS_NAME}:` : ''}${this.id || '{unknown ID}'}`;
  }

  logCriticalError(data) {
    this.logger.logCriticalError({
      'data': data,
      'sourceID': this.processID,
      'verbose': this.debug
    });
  }

  logDebug(data) {
    // abort if debug mode is not enabled
    if (!this.debug) return;

    this.logger.logDebug({
      'data': data,
      'sourceID': this.processID,
      'verbose': this.debug
    });
  }

  logError(data) {
    this.logger.logError({
      'data': data,
      'sourceID': this.processID,
      'verbose': this.debug
    });
  }

  logInfo(data) {
    this.logger.logInfo({
      'data': data,
      'sourceID': this.processID,
      'verbose': this.debug
    });
  }

  logWarning(data) {
    this.logger.log({
      'data': data,
      'logLevel': logging.REFERENCE.ENUMERATIONS.LOG_LEVEL.WARNING,
      'sourceID': this.processID,
      'verbose': this.debug
    });
  }
}


export default Base;