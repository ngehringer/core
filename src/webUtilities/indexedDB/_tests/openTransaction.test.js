import ava from 'ava';

import * as errors from '../../../errors/index.js';
import * as logging from '../../../logging/index.js';
import * as openTransaction from '../openTransaction.js';
import REFERENCE from '../REFERENCE.js';


const TEST_FIXTURES = Object.freeze({
  DATABASE_NAME: 'test_openTransaction',
  PARAMETERS: Object.freeze({
    database: () => new Promise(
      (resolve, reject) => {
        const idbOpenDBRequest = indexedDB.open(TEST_FIXTURES.DATABASE_NAME);

        idbOpenDBRequest.addEventListener(
          REFERENCE.ENUMERATIONS.EVENT_TYPES.OPEN_DB_REQUEST.BLOCKED,
          () => {
            reject(REFERENCE.ENUMERATIONS.EVENT_TYPES.OPEN_DB_REQUEST.BLOCKED);
          }
        );

        idbOpenDBRequest.addEventListener(
          REFERENCE.ENUMERATIONS.EVENT_TYPES.OPEN_DB_REQUEST.ERROR,
          () => {
            reject(idbOpenDBRequest.error);
          }
        );

        idbOpenDBRequest.addEventListener(
          REFERENCE.ENUMERATIONS.EVENT_TYPES.OPEN_DB_REQUEST.SUCCESS,
          () => {
            resolve(idbOpenDBRequest.result);
          }
        );

        idbOpenDBRequest.addEventListener(
          REFERENCE.ENUMERATIONS.EVENT_TYPES.OPEN_DB_REQUEST.UPGRADENEEDED,
          () => {
            for (const objectStoreName of TEST_FIXTURES.PARAMETERS.objectStoreNames) {
              idbOpenDBRequest.result.createObjectStore(
                objectStoreName,
                {
                  keyPath: 'id'
                }
              );
            }
          }
        );
      }
    ),
    debug: true,
    logger: logging.NullLogger,
    objectStoreNames: [ 'object_store' ],
    transactionEvent: () => {},
    transactionEventListeners: {
      abort: [],
      complete: [],
      error: [
        () => {}
      ]
    },
    transactionMode: REFERENCE.ENUMERATIONS.TRANSACTION_MODES.READONLY
  })
});

const _deleteDatabase = ({
  databaseName
}) => new Promise(
  (resolve, reject) => {
    const idbOpenDBRequest = indexedDB.deleteDatabase(databaseName);

    idbOpenDBRequest.addEventListener(
      REFERENCE.ENUMERATIONS.EVENT_TYPES.OPEN_DB_REQUEST.BLOCKED,
      () => {
        reject(REFERENCE.ENUMERATIONS.EVENT_TYPES.OPEN_DB_REQUEST.BLOCKED);
      }
    );

    idbOpenDBRequest.addEventListener(
      REFERENCE.ENUMERATIONS.EVENT_TYPES.OPEN_DB_REQUEST.ERROR,
      () => {
        reject(idbOpenDBRequest.error);
      }
    );

    idbOpenDBRequest.addEventListener(
      REFERENCE.ENUMERATIONS.EVENT_TYPES.OPEN_DB_REQUEST.SUCCESS,
      () => {
        resolve(idbOpenDBRequest.result);
      }
    );
  }
);

ava.before(
  'core.webUtilities.indexedDB.openTransaction – test environment setup',
  async () => {
    // use “fake-indexeddb” to populate the following in the global scope …
    // - `indexedDB`
    await import('fake-indexeddb/auto.js');
  }
);

ava(
  'core.webUtilities.indexedDB.openTransaction – static data',
  (t) => {
    t.is(typeof openTransaction.DEFAULTS, 'object');
    t.is(openTransaction.DEFAULTS.DEBUG, false);
    t.is(openTransaction.DEFAULTS.LOGGER, logging.ConsoleLogger);
    t.is(typeof openTransaction.DEFAULTS.TRANSACTION_EVENT_LISTENERS, 'object');
    t.true( Array.isArray(openTransaction.DEFAULTS.TRANSACTION_EVENT_LISTENERS.abort) );
    t.true( Array.isArray(openTransaction.DEFAULTS.TRANSACTION_EVENT_LISTENERS.complete) );
    t.true( Array.isArray(openTransaction.DEFAULTS.TRANSACTION_EVENT_LISTENERS.error) );
    t.is(typeof openTransaction.DEFAULTS.TRANSACTION_MODE, 'string');
    t.is(typeof openTransaction.MODULE_ID, 'string');
    t.is(typeof openTransaction.openTransaction, 'function');
    t.is(openTransaction.default, openTransaction.openTransaction);
  }
);

