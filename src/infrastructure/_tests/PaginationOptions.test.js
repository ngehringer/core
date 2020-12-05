import ava from 'ava';

import * as errors from '../../errors/index.js';
import PaginationOptions from '../PaginationOptions.js';


const TEST_FIXTURES = Object.freeze({
  PAGE_SIZE: 10,
  SORT_COLUMN: 'sort_column',
  SORT_ORDER: PaginationOptions.REFERENCE.ENUMERATIONS.SORT_ORDER.ASCENDING,
  START_INDEX: 10
});

ava(
  'core.infrastructure.PaginationOptions – static data',
  (test) => {
    test.is(typeof PaginationOptions.CLASS_NAME, 'string');
    test.is(typeof PaginationOptions.DEFAULTS, 'object');
    test.is(PaginationOptions.DEFAULTS.PAGE_SIZE, null);
    test.is(PaginationOptions.DEFAULTS.SORT_COLUMN, null);
    test.is(PaginationOptions.DEFAULTS.SORT_ORDER, null);
    test.is(PaginationOptions.DEFAULTS.START_INDEX, null);
    test.is(typeof PaginationOptions.REFERENCE, 'object');
    test.is(typeof PaginationOptions.REFERENCE.ENUMERATIONS, 'object');
    test.is(typeof PaginationOptions.REFERENCE.ENUMERATIONS.SORT_ORDER, 'object');
    test.is(typeof PaginationOptions.REFERENCE.ENUMERATIONS.SORT_ORDER.ASCENDING, 'string');
    test.is(typeof PaginationOptions.REFERENCE.ENUMERATIONS.SORT_ORDER.DESCENDING, 'string');
  }
);

ava(
  'core.infrastructure.PaginationOptions',
  (test) => {
    const paginationOptions = new PaginationOptions({
      pageSize: TEST_FIXTURES.PAGE_SIZE,
      sortColumn: TEST_FIXTURES.SORT_COLUMN,
      sortOrder: TEST_FIXTURES.SORT_ORDER,
      startIndex: TEST_FIXTURES.START_INDEX
    });

    test.is(paginationOptions.pageSize, TEST_FIXTURES.PAGE_SIZE);
    test.is(paginationOptions.sortColumn, TEST_FIXTURES.SORT_COLUMN);
    test.is(paginationOptions.sortOrder, TEST_FIXTURES.SORT_ORDER);
    test.is(paginationOptions.startIndex, TEST_FIXTURES.START_INDEX);
    test.is(paginationOptions.pagingEnabled, true);
    test.is(paginationOptions.sortingEnabled, true);
  }
);

ava(
  'core.infrastructure.PaginationOptions – unspecified parameters',
  (test) => {
    const paginationOptions = new PaginationOptions({});

    test.is(paginationOptions.pageSize, PaginationOptions.DEFAULTS.PAGE_SIZE);
    test.is(paginationOptions.sortColumn, PaginationOptions.DEFAULTS.SORT_COLUMN);
    test.is(paginationOptions.sortOrder, PaginationOptions.DEFAULTS.SORT_ORDER);
    test.is(paginationOptions.startIndex, PaginationOptions.DEFAULTS.START_INDEX);
    test.is(paginationOptions.pagingEnabled, false);
    test.is(paginationOptions.sortingEnabled, false);
  }
);

ava(
  'core.infrastructure.PaginationOptions – invalid parameters',
  (test) => {
    const expectedError1 = new errors.InvalidParameterValueError({
      parameterName: 'pageSize',
      reason: 'not a positive integer'
    });

    const error1 = test.throws(
      () => new PaginationOptions({
        pageSize: -1,
        sortColumn: TEST_FIXTURES.SORT_COLUMN,
        sortOrder: TEST_FIXTURES.SORT_ORDER,
        startIndex: TEST_FIXTURES.START_INDEX
      })
    );
    test.is(typeof error1, 'object');
    test.true(error1 instanceof errors.InvalidParameterValueError);
    test.deepEqual(error1, expectedError1);

    const expectedError2 = new errors.InvalidParameterValueError({
      parameterName: 'startIndex',
      reason: 'not a positive integer'
    });

    const error2 = test.throws(
      () => new PaginationOptions({
        pageSize: TEST_FIXTURES.PAGE_SIZE,
        sortColumn: TEST_FIXTURES.SORT_COLUMN,
        sortOrder: TEST_FIXTURES.SORT_ORDER,
        startIndex: -1
      })
    );
    test.is(typeof error2, 'object');
    test.true(error2 instanceof errors.InvalidParameterValueError);
    test.deepEqual(error2, expectedError2);
  }
);