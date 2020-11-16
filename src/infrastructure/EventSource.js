import * as errors from '../errors/index.js';
import * as logging from '../logging/index.js';
import * as utilities from '../utilities/index.js';


class EventSource {
  static get CLASS_NAME() { return `@backwater-systems/core.infrastructure.${EventSource.name}`; }

  static get DEFAULTS() {
    return Object.freeze({
      DEBUG: false,
      LOGGER: logging.ConsoleLogger
    });
  }

  constructor({
    debug = EventSource.DEFAULTS.DEBUG,
    logger = EventSource.DEFAULTS.LOGGER
  }) {
    /**
     * Indicates if debug mode is enabled
     * @type {boolean}
     * @default false
     */
    this.debug = utilities.validation.validateType(debug, Boolean)
      ? debug
      : EventSource.DEFAULTS.DEBUG
    ;

    /**
     * A UUID that identifies this event source
     * @type {string}
     */
    this.id = utilities.generateUUID();

    /**
     * The process logger
     */
    this.logger = utilities.validation.validateInheritance(logger, logging.BaseLogger)
      ? logger
      : EventSource.DEFAULTS.LOGGER
    ;

    /**
     * A list of the registered event handlers, grouped by event type
     * @type {Object}
     */
    this.eventHandlerRegister = {};
  }

  get _processID() {
    return `${this.constructor.CLASS_NAME}::${this.id}`;
  }

  registerEventHandler(eventType, eventHandler) {
    // ensure the specified event type is valid
    if ( !utilities.validation.isNonEmptyString(eventType) ) throw new errors.TypeValidationError('eventType', String);

    // ensure the specified event handler is valid
    if ( !utilities.validation.validateType(eventHandler, Function) ) throw new errors.TypeValidationError('eventHandler', Function);

    // create the event type’s handler list, if necessary
    if ( !Array.isArray(this.eventHandlerRegister[eventType]) ) {
      this.eventHandlerRegister[eventType] = [];
    }
    const eventHandlerList = this.eventHandlerRegister[eventType];

    // ensure the specified handler is not already registered for the specified event type
    if (eventHandlerList.indexOf(eventHandler) !== -1) throw new Error(`The specified handler is already registered for “${eventType}” events.`);

    // add the handler to the register for the specified event type
    eventHandlerList.push(eventHandler);
  }

  async sendEvent(eventType, ...rest) {
    // ensure the specified event type is valid
    if ( !utilities.validation.isNonEmptyString(eventType) ) throw new errors.TypeValidationError('eventType', String);

    const eventHandlerList = Array.isArray(this.eventHandlerRegister[eventType])
      ? this.eventHandlerRegister[eventType]
      : []
    ;

    if (this.debug) {
      this.logger.logDebug({
        data: {
          eventType: eventType,
          registeredHandlerCount: eventHandlerList.length
        },
        sourceID: this._processID,
        verbose: this.debug
      });
    }

    // abort if there are no registered event handlers
    if (eventHandlerList.length === 0) {
      this.logger.logWarning({
        data: `No handlers are registered for “${eventType}” events.`,
        sourceID: this._processID,
        verbose: this.debug
      });

      return;
    }

    // execute the event handlers (serially)
    for (const eventHandler of eventHandlerList) {
      try {
        await eventHandler(...rest);
      }
      catch (error) {
        this.logger.logError({
          data: error,
          sourceID: this._processID,
          verbose: this.debug
        });
      }
    }
  }

  unregisterEventHandler(eventType, eventHandler) {
    // ensure the specified event type is valid
    if ( !utilities.validation.isNonEmptyString(eventType) ) throw new errors.TypeValidationError('eventType', String);

    // ensure the specified event handler is valid
    if ( !utilities.validation.validateType(eventHandler, Function) ) throw new errors.TypeValidationError('eventHandler', Function);

    const eventHandlerList = this.eventHandlerRegister[eventType];
    if ( Array.isArray(eventHandlerList) ) {
      // attempt to locate the specified event handler in the register
      const index = eventHandlerList.indexOf(eventHandler);

      // ensure the specified event handler is registered for the specified event type
      if (index === -1) throw new Error(`The specified handler is not registered for “${eventType}” events.`);

      // remove the handler from the register for the specified event type
      eventHandlerList.splice(index, 1);
    }
  }
}


export default EventSource;