ava.serial(
  'core.webUtilities.indexedDB.openTransaction – "success"',
  async (t) => {
    const database = await TEST_FIXTURES.PARAMETERS.database();

    try {
      //#region debug = true
      const transactionResult1 = await openTransaction.default({
        database: database,
        debug: TEST_FIXTURES.PARAMETERS.debug,
        logger: TEST_FIXTURES.PARAMETERS.logger,
        objectStoreNames: TEST_FIXTURES.PARAMETERS.objectStoreNames,
        transactionEvent: TEST_FIXTURES.PARAMETERS.transactionEvent,
        transactionEventListeners: TEST_FIXTURES.PARAMETERS.transactionEventListeners,
        transactionMode: TEST_FIXTURES.PARAMETERS.transactionMode
      });

      t.is(typeof transactionResult1, 'object');
      t.is( transactionResult1.result, TEST_FIXTURES.PARAMETERS.transactionEvent() );
      t.true(transactionResult1.transaction instanceof IDBTransaction);
      //#endregion

      //#region debug = false; unspecified parameters
      const transactionResult2 = await openTransaction.default({
        database: database,
        debug: null,
        logger: null,
        objectStoreNames: TEST_FIXTURES.PARAMETERS.objectStoreNames,
        transactionEvent: TEST_FIXTURES.PARAMETERS.transactionEvent,
        transactionEventListeners: {},
        transactionMode: null
      });

      t.is(typeof transactionResult2, 'object');
      t.is( transactionResult2.result, TEST_FIXTURES.PARAMETERS.transactionEvent() );
      t.true(transactionResult2.transaction instanceof IDBTransaction);
      //#endregion
    }
    finally {
      database.close();
      await _deleteDatabase({ databaseName: database.name });
    }
  }
);

ava.serial(
  'core.webUtilities.indexedDB.openTransaction – "abort"',
  async (t) => {
    const database = await TEST_FIXTURES.PARAMETERS.database();

    try {
      const expectedError = new Error(`A transaction on the IndexedDB database “${TEST_FIXTURES.DATABASE_NAME}“ failed (“${REFERENCE.ENUMERATIONS.EVENT_TYPES.TRANSACTION.ABORT}”).`);

      const error = await t.throwsAsync(
        () => openTransaction.default({
          database: database,
          debug: false,
          logger: TEST_FIXTURES.PARAMETERS.logger,
          objectStoreNames: TEST_FIXTURES.PARAMETERS.objectStoreNames,
          transactionEvent: (_transaction) => {
            _transaction.abort();
          },
          transactionEventListeners: TEST_FIXTURES.PARAMETERS.transactionEventListeners,
          transactionMode: TEST_FIXTURES.PARAMETERS.transactionMode
        })
      );

      t.is(typeof error, 'object');
      t.true(error instanceof Error);
      t.deepEqual(error, expectedError);
    }
    finally {
      database.close();
      await _deleteDatabase({ databaseName: database.name });
    }
  }
);

ava.serial(
  'core.webUtilities.indexedDB.openTransaction – "error"',
  async (t) => {
    const database = await TEST_FIXTURES.PARAMETERS.database();

    try {
      const error = await t.throwsAsync(
        () => openTransaction.default({
          database: database,
          debug: TEST_FIXTURES.PARAMETERS.debug,
          logger: TEST_FIXTURES.PARAMETERS.logger,
          objectStoreNames: TEST_FIXTURES.PARAMETERS.objectStoreNames,
          transactionEvent: (_transaction) => {
            const objectStore = _transaction.objectStore(TEST_FIXTURES.PARAMETERS.objectStoreNames[0]);
            objectStore.add({ id: 0 });
            objectStore.add({ id: 0 });
          },
          transactionEventListeners: TEST_FIXTURES.PARAMETERS.transactionEventListeners,
          transactionMode: REFERENCE.ENUMERATIONS.TRANSACTION_MODES.READWRITE
        })
      );

      t.is(typeof error, 'object');
      t.true(error instanceof Error);
      t.is(error.name, 'ConstraintError');
    }
    finally {
      database.close();
      await _deleteDatabase({ databaseName: database.name });
    }
  }
);

ava.serial(
  'core.webUtilities.indexedDB.openTransaction – invalid parameters',
  async (t) => {
    const database = await TEST_FIXTURES.PARAMETERS.database();

    try {
      const expectedError1 = new errors.TypeValidationError('database', IDBDatabase);

      const error1 = t.throws(
        () => openTransaction.default({
          database: null
        })
      );

      t.is(typeof error1, 'object');
      t.true(error1 instanceof errors.TypeValidationError);
      t.deepEqual(error1, expectedError1);

      const expectedError2 = new errors.TypeValidationError('objectStoreNames', Array);

      const error2 = t.throws(
        () => openTransaction.default({
          database: database,
          debug: TEST_FIXTURES.PARAMETERS.debug,
          logger: TEST_FIXTURES.PARAMETERS.logger,
          objectStoreNames: null,
          transactionEvent: TEST_FIXTURES.PARAMETERS.transactionEvent,
          transactionEventListeners: TEST_FIXTURES.PARAMETERS.transactionEventListeners,
          transactionMode: TEST_FIXTURES.PARAMETERS.transactionMode
        })
      );

      t.is(typeof error2, 'object');
      t.true(error2 instanceof errors.TypeValidationError);
      t.deepEqual(error2, expectedError2);

      const expectedError3 = new errors.TypeValidationError('transactionEvent', Function);

      const error3 = t.throws(
        () => openTransaction.default({
          database: database,
          debug: TEST_FIXTURES.PARAMETERS.debug,
          logger: TEST_FIXTURES.PARAMETERS.logger,
          objectStoreNames: TEST_FIXTURES.PARAMETERS.objectStoreNames,
          transactionEvent: null,
          transactionEventListeners: TEST_FIXTURES.PARAMETERS.transactionEventListeners,
          transactionMode: TEST_FIXTURES.PARAMETERS.transactionMode
        })
      );

      t.is(typeof error3, 'object');
      t.true(error3 instanceof errors.TypeValidationError);
      t.deepEqual(error3, expectedError3);
    }
    finally {
      database.close();
      await _deleteDatabase({ databaseName: database.name });
    }
  }
);