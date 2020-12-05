import * as errors from '../../errors/index.js';
import * as validation from '../validation/index.js';
import pluralizeDictionary from './pluralize.dictionary.js';


const pluralize = (word, count) => {
  // abort if the specified ‘word’ parameter is not a string
  if ( !validation.validateType(word, String) ) throw new errors.TypeValidationError('word', String);

  // abort if the specified ‘word’ parameter is not entirely composed of alphanumeric (/\w/) characters
  if ( !(/^\w+$/).test(word) ) throw new errors.InvalidParameterValueError({
    parameterName: 'word',
    reason: 'must contain only alphanumeric characters'
  });

  // define the plurality count …
  const _count = validation.isNumber(count)
    // … by coercing the specified ‘count’ parameter into an absolute numeric value, …
    ? Math.abs(count)
    // … pluralizing by default if it is unspecified or invalid
    : 2
  ;

  // singular: return the word
  if (_count === 1) return word;

  // plural: …

  // … if the word is in the dictionary of words with an irregular plural form …
  if ( Object.keys(pluralizeDictionary).includes(word) ) {
    // … return the plural from the dictionary
    return pluralizeDictionary[word];
  }

  // … regular words: return the word suffixed with an “s”
  return `${word}s`;
};


export default pluralize;