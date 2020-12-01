import * as errors from '../../errors/index.js';
import * as utilities from '../../utilities/index.js';
import getList from './getList.js';


const setValue = (keyValueDictionary) => {
  // abort if the specified list of parameters is not …
  if (
    // … an object …
    !utilities.validation.validateType(keyValueDictionary, Object)
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

  // get a list of the URI fragment’s parameters as key / value pairs
  const keyValueList = getList();

  // iterate over all of the key / value pairs
  for ( const [ key, value ] of Object.entries(keyValueDictionary) ) {
    // extract the first parameter that matches the specified key, if any
    const parameter = keyValueList.find( (_parameter) => (_parameter.key === key) );

    // if a parameter with the specified key already exists, and …
    if ( utilities.validation.validateType(parameter, Object) ) {
      // … the specified value is “null”, remove the parameter …
      if (value === null) {
        const parameterIndex = keyValueList.indexOf(parameter);
        keyValueList.splice(parameterIndex, 1);
      }
      // … otherwise, update the parameter’s value
      else {
        parameter.value = value;
      }
    }
    // … otherwise, as long as it isn’t “null”, add a new parameter to the list
    else if (value !== null) {
      keyValueList.push({
        key: key,
        value: value
      });
    }
  }

  // construct a string to represent the parameters
  const hash = keyValueList
    .map( (_parameter) => `${_parameter.key}=${_parameter.value}` )
    .join('&')
  ;

  // set the URI fragment
  window.location.hash = hash;

  return hash;
};


export default setValue;