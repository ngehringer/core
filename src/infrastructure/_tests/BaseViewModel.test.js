import ava from 'ava';
import sinon from 'sinon';

import REFERENCE from '../../REFERENCE/index.js';
import BaseViewModel from '../BaseViewModel.js';


const TEST_FIXTURES = Object.freeze({
  PARAMETERS: Object.freeze({
    DATA: {}
  })
});

const getTestViewModel = ({
  getModelFake
}) => class TestViewModel extends BaseViewModel {
  get model() {
    getModelFake?.();

    return super.model;
  }
};

ava(
  'core.infrastructure.BaseViewModel – static data',
  (t) => {
    t.is(typeof BaseViewModel.CLASS_NAME, 'string');
    t.is(typeof BaseViewModel.DEFAULTS, 'object');
    t.is(typeof BaseViewModel.DEFAULTS.id, 'function');
  }
);

ava(
  'core.infrastructure.BaseViewModel',
  (t) => {
    const getModelFake = sinon.fake();

    const TestViewModel = getTestViewModel({
      getModelFake: getModelFake
    });

    const viewModel = new TestViewModel({
      data: TEST_FIXTURES.PARAMETERS.DATA
    });

    t.is(viewModel.data, TEST_FIXTURES.PARAMETERS.DATA);
    t.true( REFERENCE.UUID_REGEXP.test(viewModel.id) );
    t.deepEqual(viewModel.model, TEST_FIXTURES.PARAMETERS.DATA);
    t.is(getModelFake.callCount, 1);
  }
);