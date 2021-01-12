/**
 * `core.webUtilities.indexedDB` reference data
 */
const REFERENCE = Object.freeze({
  ENUMERATIONS: Object.freeze({
    CURSOR_DIRECTIONS: Object.freeze({
      NEXT: 'next',
      NEXTUNIQUE: 'nextunique',
      PREV: 'prev',
      PREVUNIQUE: 'prevunique'
    }),
    EVENT_TYPES: Object.freeze({
      DATABASE: Object.freeze({
        ABORT: 'abort',
        CLOSE: 'close',
        ERROR: 'error',
        VERSIONCHANGE: 'versionchange'
      }),
      OPEN_DB_REQUEST: Object.freeze({
        BLOCKED: 'blocked',
        ERROR: 'error',
        SUCCESS: 'success',
        UPGRADENEEDED: 'upgradeneeded'
      }),
      REQUEST: Object.freeze({
        ERROR: 'error',
        SUCCESS: 'success'
      }),
      TRANSACTION: Object.freeze({
        ABORT: 'abort',
        COMPLETE: 'complete',
        ERROR: 'error'
      })
    }),
    REQUEST_READY_STATES: Object.freeze({
      DONE: 'done',
      PENDING: 'pending'
    }),
    TRANSACTION_MODES: Object.freeze({
      READONLY: 'readonly',
      READWRITE: 'readwrite'
    })
  })
});


export default REFERENCE;