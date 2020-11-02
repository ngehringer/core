import * as errors from '../../errors/index.js';
import * as utilities from '../../utilities/index.js';
import getList from './getList.js';


const setValue = (valueList) => {
  // ensure the specified list of parameters is well-formed
  if (
    !utilities.validateType(valueList, Object)
    || !Object.keys(valueList).every( (key) => utilities.isNonEmptyString(key) )
    || !Object.keys(valueList).every(
      (key) => (
        utilities.isNonEmptyString(valueList[key])
        || (valueList[key] === null)
      )
    )
  ) throw new errors.TypeValidationError('valueList', Object);

  // get a list of the hash fragment’s parameters (key / value pairs)
  const hashParameterList = getList();

  // iterate over all the specified key / value pairs
  for ( const key of Object.keys(valueList) ) {
    const value = valueList[key];

    // extract the first parameter that matches the specified key, if any
    const parameter = hashParameterList.find( (_parameter) => (_parameter.key === key) );

    // if a parameter with the specified key already exists, and …
    if ( utilities.validateType(parameter, Object) ) {
      // … the specified value is “null”, remove the parameter …
      if (value === null) {
        const parameterIndex = hashParameterList.indexOf(parameter);
        hashParameterList.splice(parameterIndex, 1);
      }
      // … otherwise, update the parameter’s value
      else {
        parameter.value = value;
      }
    }
    // … otherwise, add a new parameter to the list (as long as it isn’t “null”)
    else {
      if (value !== null) {
        hashParameterList.push({
          'key': key,
          'value': value
        });
      }
    }
  }

  // construct a string to represent the parameters
  const hash = hashParameterList
    .map( (_parameter) => `${_parameter.key}=${_parameter.value}` )
    .join('&')
  ;
  // set the hash fragment
  window.location.hash = hash;
};


export default setValue;