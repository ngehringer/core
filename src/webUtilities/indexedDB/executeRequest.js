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
  REQUEST_EVENT_LISTENERS: {
    error: [],
    success: []
  }
});

/**
 * The module’s ID
 */
const MODULE_ID = '@backwater-systems/core.webUtilities.indexedDB.executeRequest';

/**
 * Executes an `IndexedDB` request (`IDBRequest`).
 */
const executeRequest = ({
  debug = DEFAULTS.DEBUG,
  logger = DEFAULTS.LOGGER,
  request,
  requestEventListeners = DEFAULTS.REQUEST_EVENT_LISTENERS
}) => {
  // abort if the specified `request` parameter value is invalid
  if (
    (typeof request !== 'object')
    || !(request instanceof IDBRequest)
  ) throw new errors.TypeValidationError('request', IDBRequest);

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
   * The event listeners to add to the `IDBRequest`
   */
  const _requestEventListeners = Object.fromEntries(
    Object.values(REFERENCE.ENUMERATIONS.EVENT_TYPES.REQUEST).map(
      (eventType) => [
        eventType,
        Array.isArray(requestEventListeners?.[eventType])
          // ensure every event listener specified is a function
          ? requestEventListeners[eventType].filter( (eventListener) => (typeof eventListener === 'function') )
          : DEFAULTS.REQUEST_EVENT_LISTENERS[eventType]
      ]
    )
  );

  // in debug mode, log information about the request
  if (_debug) {
    _logger.logDebug({
      data: {
        error: (request.readyState === REFERENCE.ENUMERATIONS.REQUEST_READY_STATES.DONE) ? request.error : null,
        errorMessage: (request.readyState === REFERENCE.ENUMERATIONS.REQUEST_READY_STATES.DONE) ? request.error?.message : null,
        errorName: (request.readyState === REFERENCE.ENUMERATIONS.REQUEST_READY_STATES.DONE) ? request.error?.name : null,
        requestEventListeners: Object.fromEntries(
          Object.entries(_requestEventListeners).map(
            ([ eventType, eventListeners ]) => [ eventType, eventListeners.length ]
          )
        ),
        requestReadyState: request.readyState,
        result: (request.readyState === REFERENCE.ENUMERATIONS.REQUEST_READY_STATES.DONE) ? request.result : null
      },
      sourceID: MODULE_ID,
      verbose: _debug
    });
  }

  return new Promise(
    (resolve, reject) => {
      // if the `IDBRequest.readyState` is `done` …
      if (request.readyState === REFERENCE.ENUMERATIONS.REQUEST_READY_STATES.DONE) {
        // … if the `error` property is defined, reject the promise (value: `IDBRequest.error`) …
        if (
          (typeof request.error !== 'undefined')
          && (request.error !== null)
        ) {
          reject(request.error);

          return;
        }

        // … otherwise, resolve the promise (value: `IDBRequest.result`)
        resolve(request.result);
      }

      // if the `IDBRequest.readyState` is `pending` …
      if (request.readyState === REFERENCE.ENUMERATIONS.REQUEST_READY_STATES.PENDING) {
        // add event listeners to the opened `IDBRequest`
        for ( const [ eventType, eventListeners ] of Object.entries(_requestEventListeners) ) {
          for (const eventListener of eventListeners) {
            request.addEventListener(eventType, eventListener);
          }
        }

        // if the request generates an `error` event …
        request.addEventListener(
          REFERENCE.ENUMERATIONS.EVENT_TYPES.REQUEST.ERROR,
          (event) => {
            // in debug mode, log the `error` event
            if (_debug) {
              _logger.logDebug({
                data: {
                  error: request.error,
                  errorMessage: request.error?.message,
                  errorName: request.error?.name,
                  eventType: event.type,
                  requestReadyState: request.readyState
                },
                sourceID: MODULE_ID,
                verbose: _debug
              });
            }

            // … reject the promise (value: `IDBRequest.error`)
            reject(request.error);
          }
        );

        // if the request generates a `success` event …
        request.addEventListener(
          REFERENCE.ENUMERATIONS.EVENT_TYPES.REQUEST.SUCCESS,
          (event) => {
            // in debug mode, log the `success` event
            if (_debug) {
              _logger.logDebug({
                data: {
                  eventType: event.type,
                  requestReadyState: request.readyState
                },
                sourceID: MODULE_ID,
                verbose: _debug
              });
            }

            // … resolve the promise (value: `IDBRequest.result`)
            resolve(request.result);
          }
        );
      }
    }
  );
};


export default executeRequest;
export {
  DEFAULTS,
  MODULE_ID,
  executeRequest
};