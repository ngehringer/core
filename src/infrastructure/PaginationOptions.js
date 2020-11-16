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
    if ( utilities.validation.isNumber(pageSize) ) {
      const _pageSize = Number(pageSize);
      if (
        !Number.isInteger(_pageSize)
        || (_pageSize < 1)
      ) throw new Error('‘pageSize’ is not a positive integer.');

      this.pageSize = _pageSize;
    }
    else {
      this.pageSize = PaginationOptions.DEFAULTS.PAGE_SIZE;
    }

    this.sortColumn = utilities.validation.isNonEmptyString(sortColumn)
      ? sortColumn
      : PaginationOptions.DEFAULTS.SORT_COLUMN
    ;

    this.sortOrder = (
      utilities.validation.validateType(sortOrder, String)
      && utilities.validation.validateEnumeration(sortOrder.toLowerCase(), PaginationOptions.REFERENCE.ENUMERATIONS.SORT_ORDER)
    )
      ? sortOrder.toLowerCase()
      : PaginationOptions.DEFAULTS.SORT_ORDER
    ;

    if ( utilities.validation.isNumber(startIndex) ) {
      const _startIndex = Number(startIndex);
      if (
        !Number.isInteger(_startIndex)
        || (_startIndex < 0)
      ) throw new Error('‘startIndex’ is not a positive integer.');

      this.startIndex = _startIndex;
    }
    else {
      this.startIndex = PaginationOptions.DEFAULTS.START_INDEX;
    }

    // indicate if the parameters necessary to perform paging were provided
    this.pagingEnabled = (
      (this.pageSize !== null)
      && (this.startIndex !== null)
    );

    // indicate if the parameters necessary to perform sorting were provided
    this.sortingEnabled = (
      (this.sortColumn !== null)
      && (this.sortOrder !== null)
    );
  }
}


export default PaginationOptions;