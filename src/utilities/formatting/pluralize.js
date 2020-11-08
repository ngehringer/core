import * as validation from '../validation/index.js';


const pluralize = (word, count) => {
  // coerce ‘count’ into an absolute value, and pluralize by default if it is unspecified or invalid
  const _count = validation.isNumber(count)
    ? Math.abs(count)
    // default: pluralize
    : 2
  ;

  if (_count === 1) return word;

  switch (word) {
    case 'has': return 'have';
    case 'is': return 'are';
    default: return `${word}s`;
  }
};


export default pluralize;