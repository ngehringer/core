import ava from 'ava';
import sinon from 'sinon';

import REFERENCE from '../../REFERENCE/index.js';
import BaseViewModel from '../BaseViewModel.js';


const TEST_FIXTURES = Object.freeze({
  DATA: {}
});

const getTestViewModel = ({
  getModelFake
}) => class extends BaseViewModel {
  getModel(data) {
    getModelFake?.(data);

    return { ...data };
  }
};

ava(
  'core.infrastructure.BaseViewModel – static data',
  (test) => {
    test.is(typeof BaseViewModel.CLASS_NAME, 'string');
  }
);

ava(
  'core.infrastructure.BaseViewModel',
  (test) => {
    const getModelFake = sinon.fake();

    const TestViewModel = getTestViewModel({
      getModelFake: getModelFake
    });

    const viewModel = new TestViewModel({
      data: TEST_FIXTURES.DATA
    });

    test.is(viewModel.data, TEST_FIXTURES.DATA);
    test.true( REFERENCE.UUID_REGEXP.test(viewModel.id) );
    test.deepEqual(viewModel.model, TEST_FIXTURES.DATA);
    test.is(getModelFake.callCount, 1);
    test.true( getModelFake.calledWithExactly(TEST_FIXTURES.DATA) );
  }
);