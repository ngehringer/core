import ava from 'ava';
import sinon from 'sinon';

import REFERENCE from '../../REFERENCE/index.js';
import BaseModel from '../BaseModel.js';


const TEST_FIXTURES = Object.freeze({
  DATA: {}
});

const getTestModel = ({
  getModelFake
}) => class extends BaseModel {
  getModel(data) {
    getModelFake?.(data);

    return { ...data };
  }
};

ava(
  'core.infrastructure.BaseModel – static data',
  (test) => {
    test.is(typeof BaseModel.CLASS_NAME, 'string');
  }
);

ava(
  'core.infrastructure.BaseModel',
  (test) => {
    const getModelFake = sinon.fake();

    const TestModel = getTestModel({
      getModelFake: getModelFake
    });

    const model = new TestModel({
      data: TEST_FIXTURES.DATA
    });

    test.is(model.data, TEST_FIXTURES.DATA);
    test.true( REFERENCE.UUID_REGEXP.test(model.id) );
    test.deepEqual(model.model, TEST_FIXTURES.DATA);
    test.is(getModelFake.callCount, 1);
    test.true( getModelFake.calledWithExactly(TEST_FIXTURES.DATA) );
  }
);