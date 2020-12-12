import * as errors from '../../errors/index.js';
import * as utilities from '../../utilities/index.js';
import getList from './getList.js';


/**
 * Retrieves the value of the specified `key` from the URI fragment (or `null`).
 */
const getValue = (key) => {
  // abort if the specified `key` parameter value is invalid
  if (
    (typeof key !== 'string')
    || !utilities.validation.isNonEmptyString(key, String)
  ) throw new errors.TypeValidationError('key', String);

  /**
   * A list of parameter key / value pairs from the URI fragment
   */
  const keyValueList = getList();

  /**
   * The first parameter matching the specified key, if any
   */
  const parameter = keyValueList.find( (_parameter) => (_parameter.key === key) );

  /**
   * The value of the first parameter matching the specified key (or `null`)
   */
  const parameterValue = (
    (typeof parameter === 'object')
    && (parameter !== null)
  )
    ? parameter.value
    : null
  ;

  return parameterValue;
};


export default getValue;