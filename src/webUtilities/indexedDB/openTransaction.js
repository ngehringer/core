import * as errors from '../../errors/index.js';
import * as logging from '../../logging/index.js';
import * as utilities from '../../utilities/index.js';
import REFERENCE from './REFERENCE.js';


/**
 * The module’s defaults
 */
const DEFAULTS = Object.freeze({
  DEBUG: false,
  LOGGER: logging.ConsoleLogger,
  TRANSACTION_EVENT_LISTENERS: {
    abort: [],
    complete: [],
    error: []
  },
  TRANSACTION_MODE: REFERENCE.ENUMERATIONS.TRANSACTION_MODES.READONLY
});

/**
 * The module’s ID
 */
const MODULE_ID = '@backwater-systems/core.webUtilities.indexedDB.openTransaction';

/**
 * Executes an `IndexedDB` transaction.
 */
const openTransaction = ({
  database,
  debug = DEFAULTS.DEBUG,
  logger = DEFAULTS.LOGGER,
  objectStoreNames,
  transactionEvent,
  transactionEventListeners = DEFAULTS.TRANSACTION_EVENT_LISTENERS,
  transactionMode = DEFAULTS.TRANSACTION_MODE
}) => {
  // abort if the specified `database` parameter value is invalid
  if (
    (typeof database !== 'object')
    || !(database instanceof IDBDatabase)
  ) throw new errors.TypeValidationError('database', IDBDatabase);

  // abort if the specified `objectStoreNames` parameter value is invalid
  if (
    !Array.isArray(objectStoreNames)
    || !objectStoreNames.every(
      (objectStoreName) => (
        (typeof objectStoreName === 'string')
        && utilities.validation.isNonEmptyString(objectStoreName)
      )
    )
  ) throw new errors.TypeValidationError('objectStoreNames', Array);

  // abort if the specified `transactionEvent` parameter value is invalid
  if (typeof transactionEvent !== 'function') throw new errors.TypeValidationError('transactionEvent', Function);

  /**
   * Whether debug mode is enabled
   * @default false
   */
  const _debug = (typeof debug === 'boolean')
    ? debug
    : DEFAULTS.DEBUG
  ;

  /**
   * The module’s logger
   */
  const _logger = (
    (typeof logger === 'function')
    && utilities.validation.validateInheritance(logger, logging.BaseLogger)
  )
    ? logger
    : DEFAULTS.LOGGER
  ;

  /**
   * The event listeners to add to the opened `IDBTransaction`
   */
  const _transactionEventListeners = Object.fromEntries(
    Object.values(REFERENCE.ENUMERATIONS.EVENT_TYPES.TRANSACTION).map(
      (eventType) => [
        eventType,
        Array.isArray(transactionEventListeners?.[eventType])
          // ensure every event listener specified is a function
          ? transactionEventListeners[eventType].filter( (eventListener) => (typeof eventListener === 'function') )
          : DEFAULTS.TRANSACTION_EVENT_LISTENERS[eventType]
      ]
    )
  );

  /**
   * The mode in which to open the transaction { `readonly` | `readwrite` }
   */
  const _transactionMode = (
    (typeof transactionMode === 'string')
    && utilities.validation.validateEnumeration(transactionMode, REFERENCE.ENUMERATIONS.TRANSACTION_MODES)
  )
    ? transactionMode
    : DEFAULTS.TRANSACTION_MODE
  ;

  // in debug mode, log information about the transaction
  if (_debug) {
    _logger.logDebug({
      data: {
        databaseName: database.name,
        transactionEventListeners: Object.fromEntries(
          Object.entries(_transactionEventListeners).map(
            ([ eventType, eventListeners ]) => [ eventType, eventListeners.length ]
          )
        ),
        transactionMode: _transactionMode
      },
      sourceID: MODULE_ID,
      verbose: _debug
    });
  }

  return new Promise(
    (resolve, reject) => {
      /**
       * The opened transaction
       */
      const transaction = database.transaction(objectStoreNames, _transactionMode);

      // add event listeners to the opened `IDBTransaction`
      for ( const [ eventType, eventListeners ] of Object.entries(_transactionEventListeners) ) {
        for (const eventListener of eventListeners) {
          transaction.addEventListener(eventType, eventListener);
        }
      }

      /**
       * An event listener that rejects the current promise
       */
      const rejectPromise = (event) => {
        // in debug mode, log the event
        if (_debug) {
          _logger.logDebug({
            data: {
              databaseName: database.name,
              error: event.target.error,
              errorMessage: event.target.error?.message,
              errorName: event.target.error?.name,
              eventType: event.type
            },
            sourceID: MODULE_ID,
            verbose: _debug
          });
        }

        // reject the promise (value: `IDBTransaction.target.error` | `Error`)
        reject(
          (
            (typeof event.target.error === 'object')
            && (event.target.error instanceof Error)
          )
            ? event.target.error
            : new Error(`A transaction on the IndexedDB database “${database.name}“ failed (“${event.type}”).`)
        );
      };

      // if the transaction generates an `abort` event …
      transaction.addEventListener(
        REFERENCE.ENUMERATIONS.EVENT_TYPES.TRANSACTION.ABORT,
        // … reject the promise
        rejectPromise
      );

      // if the transaction generates an `error` event …
      transaction.addEventListener(
        REFERENCE.ENUMERATIONS.EVENT_TYPES.TRANSACTION.ERROR,
        // … reject the promise
        rejectPromise
      );

      /**
       * The return value of the `transactionEvent()` function
       */
      const transactionEventReturnValue = transactionEvent(transaction);

      // if the transaction generates a `complete` event …
      transaction.addEventListener(
        REFERENCE.ENUMERATIONS.EVENT_TYPES.TRANSACTION.COMPLETE,
        (event) => {
          // in debug mode, log the `complete` event
          if (_debug) {
            _logger.logDebug({
              data: {
                databaseName: database.name,
                eventType: event.type
              },
              sourceID: MODULE_ID,
              verbose: _debug
            });
          }

          // … resolve the promise (value: { result: any; transaction: `IDBTransaction` })
          resolve({
            result: transactionEventReturnValue,
            transaction: transaction
          });
        }
      );
    }
  );
};


export default openTransaction;
export {
  DEFAULTS,
  MODULE_ID,
  openTransaction
};