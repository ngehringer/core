import * as errors from '../../errors/index.js';
import * as logging from '../../logging/index.js';
import * as utilities from '../../utilities/index.js';
import REFERENCE from './REFERENCE.js';


/**
 * The module’s defaults
 */
const DEFAULTS = Object.freeze({
  DATABASE_EVENT_LISTENERS: {
    abort: [],
    close: [],
    error: [],
    versionchange: []
  },
  DATABASE_VERSION: 1,
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
const MODULE_ID = '@backwater-systems/core.webUtilities.indexedDB.openDatabase';

/**
 * Opens an `IndexedDB` database.
 */
const openDatabase = ({
  databaseEventListeners = DEFAULTS.DATABASE_EVENT_LISTENERS,
  databaseName,
  databaseVersion = DEFAULTS.DATABASE_VERSION,
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
   * The event listeners to add to the opened `IDBDatabase`
   */
  const _databaseEventListeners = Object.fromEntries(
    Object.values(REFERENCE.ENUMERATIONS.EVENT_TYPES.DATABASE).map(
      (eventType) => [
        eventType,
        Array.isArray(databaseEventListeners?.[eventType])
          // ensure every event listener specified is a function
          ? databaseEventListeners[eventType].filter( (eventListener) => (typeof eventListener === 'function') )
          : DEFAULTS.DATABASE_EVENT_LISTENERS[eventType]
      ]
    )
  );

  /**
   * The version number of the database requested to be opened, coerced to a `Number`
   * @default 1
   */
  const databaseVersionNumber = utilities.conversion.convertToNumber(databaseVersion);
  const _databaseVersion = (
    Number.isInteger(databaseVersionNumber)
    && (databaseVersionNumber >= 1)
  )
    ? databaseVersionNumber
    : DEFAULTS.DATABASE_VERSION
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

  // in debug mode, log information about the request to open the database
  if (_debug) {
    _logger.logDebug({
      data: {
        databaseEventListeners: Object.fromEntries(
          Object.entries(_databaseEventListeners).map(
            ([ eventType, eventListeners ]) => [ eventType, eventListeners.length ]
          )
        ),
        databaseName: databaseName,
        databaseVersion: _databaseVersion,
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
       * The request to open the database
       */
      const openDBRequest = indexedDB.open(databaseName, _databaseVersion);

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
                databaseVersion: _databaseVersion,
                eventType: event.type,
                newVersion: event.newVersion,
                oldVersion: event.oldVersion,
                requestReadyState: openDBRequest.readyState
              },
              sourceID: MODULE_ID,
              verbose: _debug
            });
          }

          // … add an event listener to the `success` event to prevent the opened database from being orphaned
          openDBRequest.addEventListener(
            REFERENCE.ENUMERATIONS.EVENT_TYPES.OPEN_DB_REQUEST.SUCCESS,
            (successEvent) => {
              // in debug mode, log the `success` event
              if (_debug) {
                _logger.logDebug({
                  data: {
                    databaseName: databaseName,
                    databaseVersion: _databaseVersion,
                    eventType: successEvent.type,
                    requestReadyState: openDBRequest.readyState
                  },
                  sourceID: MODULE_ID,
                  verbose: _debug
                });
              }

              // close the opened database
              openDBRequest.result.close();
            }
          );

          // … and, reject the promise (value: `Error`)
          reject( new Error(`Opening the IndexedDB database “${databaseName}“ failed (“${event.type}”).`) );
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
                databaseVersion: _databaseVersion,
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
                databaseVersion: _databaseVersion,
                eventType: event.type,
                requestReadyState: openDBRequest.readyState
              },
              sourceID: MODULE_ID,
              verbose: _debug
            });
          }

          /**
           * The opened database
           */
          const database = openDBRequest.result;

          // add event listeners to the opened `IDBDatabase`
          for ( const [ eventType, eventListeners ] of Object.entries(_databaseEventListeners) ) {
            for (const eventListener of eventListeners) {
              database.addEventListener(eventType, eventListener);
            }
          }

          // … resolve the promise (value: `IDBOpenDBRequest.result` [`IDBDatabase`])
          resolve(database);
        }
      );
    }
  );
};


export default openDatabase;
export {
  DEFAULTS,
  MODULE_ID,
  openDatabase
};