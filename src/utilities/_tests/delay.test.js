import ava from 'ava';

import * as errors from '../../errors/index.js';
import delay from '../delay.js';


const TEST_FIXTURES = Object.freeze({
  DELAY_MILLISECONDS: 1
});

ava(
  'core.utilities.delay',
  async (t) => {
    await delay(TEST_FIXTURES.DELAY_MILLISECONDS);

    t.pass();
  }
);

ava(
  'core.utilities.delay – invalid parameters',
  async (t) => {
    const expectedError1 = new errors.TypeValidationError('millisecondDuration', Number);

    const error1 = await t.throwsAsync(
      () => delay(null)
    );
    t.is(typeof error1, 'object');
    t.true(error1 instanceof errors.TypeValidationError);
    t.deepEqual(error1, expectedError1);
  }
);