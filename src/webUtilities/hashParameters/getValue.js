import * as errors from '../../errors/index.js';
import * as utilities from '../../utilities/index.js';
import getList from './getList.js';


const getValue = (key) => {
  if ( !utilities.validation.isNonEmptyString(key, String) ) throw new errors.TypeValidationError('key', String);

  // get a list of the URI fragment’s parameters as key / value pairs
  const keyValueList = getList();
  // extract the first parameter that matches the specified key, if any
  const parameter = keyValueList.find( (_parameter) => (_parameter.key === key) );
  // extract the parameter’s value
  const parameterValue = utilities.validation.validateType(parameter, Object)
    ? parameter.value
    : null
  ;

  return parameterValue;
};


export default getValue;