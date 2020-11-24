import ava from 'ava';
import sinon from 'sinon';

import * as errors from '../../errors/index.js';
import REFERENCE from '../../REFERENCE/index.js';
import BaseModel from '../BaseModel.js';


const TEST_FIXTURES = Object.freeze({
  DATA: {},
  INVALID_DATA: { invalid: true }
});

const getTestModel = ({
  getModelFake
}) => class TestModel extends BaseModel {
  getModel(data) {
    return (typeof getModelFake === 'function')
      ? getModelFake(data)
      : { ...data }
    ;
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
    const getModelFake = sinon.fake(
      (data) => ({ ...data })
    );

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

ava(
  'core.infrastructure.BaseModel – unimplemented “getModel” function',
  (test) => {
    const TestModel = class extends BaseModel {};

    const expectedError = new errors.ImplementationError('getModel', TestModel.CLASS_NAME);

    const error = test.throws(
      () => new TestModel({
        data: TEST_FIXTURES.DATA
      })
    );
    test.is(typeof error, 'object');
    test.deepEqual(error, expectedError);
  }
);

ava(
  'core.infrastructure.BaseModel.setData – errors',
  (test) => {
    const getModelFake = sinon.fake(
      (data) => (
        (data === TEST_FIXTURES.INVALID_DATA)
          ? null
          : { ...data }
      )
    );

    const TestModel = getTestModel({
      getModelFake: getModelFake
    });

    const testModel = new TestModel({ data: TEST_FIXTURES.DATA });

    const expectedError1 = new errors.TypeValidationError('data', Object);

    const error1 = test.throws(
      () => testModel.setData()
    );
    test.is(typeof error1, 'object');
    test.deepEqual(error1, expectedError1);

    const expectedError2 = new errors.TypeValidationError('model', Object);

    const error2 = test.throws(
      () => testModel.setData(TEST_FIXTURES.INVALID_DATA)
    );
    test.is(typeof error2, 'object');
    test.deepEqual(error2, expectedError2);
  }
);