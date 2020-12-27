import ava from 'ava';

import * as errors from '../../../errors/index.js';
import * as logging from '../../../logging/index.js';
import * as deleteDatabase from '../deleteDatabase.js';
import REFERENCE from '../REFERENCE.js';


const TEST_FIXTURES = Object.freeze({
  PARAMETERS: Object.freeze({
    databaseName: 'test_deleteDatabase',
    debug: true,
    logger: logging.NullLogger,
    openDBRequestEventListeners: {
      blocked: [],
      error: [
        () => {}
      ],
      success: null,
      upgradeneeded: []
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
  }
);

ava.before(
  'core.webUtilities.indexedDB.deleteDatabase – test environment setup',
  async () => {
    // use “fake-indexeddb” to populate the following in the global scope …
    // - `indexedDB`
    await import('fake-indexeddb/auto.js');
  }
);

ava(
  'core.webUtilities.indexedDB.deleteDatabase – static data',
  (t) => {
    t.is(typeof deleteDatabase.DEFAULTS, 'object');
    t.is(deleteDatabase.DEFAULTS.DEBUG, false);
    t.is(deleteDatabase.DEFAULTS.LOGGER, logging.ConsoleLogger);
    t.is(typeof deleteDatabase.DEFAULTS.OPEN_DB_REQUEST_EVENT_LISTENERS, 'object');
    t.true( Array.isArray(deleteDatabase.DEFAULTS.OPEN_DB_REQUEST_EVENT_LISTENERS.blocked) );
    t.true( Array.isArray(deleteDatabase.DEFAULTS.OPEN_DB_REQUEST_EVENT_LISTENERS.error) );
    t.true( Array.isArray(deleteDatabase.DEFAULTS.OPEN_DB_REQUEST_EVENT_LISTENERS.success) );
    t.true( Array.isArray(deleteDatabase.DEFAULTS.OPEN_DB_REQUEST_EVENT_LISTENERS.upgradeneeded) );
    t.is(typeof deleteDatabase.MODULE_ID, 'string');
    t.is(typeof deleteDatabase.deleteDatabase, 'function');
    t.is(deleteDatabase.default, deleteDatabase.deleteDatabase);
  }
);

ava.serial(
  'core.webUtilities.indexedDB.deleteDatabase – "success"',
  async (t) => {
    const database = await _openDatabase({ databaseName: TEST_FIXTURES.PARAMETERS.databaseName });
    database.close();

    const result = await deleteDatabase.default({
      databaseName: TEST_FIXTURES.PARAMETERS.databaseName,
      debug: TEST_FIXTURES.PARAMETERS.debug,
      logger: TEST_FIXTURES.PARAMETERS.logger,
      openDBRequestEventListeners: TEST_FIXTURES.PARAMETERS.openDBRequestEventListeners
    });

    t.is(typeof result, 'undefined');
  }
);

ava.serial(
  'core.webUtilities.indexedDB.deleteDatabase – "blocked"',
  async (t) => {
    const database = await _openDatabase({ databaseName: TEST_FIXTURES.PARAMETERS.databaseName });

    try {
      //#region debug = true
      const expectedError1 = new Error(`Deleting the IndexedDB database “${TEST_FIXTURES.PARAMETERS.databaseName}“ failed (“${REFERENCE.ENUMERATIONS.EVENT_TYPES.OPEN_DB_REQUEST.BLOCKED}”).`);

      const error1 = await t.throwsAsync(
        () => deleteDatabase.default({
          databaseName: TEST_FIXTURES.PARAMETERS.databaseName,
          debug: TEST_FIXTURES.PARAMETERS.debug,
          logger: TEST_FIXTURES.PARAMETERS.logger,
          openDBRequestEventListeners: TEST_FIXTURES.PARAMETERS.openDBRequestEventListeners
        })
      );

      t.is(typeof error1, 'object');
      t.true(error1 instanceof Error);
      t.deepEqual(error1, expectedError1);
      //#endregion

      //#region debug = false; unspecified parameters
      const expectedError2 = new Error(`Deleting the IndexedDB database “${TEST_FIXTURES.PARAMETERS.databaseName}“ failed (“${REFERENCE.ENUMERATIONS.EVENT_TYPES.OPEN_DB_REQUEST.BLOCKED}”).`);

      const error2 = await t.throwsAsync(
        () => deleteDatabase.default({
          databaseName: TEST_FIXTURES.PARAMETERS.databaseName,
          debug: null,
          logger: null,
          openDBRequestEventListeners: null
        })
      );

      t.is(typeof error2, 'object');
      t.true(error2 instanceof Error);
      t.deepEqual(error2, expectedError2);
      //#endregion
    }
    finally {
      database.close();
      await _deleteDatabase({ databaseName: TEST_FIXTURES.PARAMETERS.databaseName });
    }

    t.pass();
  }
);

ava.serial(
  'core.webUtilities.indexedDB.deleteDatabase – invalid parameters',
  (t) => {
    const expectedError1 = new errors.TypeValidationError('databaseName', String);

    const error1 = t.throws(
      () => deleteDatabase.default({
        databaseName: null
      })
    );

    t.is(typeof error1, 'object');
    t.true(error1 instanceof errors.TypeValidationError);
    t.deepEqual(error1, expectedError1);
  }
);