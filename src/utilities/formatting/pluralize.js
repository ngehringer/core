import * as conversion from '../conversion/index.js';
import * as errors from '../../errors/index.js';
import * as validation from '../validation/index.js';
import pluralizeDictionary from './pluralize.dictionary.js';


/**
 * Pluralizes the specified `word` parameter, given an optional numeric `count`.
 */
const pluralize = (word, count) => {
  // abort if the specified `word` parameter value is not a string
  if (typeof word !== 'string') throw new errors.TypeValidationError('word', String);

  // abort if the specified `word` parameter value is not entirely composed of alphanumeric (/\w/) characters
  if ( !(/^\w+$/).test(word) ) throw new errors.InvalidParameterValueError({
    parameterName: 'word',
    reason: 'must contain only alphanumeric characters'
  });

  /**
   * The plurality count
   */
  const _count = validation.isNumber(count)
    // if the specified `count` parameter value is a number, get its absolute value; …
    ? Math.abs( conversion.convertToNumber(count) )
    // … otherwise, pluralize by default
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