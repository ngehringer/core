import ava from 'ava';

import * as errors from '../../../errors/index.js';
import * as logging from '../../../logging/index.js';
import * as executeRequest from '../executeRequest.js';
import REFERENCE from '../REFERENCE.js';


const TEST_FIXTURES = Object.freeze({
  DATABASE_NAME: 'test_executeRequest',
  OBJECT_STORE_NAMES: [ 'object_store' ],
  PARAMETERS: Object.freeze({
    debug: true,
    logger: logging.NullLogger,
    request: ({
      database,
      id = 0
    }) => {
      const transaction = database.transaction(TEST_FIXTURES.OBJECT_STORE_NAMES, REFERENCE.ENUMERATIONS.TRANSACTION_MODES.READWRITE);
      const objectStore = transaction.objectStore(TEST_FIXTURES.OBJECT_STORE_NAMES[0]);
      const objectStoreAddRequest = objectStore.add({ id: id });

      return objectStoreAddRequest;
    },
    requestEventListeners: {
      error: [
        () => {}
      ],
      success: null
    }
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

const _openDatabase = ({
  databaseName
}) => new Promise(
  (resolve, reject) => {
    const idbOpenDBRequest = indexedDB.open(databaseName);

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
        for (const objectStoreName of TEST_FIXTURES.OBJECT_STORE_NAMES) {
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
);

ava.before(
  'core.webUtilities.indexedDB.executeRequest – test environment setup',
  async () => {
    // use “fake-indexeddb” to populate the following in the global scope …
    // - `indexedDB`
    await import('fake-indexeddb/auto.js');
  }
);

ava(
  'core.webUtilities.indexedDB.executeRequest – static data',
  (t) => {
    t.is(typeof executeRequest.DEFAULTS, 'object');
    t.is(executeRequest.DEFAULTS.DEBUG, false);
    t.is(executeRequest.DEFAULTS.LOGGER, logging.ConsoleLogger);
    t.is(typeof executeRequest.DEFAULTS.REQUEST_EVENT_LISTENERS, 'object');
    t.true( Array.isArray(executeRequest.DEFAULTS.REQUEST_EVENT_LISTENERS.error) );
    t.true( Array.isArray(executeRequest.DEFAULTS.REQUEST_EVENT_LISTENERS.success) );
    t.is(typeof executeRequest.MODULE_ID, 'string');
    t.is(typeof executeRequest.executeRequest, 'function');
    t.is(executeRequest.default, executeRequest.executeRequest);
  }
);

ava.serial(
  'core.webUtilities.indexedDB.executeRequest – "success"; IDBRequest.readyState = "done"',
  async (t) => {
    const database = await _openDatabase({ databaseName: TEST_FIXTURES.DATABASE_NAME });

    try {
      const request = TEST_FIXTURES.PARAMETERS.request({ database: database });
      const requestPromise = new Promise(
        (resolve, reject) => {
          request.addEventListener(
            REFERENCE.ENUMERATIONS.EVENT_TYPES.REQUEST.ERROR,
            () => reject(request.error)
          );

          request.addEventListener(
            REFERENCE.ENUMERATIONS.EVENT_TYPES.REQUEST.SUCCESS,
            () => resolve(request.result)
          );
        }
      );
      await requestPromise;

      const result = await executeRequest.default({
        debug: TEST_FIXTURES.PARAMETERS.debug,
        logger: TEST_FIXTURES.PARAMETERS.logger,
        request: request,
        requestEventListeners: TEST_FIXTURES.PARAMETERS.requestEventListeners
      });

      t.is(typeof result, 'number');
    }
    finally {
      database.close();
      await _deleteDatabase({ databaseName: TEST_FIXTURES.DATABASE_NAME });
    }

    t.pass();
  }
);

ava.serial(
  'core.webUtilities.indexedDB.executeRequest – "error"; IDBRequest.readyState = "done"',
  async (t) => {
    const database = await _openDatabase({ databaseName: TEST_FIXTURES.DATABASE_NAME });

    try {
      const request1 = TEST_FIXTURES.PARAMETERS.request({ database: database });
      const request1Promise = new Promise(
        (resolve, reject) => {
          request1.addEventListener(
            REFERENCE.ENUMERATIONS.EVENT_TYPES.REQUEST.ERROR,
            () => reject(request1.error)
          );

          request1.addEventListener(
            REFERENCE.ENUMERATIONS.EVENT_TYPES.REQUEST.SUCCESS,
            () => resolve(request1.result)
          );
        }
      );
      await request1Promise;

      const request2 = TEST_FIXTURES.PARAMETERS.request({ database: database });
      const request2Promise = new Promise(
        (resolve, reject) => {
          request2.addEventListener(
            REFERENCE.ENUMERATIONS.EVENT_TYPES.REQUEST.ERROR,
            () => reject(request2.error)
          );

          request2.addEventListener(
            REFERENCE.ENUMERATIONS.EVENT_TYPES.REQUEST.SUCCESS,
            () => resolve(request2.result)
          );
        }
      );
      try {
        await request2Promise;
      }
      catch {}

      const error = await t.throwsAsync(
        () => executeRequest.default({
          debug: TEST_FIXTURES.PARAMETERS.debug,
          logger: TEST_FIXTURES.PARAMETERS.logger,
          request: request2,
          requestEventListeners: TEST_FIXTURES.PARAMETERS.requestEventListeners
        })
      );

      t.is(typeof error, 'object');
      t.true(error instanceof Error);
      t.true(error.name === 'ConstraintError');
    }
    finally {
      database.close();
      await _deleteDatabase({ databaseName: TEST_FIXTURES.DATABASE_NAME });
    }

    t.pass();
  }
);

ava.serial(
  'core.webUtilities.indexedDB.executeRequest – "success"; IDBRequest.readyState = "pending"',
  async (t) => {
    const database = await _openDatabase({ databaseName: TEST_FIXTURES.DATABASE_NAME });

    try {
      //#region debug = true
      const result1 = await executeRequest.default({
        debug: TEST_FIXTURES.PARAMETERS.debug,
        logger: TEST_FIXTURES.PARAMETERS.logger,
        request: TEST_FIXTURES.PARAMETERS.request({ database: database }),
        requestEventListeners: TEST_FIXTURES.PARAMETERS.requestEventListeners
      });

      t.is(typeof result1, 'number');
      //#endregion

      //#region debug = false; unspecified parameters
      const result2 = await executeRequest.default({
        debug: null,
        logger: null,
        request: TEST_FIXTURES.PARAMETERS.request({
          database: database,
          id: 1
        }),
        requestEventListeners: null
      });

      t.is(typeof result2, 'number');
      //#endregion
    }
    finally {
      database.close();
      await _deleteDatabase({ databaseName: TEST_FIXTURES.DATABASE_NAME });
    }

    t.pass();
  }
);

ava.serial(
  'core.webUtilities.indexedDB.executeRequest – "error"; IDBRequest.readyState = "pending"',
  async (t) => {
    const database = await _openDatabase({ databaseName: TEST_FIXTURES.DATABASE_NAME });

    try {
      const initialRequest = TEST_FIXTURES.PARAMETERS.request({ database: database });
      const initialRequestPromise = new Promise(
        (resolve, reject) => {
          initialRequest.addEventListener(
            REFERENCE.ENUMERATIONS.EVENT_TYPES.REQUEST.ERROR,
            () => reject(initialRequest.error)
          );

          initialRequest.addEventListener(
            REFERENCE.ENUMERATIONS.EVENT_TYPES.REQUEST.SUCCESS,
            () => resolve(initialRequest.result)
          );
        }
      );
      await initialRequestPromise;

      //#region debug = true
      const request1 = TEST_FIXTURES.PARAMETERS.request({ database: database });

      const error1 = await t.throwsAsync(
        () => executeRequest.default({
          debug: TEST_FIXTURES.PARAMETERS.debug,
          logger: TEST_FIXTURES.PARAMETERS.logger,
          request: request1,
          requestEventListeners: TEST_FIXTURES.PARAMETERS.requestEventListeners
        })
      );

      t.is(typeof error1, 'object');
      t.true(error1 instanceof Error);
      t.true(error1.name === 'ConstraintError');
      //#endregion

      //#region debug = false
      const request2 = TEST_FIXTURES.PARAMETERS.request({ database: database });

      const error2 = await t.throwsAsync(
        () => executeRequest.default({
          debug: false,
          logger: TEST_FIXTURES.PARAMETERS.logger,
          request: request2,
          requestEventListeners: TEST_FIXTURES.PARAMETERS.requestEventListeners
        })
      );

      t.is(typeof error2, 'object');
      t.true(error2 instanceof Error);
      t.true(error2.name === 'ConstraintError');
      //#endregion
    }
    finally {
      database.close();
      await _deleteDatabase({ databaseName: TEST_FIXTURES.DATABASE_NAME });
    }

    t.pass();
  }
);

ava.serial(
  'core.webUtilities.indexedDB.executeRequest – invalid parameters',
  (t) => {
    const expectedError1 = new errors.TypeValidationError('request', IDBRequest);

    const error1 = t.throws(
      () => executeRequest.default({
        request: null
      })
    );

    t.is(typeof error1, 'object');
    t.true(error1 instanceof errors.TypeValidationError);
    t.deepEqual(error1, expectedError1);
  }
);