import ava from 'ava';

import * as errors from '../../../errors/index.js';
import * as logging from '../../../logging/index.js';
import * as openDatabase from '../openDatabase.js';
import REFERENCE from '../REFERENCE.js';


const TEST_FIXTURES = Object.freeze({
  PARAMETERS: Object.freeze({
    databaseEventListeners: {
      abort: [],
      close: [],
      error: [
        () => {}
      ],
      versionchange: []
    },
    databaseName: 'test_openDatabase',
    databaseVersion: 2,
    debug: true,
    logger: logging.NullLogger,
    openDBRequestEventListeners: {
      blocked: [],
      error: [
        () => {}
      ],
      success: [],
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
  databaseName,
  databaseVersion
}) => new Promise(
  (resolve, reject) => {
    const idbOpenDBRequest = indexedDB.open(databaseName, databaseVersion);

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
  'core.webUtilities.indexedDB.openDatabase – test environment setup',
  async () => {
    // use “fake-indexeddb” to populate the following in the global scope …
    // - `indexedDB`
    await import('fake-indexeddb/auto.js');
  }
);

ava(
  'core.webUtilities.indexedDB.openDatabase – static data',
  (t) => {
    t.is(typeof openDatabase.DEFAULTS, 'object');
    t.is(openDatabase.DEFAULTS.DEBUG, false);
    t.is(typeof openDatabase.DEFAULTS.DATABASE_VERSION, 'number');
    t.is(openDatabase.DEFAULTS.LOGGER, logging.ConsoleLogger);
    t.is(typeof openDatabase.DEFAULTS.DATABASE_EVENT_LISTENERS, 'object');
    t.true( Array.isArray(openDatabase.DEFAULTS.DATABASE_EVENT_LISTENERS.abort) );
    t.true( Array.isArray(openDatabase.DEFAULTS.DATABASE_EVENT_LISTENERS.close) );
    t.true( Array.isArray(openDatabase.DEFAULTS.DATABASE_EVENT_LISTENERS.error) );
    t.true( Array.isArray(openDatabase.DEFAULTS.DATABASE_EVENT_LISTENERS.versionchange) );
    t.is(typeof openDatabase.DEFAULTS.OPEN_DB_REQUEST_EVENT_LISTENERS, 'object');
    t.true( Array.isArray(openDatabase.DEFAULTS.OPEN_DB_REQUEST_EVENT_LISTENERS.blocked) );
    t.true( Array.isArray(openDatabase.DEFAULTS.OPEN_DB_REQUEST_EVENT_LISTENERS.error) );
    t.true( Array.isArray(openDatabase.DEFAULTS.OPEN_DB_REQUEST_EVENT_LISTENERS.success) );
    t.true( Array.isArray(openDatabase.DEFAULTS.OPEN_DB_REQUEST_EVENT_LISTENERS.upgradeneeded) );
    t.is(typeof openDatabase.MODULE_ID, 'string');
    t.is(typeof openDatabase.openDatabase, 'function');
    t.is(openDatabase.default, openDatabase.openDatabase);
  }
);

ava.serial(
  'core.webUtilities.indexedDB.openDatabase – "success"; nonexistent database; unspecified parameters',
  async (t) => {
    const database = await openDatabase.default({
      databaseEventListeners: null,
      databaseName: TEST_FIXTURES.PARAMETERS.databaseName,
      databaseVersion: null,
      debug: null,
      logger: null,
      openDBRequestEventListeners: null
    });

    database.close();
    await _deleteDatabase({ databaseName: TEST_FIXTURES.PARAMETERS.databaseName });

    t.is(typeof database, 'object');
    t.true(database instanceof IDBDatabase);
  }
);

ava.serial(
  'core.webUtilities.indexedDB.openDatabase – "blocked"',
  async (t) => {
    const database1 = await _openDatabase({
      databaseName: TEST_FIXTURES.PARAMETERS.databaseName,
      databaseVersion: TEST_FIXTURES.PARAMETERS.databaseVersion
    });

    try {
      //#region debug = true
      const promise1 = new Promise(
        async (resolve, reject) => {
          try {
            const expectedError = new Error(`Opening the IndexedDB database “${TEST_FIXTURES.PARAMETERS.databaseName}“ failed (“${REFERENCE.ENUMERATIONS.EVENT_TYPES.OPEN_DB_REQUEST.BLOCKED}”).`);

            const error = await t.throwsAsync(
              () => openDatabase.default({
                databaseEventListeners: TEST_FIXTURES.PARAMETERS.databaseEventListeners,
                databaseName: TEST_FIXTURES.PARAMETERS.databaseName,
                databaseVersion: TEST_FIXTURES.PARAMETERS.databaseVersion + 1,
                debug: TEST_FIXTURES.PARAMETERS.debug,
                logger: TEST_FIXTURES.PARAMETERS.logger,
                openDBRequestEventListeners: {
                  success: [
                    () => {
                      resolve();
                    }
                  ]
                }
              })
            );

            database1.close();

            t.is(typeof error, 'object');
            t.true(error instanceof Error);
            t.deepEqual(error, expectedError);
          }
          catch (error) {
            reject(error);
          }
        }
      );
      await promise1;
      //#endregion

      const database2 = await _openDatabase({
        databaseName: TEST_FIXTURES.PARAMETERS.databaseName,
        databaseVersion: TEST_FIXTURES.PARAMETERS.databaseVersion + 1
      });

      //#region debug = false
      const promise2 = new Promise(
        async (resolve, reject) => {
          try {
            const expectedError = new Error(`Opening the IndexedDB database “${TEST_FIXTURES.PARAMETERS.databaseName}“ failed (“${REFERENCE.ENUMERATIONS.EVENT_TYPES.OPEN_DB_REQUEST.BLOCKED}”).`);

            const error = await t.throwsAsync(
              () => openDatabase.default({
                databaseEventListeners: TEST_FIXTURES.PARAMETERS.databaseEventListeners,
                databaseName: TEST_FIXTURES.PARAMETERS.databaseName,
                databaseVersion: TEST_FIXTURES.PARAMETERS.databaseVersion + 2,
                debug: false,
                logger: TEST_FIXTURES.PARAMETERS.logger,
                openDBRequestEventListeners: {
                  success: [
                    () => {
                      resolve();
                    }
                  ]
                }
              })
            );

            database2.close();

            t.is(typeof error, 'object');
            t.true(error instanceof Error);
            t.deepEqual(error, expectedError);
          }
          catch (error) {
            reject(error);
          }
        }
      );
      await promise2;
      //#endregion
    }
    finally {
      await _deleteDatabase({ databaseName: TEST_FIXTURES.PARAMETERS.databaseName });
    }

    t.pass();
  }
);

ava.serial(
  'core.webUtilities.indexedDB.openDatabase – "error"',
  async (t) => {
    const database = await _openDatabase({
      databaseName: TEST_FIXTURES.PARAMETERS.databaseName,
      databaseVersion: TEST_FIXTURES.PARAMETERS.databaseVersion
    });

    try {
      //#region debug = true
      const error1 = await t.throwsAsync(
        () => openDatabase.default({
          databaseEventListeners: TEST_FIXTURES.PARAMETERS.databaseEventListeners,
          databaseName: TEST_FIXTURES.PARAMETERS.databaseName,
          databaseVersion: TEST_FIXTURES.PARAMETERS.databaseVersion - 1,
          debug: TEST_FIXTURES.PARAMETERS.debug,
          logger: TEST_FIXTURES.PARAMETERS.logger,
          openDBRequestEventListeners: TEST_FIXTURES.PARAMETERS.openDBRequestEventListeners
        })
      );

      t.is(typeof error1, 'object');
      t.true(error1 instanceof Error);
      t.is(error1.name, 'VersionError');
      //#endregion

      //#region debug = false
      const error2 = await t.throwsAsync(
        () => openDatabase.default({
          databaseEventListeners: TEST_FIXTURES.PARAMETERS.databaseEventListeners,
          databaseName: TEST_FIXTURES.PARAMETERS.databaseName,
          databaseVersion: TEST_FIXTURES.PARAMETERS.databaseVersion - 1,
          debug: false,
          logger: TEST_FIXTURES.PARAMETERS.logger,
          openDBRequestEventListeners: TEST_FIXTURES.PARAMETERS.openDBRequestEventListeners
        })
      );

      t.is(typeof error2, 'object');
      t.true(error2 instanceof Error);
      t.is(error2.name, 'VersionError');
      //#endregion
    }
    finally {
      database.close();
      await _deleteDatabase({ databaseName: TEST_FIXTURES.PARAMETERS.databaseName });
    }
  }
);

ava.serial(
  'core.webUtilities.indexedDB.openDatabase – invalid parameters',
  (t) => {
    const expectedError1 = new errors.TypeValidationError('databaseName', String);

    const error1 = t.throws(
      () => openDatabase.default({
        databaseName: null
      })
    );

    t.is(typeof error1, 'object');
    t.true(error1 instanceof errors.TypeValidationError);
    t.deepEqual(error1, expectedError1);
  }
);