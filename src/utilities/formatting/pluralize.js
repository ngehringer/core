import * as errors from '../../errors/index.js';
import * as validation from '../validation/index.js';


const pluralize = (word, count) => {
  // ensure ‘word’ is a valid string
  if (
    !validation.validateType(word, String)
    || !(/^\w+$/).test(word)
  ) throw new errors.TypeValidationError('word', String);

  // coerce ‘count’ into an absolute value, and pluralize by default if it is unspecified or invalid
  const _count = validation.isNumber(count)
    ? Math.abs(count)
    // default: pluralize
    : 2
  ;

  if (_count === 1) return word;

  // TODO: Make less terrible?
  switch (word) {
    case 'has': return 'have';
    case 'is': return 'are';
    default: return `${word}s`;
  }
};


export default pluralize;