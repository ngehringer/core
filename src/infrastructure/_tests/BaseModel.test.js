import ava from 'ava';
import sinon from 'sinon';

import * as errors from '../../errors/index.js';
import REFERENCE from '../../REFERENCE/index.js';
import BaseModel from '../BaseModel.js';


const TEST_FIXTURES = Object.freeze({
  PARAMETERS: Object.freeze({
    DATA: {}
  })
});

const getTestModel = ({
  getModelFake
}) => class TestModel extends BaseModel {
  get model() {
    getModelFake?.();

    return super.model;
  }
};

ava(
  'core.infrastructure.BaseModel – static data',
  (t) => {
    t.is(typeof BaseModel.CLASS_NAME, 'string');
  }
);

ava(
  'core.infrastructure.BaseModel',
  (t) => {
    const getModelFake = sinon.fake();

    const TestModel = getTestModel({
      getModelFake: getModelFake
    });

    const model = new TestModel({ data: TEST_FIXTURES.PARAMETERS.DATA });

    t.is(model.data, TEST_FIXTURES.PARAMETERS.DATA);
    t.true( REFERENCE.UUID_REGEXP.test(model.id) );
    t.deepEqual(model.model, TEST_FIXTURES.PARAMETERS.DATA);
    t.is(getModelFake.callCount, 1);
  }
);

ava(
  'core.infrastructure.BaseModel – errors',
  (t) => {
    const TestModel = getTestModel({});

    const expectedError1 = new errors.TypeValidationError('data', Object);

    const error1 = t.throws(
      () => new TestModel({ data: null })
    );
    t.is(typeof error1, 'object');
    t.deepEqual(error1, expectedError1);

    const expectedError2 = new TypeError(`Cannot set property ${'model'} of #<${TestModel.name}> which has only a getter`);

    const error2 = t.throws(
      () => {
        const testModel = new TestModel({ data: TEST_FIXTURES.PARAMETERS.DATA });
        testModel.model = null;
      }
    );
    t.is(typeof error2, 'object');
    t.deepEqual(error2, expectedError2);
  }
);