import * as errors from '../errors/index.js';


/**
 * Asynchronously delays for the specified duration (milliseconds).
 */
const delay = async (millisecondDuration) => {
  if (
    (typeof millisecondDuration !== 'number')
    || (millisecondDuration <= 0)
  ) throw new errors.TypeValidationError('millisecondDuration', Number);

  await new Promise(
    (resolve) => {
      setTimeout(
        () => {
          resolve();
        },
        millisecondDuration
      );
    }
  );
};


export default delay;