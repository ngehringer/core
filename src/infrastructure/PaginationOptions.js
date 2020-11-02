import * as utilities from '../utilities/index.js';
import REFERENCE from '../REFERENCE/index.js';


class PaginationOptions {
  constructor({
    pageSize,
    sortColumn,
    sortOrder,
    startIndex
  }) {
    if ( utilities.isNumber(pageSize) ) {
      const _pageSize = Number(pageSize);
      if (
        !Number.isInteger(_pageSize)
        || (_pageSize < 1)
      ) throw new Error('‘pageSize’ is not a positive integer.');

      this.pageSize = _pageSize;
    }
    else {
      this.pageSize = null;
    }

    this.sortColumn = utilities.isNonEmptyString(sortColumn)
      ? sortColumn
      : null
    ;

    this.sortOrder = (
      utilities.validateType(sortOrder, String)
      && utilities.validateEnumeration(sortOrder.toLowerCase(), REFERENCE.ENUM.SortOrder)
    )
      ? sortOrder.toLowerCase()
      : null
    ;

    if ( utilities.isNumber(startIndex) ) {
      const _startIndex = Number(startIndex);
      if (
        !Number.isInteger(_startIndex)
        || (_startIndex < 0)
      ) throw new Error('‘startIndex’ is not a positive integer.');

      this.startIndex = _startIndex;
    }
    else {
      this.startIndex = null;
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