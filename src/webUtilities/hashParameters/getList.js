const getList = () => {
  // return an empty list if the URI fragment is the empty string
  if (window.location.hash.length === 0) return [];

  // construct a list of parameter key / value pairs from the URI fragment
  const keyValueList = window.location.hash
    // remove the leading “#” from the URI fragment
    .slice(1)
    // split the URI fragment into individual parameters (delimited by “&”)
    .split('&')
    // remove any parameter that is not a well-formed key / value pair (delimited by “=”)
    .filter( (parameter) => (parameter.indexOf('=') > 0) )
    // construct a key / value pair for each parameter
    .map(
      (parameter) => ({
        key: parameter.slice( 0, parameter.indexOf('=') ),
        value: parameter.slice(parameter.indexOf('=') + 1)
      })
    )
  ;

  return keyValueList;
};


export default getList;