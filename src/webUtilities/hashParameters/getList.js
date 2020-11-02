const getList = () => {
  if (window.location.hash.length === 0) return [];

  // construct a list of parameter key / value pairs from the hash fragment
  const hashParameterList = window.location.hash
    // remove the leading “#” from the hash fragment
    .slice(1)
    // split the hash fragment into individual parameters
    .split('&')
    // ensure each parameter is a well-formed key / value pair
    .filter( (parameter) => (parameter.indexOf('=') > 0) )
    // construct a list of key / value pairs for each parameter
    .map(
      (parameter) => ({
        'key': parameter.slice( 0, parameter.indexOf('=') ),
        'value': parameter.slice(parameter.indexOf('=') + 1)
      })
    )
  ;

  return hashParameterList;
};


export default getList;