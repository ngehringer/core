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
  } = {}) {
    /**
     * Whether debug mode is enabled
     * @default false
     */
    this.debug = (typeof debug === 'boolean')
      ? debug
      : EventSource.DEFAULTS.DEBUG
    ;

    /**
     * A UUID that identifies this event source
     */
    this.id = utilities.generateUUID();

    /**
     * The module’s logger
     */
    this.logger = (
      (typeof logger === 'function')
      && utilities.validation.validateInheritance(logger, logging.BaseLogger)
    )
      ? logger
      : EventSource.DEFAULTS.LOGGER
    ;

    /**
     * A dictionary of registered event handlers (key: event type name; value: event handler function list)
     */
    this.eventHandlerRegister = {};
  }

  get _processID() {
    return `${this.constructor.CLASS_NAME}::${this.id}`;
  }

  registerEventHandler(eventType, eventHandler) {
    // abort if the specified `eventType` parameter value is invalid
    if (
      (typeof eventType !== 'string')
      || !utilities.validation.isNonEmptyString(eventType)
    ) throw new errors.TypeValidationError('eventType', String);

    // abort if the specified `eventHandler` parameter value is invalid
    if (typeof eventHandler !== 'function') throw new errors.TypeValidationError('eventHandler', Function);

    // create the event type’s handler list in the registry, if necessary
    if ( !Array.isArray(this.eventHandlerRegister[eventType]) ) {
      this.eventHandlerRegister[eventType] = [];
    }

    /**
     * The specified event type’s handler list
     */
    const eventHandlerList = this.eventHandlerRegister[eventType];

    // abort if the specified event handler is already registered for the specified event type
    if ( eventHandlerList.includes(eventHandler) ) throw new Error(`The specified handler is already registered for “${eventType}” events.`);

    // add the specified event handler to the register for the specified event type
    eventHandlerList.push(eventHandler);
  }

  async sendEvent(eventType, ...rest) {
    // abort if the specified `eventType` parameter value is invalid
    if (
      (typeof eventType !== 'string')
      || !utilities.validation.isNonEmptyString(eventType)
    ) throw new errors.TypeValidationError('eventType', String);

    /**
     * The list of the event handlers registered for the specified event type
     */
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

    // execute the event handlers (serially) …
    for (const eventHandler of eventHandlerList) {
      try {
        await eventHandler(...rest);
      }
      // … catching and logging any errors that occur during execution
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
    // abort if the specified `eventType` parameter value is invalid
    if (
      (typeof eventType !== 'string')
      || !utilities.validation.isNonEmptyString(eventType)
    ) throw new errors.TypeValidationError('eventType', String);

    // abort if the specified `eventHandler` parameter value is invalid
    if (typeof eventHandler !== 'function') throw new errors.TypeValidationError('eventHandler', Function);

    /**
     * The list of the event handlers registered for the specified event type
     */
    const eventHandlerList = this.eventHandlerRegister[eventType] ?? [];

    /**
     * The index of the specified event handler in the register
     */
    const index = eventHandlerList.indexOf(eventHandler);

    // abort if the specified event handler is not registered for the specified event type
    if (index === -1) throw new Error(`The specified handler is not registered for “${eventType}” events.`);

    // remove the handler from the register for the specified event type
    eventHandlerList.splice(index, 1);
  }
}


export default EventSource;