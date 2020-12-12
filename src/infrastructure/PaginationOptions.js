import * as errors from '../errors/index.js';
import * as utilities from '../utilities/index.js';


class PaginationOptions {
  static get CLASS_NAME() { return `@backwater-systems/core.infrastructure.${PaginationOptions.name}`; }

  static get DEFAULTS() {
    return Object.freeze({
      PAGE_SIZE: null,
      SORT_COLUMN: null,
      SORT_ORDER: null,
      START_INDEX: null
    });
  }

  static get REFERENCE() {
    return Object.freeze({
      ENUMERATIONS: Object.freeze({
        SORT_ORDER: Object.freeze({
          ASCENDING: 'ascending',
          DESCENDING: 'descending'
        })
      })
    });
  }

  constructor({
    pageSize,
    sortColumn,
    sortOrder,
    startIndex
  }) {
    if (
      (typeof pageSize === 'number')
      || (typeof pageSize === 'string')
    ) {
      /**
       * The `pageSize` parameter coerced to a `Number`
       */
      const _pageSize = utilities.conversion.convertToNumber(pageSize);
      if (
        !Number.isInteger(_pageSize)
        || (_pageSize < 1)
      ) throw new errors.InvalidParameterValueError({
        parameterName: 'pageSize',
        reason: 'not a positive integer'
      });

      /**
       * The number of items per page of data
       */
      this.pageSize = _pageSize;
    }
    else {
      this.pageSize = PaginationOptions.DEFAULTS.PAGE_SIZE;
    }

    /**
     * The name of the column that the data is sorted by
     */
    this.sortColumn = (
      (typeof sortColumn === 'string')
      && utilities.validation.isNonEmptyString(sortColumn)
    )
      ? sortColumn
      : PaginationOptions.DEFAULTS.SORT_COLUMN
    ;

    /**
     * The order that the data is sorted by (“ascending” or “descending”)
     */
    this.sortOrder = (
      (typeof sortOrder === 'string')
      && utilities.validation.validateEnumeration(sortOrder.toLowerCase(), PaginationOptions.REFERENCE.ENUMERATIONS.SORT_ORDER)
    )
      ? sortOrder.toLowerCase()
      : PaginationOptions.DEFAULTS.SORT_ORDER
    ;

    if (
      (typeof startIndex === 'number')
      || (typeof startIndex === 'string')
    ) {
      /**
       * The `startIndex` parameter coerced to a `Number`
       */
      const _startIndex = utilities.conversion.convertToNumber(startIndex);
      if (
        !Number.isInteger(_startIndex)
        || (_startIndex < 0)
      ) throw new errors.InvalidParameterValueError({
        parameterName: 'startIndex',
        reason: 'not a positive integer'
      });

      /**
       * The index of the first item of data
       */
      this.startIndex = _startIndex;
    }
    else {
      this.startIndex = PaginationOptions.DEFAULTS.START_INDEX;
    }

    /**
     * Whether the parameters necessary to perform paging were specified
     */
    this.pagingEnabled = (
      (this.pageSize !== null)
      && (this.startIndex !== null)
    );

    /**
     * Whether the parameters necessary to perform sorting were specified
     */
    this.sortingEnabled = (
      (this.sortColumn !== null)
      && (this.sortOrder !== null)
    );
  }
}


export default PaginationOptions;