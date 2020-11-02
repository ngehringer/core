import * as errors from '../../errors/index.js';
import * as utilities from '../../utilities/index.js';
import getList from './getList.js';


const getValue = (key) => {
  if ( !utilities.isNonEmptyString(key, String) ) throw new errors.TypeValidationError('key', String);

  // get a list of the hash fragment’s parameters (key / value pairs)
  const hashParameterList = getList();
  // extract the first parameter that matches the specified key, if any
  const parameter = hashParameterList.find( (_parameter) => (_parameter.key === key) );
  // extract the parameter’s value
  const parameterValue = utilities.validateType(parameter, Object)
    ? parameter.value
    : null
  ;

  return parameterValue;
};


export default getValue;