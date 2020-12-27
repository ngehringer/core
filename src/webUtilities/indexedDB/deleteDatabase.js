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
  OPEN_DB_REQUEST_EVENT_LISTENERS: {
    blocked: [],
    error: [],
    success: [],
    upgradeneeded: []
  }
});

/**
 * The module’s ID
 */
const MODULE_ID = '@backwater-systems/core.webUtilities.indexedDB.deleteDatabase';

/**
 * Deletes an `IndexedDB` database.
 */
const deleteDatabase = ({
  databaseName,
  debug = DEFAULTS.DEBUG,
  logger = DEFAULTS.LOGGER,
  openDBRequestEventListeners = DEFAULTS.OPEN_DB_REQUEST_EVENT_LISTENERS
}) => {
  // abort if the specified `databaseName` parameter value is invalid
  if (
    (typeof databaseName !== 'string')
    || !utilities.validation.isNonEmptyString(databaseName)
  ) throw new errors.TypeValidationError('databaseName', String);

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
   * The event listeners to add to the generated `IDBOpenDBRequest`
   */
  const _openDBRequestEventListeners = Object.fromEntries(
    Object.values(REFERENCE.ENUMERATIONS.EVENT_TYPES.OPEN_DB_REQUEST).map(
      (eventType) => [
        eventType,
        Array.isArray(openDBRequestEventListeners?.[eventType])
          // ensure every event listener specified is a function
          ? openDBRequestEventListeners[eventType].filter( (eventListener) => (typeof eventListener === 'function') )
          : DEFAULTS.OPEN_DB_REQUEST_EVENT_LISTENERS[eventType]
      ]
    )
  );

  // in debug mode, log information about the request to delete the database
  if (_debug) {
    _logger.logDebug({
      data: {
        databaseName: databaseName,
        openDBRequestEventListeners: Object.fromEntries(
          Object.entries(_openDBRequestEventListeners).map(
            ([ eventType, eventListeners ]) => [ eventType, eventListeners.length ]
          )
        )
      },
      sourceID: MODULE_ID,
      verbose: _debug
    });
  }

  return new Promise(
    (resolve, reject) => {
      /**
       * The request to delete the database
       */
      const openDBRequest = indexedDB.deleteDatabase(databaseName);

      // add event listeners to the generated `IDBOpenDBRequest`
      for ( const [ eventType, eventListeners ] of Object.entries(_openDBRequestEventListeners) ) {
        for (const eventListener of eventListeners) {
          openDBRequest.addEventListener(eventType, eventListener);
        }
      }

      // if the request generates a `blocked` event …
      openDBRequest.addEventListener(
        REFERENCE.ENUMERATIONS.EVENT_TYPES.OPEN_DB_REQUEST.BLOCKED,
        (event) => {
          // in debug mode, log the `blocked` event
          if (_debug) {
            _logger.logDebug({
              data: {
                databaseName: databaseName,
                eventType: event.type,
                newVersion: event.newVersion,
                oldVersion: event.oldVersion,
                requestReadyState: openDBRequest.readyState
              },
              sourceID: MODULE_ID,
              verbose: _debug
            });
          }

          // … and, reject the promise (value: `Error`)
          reject( new Error(`Deleting the IndexedDB database “${databaseName}“ failed (“${event.type}”).`) );
        }
      );

      // if the request generates an `error` event …
      openDBRequest.addEventListener(
        REFERENCE.ENUMERATIONS.EVENT_TYPES.OPEN_DB_REQUEST.ERROR,
        (event) => {
          // in debug mode, log the `error` event
          if (_debug) {
            _logger.logDebug({
              data: {
                databaseName: databaseName,
                error: openDBRequest.error,
                errorMessage: openDBRequest.error?.message,
                errorName: openDBRequest.error?.name,
                eventType: event.type,
                requestReadyState: openDBRequest.readyState
              },
              sourceID: MODULE_ID,
              verbose: _debug
            });
          }

          // … reject the promise (value: `IDBOpenDBRequest.error`)
          reject(openDBRequest.error);
        }
      );

      // if the request generates a `success` event …
      openDBRequest.addEventListener(
        REFERENCE.ENUMERATIONS.EVENT_TYPES.OPEN_DB_REQUEST.SUCCESS,
        (event) => {
          // in debug mode, log the `success` event
          if (_debug) {
            _logger.logDebug({
              data: {
                databaseName: databaseName,
                eventType: event.type,
                requestReadyState: openDBRequest.requestReadyState
              },
              sourceID: MODULE_ID,
              verbose: _debug
            });
          }

          // … resolve the promise (value: `IDBOpenDBRequest.result` [`undefined`])
          resolve(openDBRequest.result);
        }
      );
    }
  );
};


export default deleteDatabase;
export {
  DEFAULTS,
  MODULE_ID,
  deleteDatabase
};