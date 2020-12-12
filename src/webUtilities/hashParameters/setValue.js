import * as errors from '../../errors/index.js';
import * as utilities from '../../utilities/index.js';
import getList from './getList.js';


/**
 * Serializes the key / value pairs in the specified `keyValueDictionary` into the URI fragment.
 */
const setValue = (keyValueDictionary) => {
  // abort if the specified `keyValueDictionary` parameter value is not …
  if (
    // … an object …
    (
      (typeof keyValueDictionary !== 'object')
      || (keyValueDictionary === null)
    )
    // … where every …
    || !Object.entries(keyValueDictionary).every(
      ([ key, value ]) => (
        // … key is a non-empty string …
        utilities.validation.isNonEmptyString(key)
        // … and, value is …
        && (
          // … a non-empty string …
          utilities.validation.isNonEmptyString(value)
          // … or null
          || (value === null)
        )
      )
    )
  ) throw new errors.TypeValidationError('valueList', Object);

  /**
   * A list of the URI fragment’s parameters as key / value pairs
   */
  const keyValueList = getList();

  // iterate over all of the key / value pairs
  for ( const [ key, value ] of Object.entries(keyValueDictionary) ) {
    /**
     * The first parameter matching the specified key, if any
     */
    const parameter = keyValueList.find( (_parameter) => (_parameter.key === key) );

    // if a parameter with the specified key already exists, and …
    if (typeof parameter === 'object') {
      // … the specified value is `null`, remove the parameter …
      if (value === null) {
        keyValueList.splice(keyValueList.indexOf(parameter), 1);
      }
      // … otherwise, update the parameter’s value
      else {
        parameter.value = value;
      }
    }
    // … otherwise, as long as it isn’t `null`, add a new parameter to the list
    else if (value !== null) {
      keyValueList.push({
        key: key,
        value: value
      });
    }
  }

  /**
   * A serialized string of the parameter key / value pairs
   */
  const hash = keyValueList
    .map( (_parameter) => `${_parameter.key}=${_parameter.value}` )
    .join('&')
  ;

  // set the URI fragment
  window.location.hash = hash;

  return hash;
};


export default setValue;