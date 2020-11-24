import ava from 'ava';

import * as errors from '../../errors/index.js';
import BaseFactory from '../BaseFactory.js';


class Parent {}

const TEST_FIXTURES = Object.freeze({
  CHILD_CLASS_1: class Child1 extends Parent {},
  CHILD_CLASS_2: class Child2 extends Parent {},
  NON_CHILD_CLASS_1: class NonChild1 {},
  NON_CHILD_CLASS_2: class NonChild2 {},
  PARENT_CLASS: Parent
});

const getTestFactory = ({
  _baseType,
  _initialTypeRegister
}) => class TestFactory extends BaseFactory {
  static get _baseType() {
    return _baseType;
  }

  static get _initialTypeRegister() {
    return _initialTypeRegister;
  }
};

ava(
  'core.infrastructure.BaseFactory – static data',
  (test) => {
    test.is(typeof BaseFactory.CLASS_NAME, 'string');
  }
);

ava(
  'core.infrastructure.BaseFactory',
  (test) => {
    const TestFactory = getTestFactory({
      _baseType: TEST_FIXTURES.PARENT_CLASS,
      _initialTypeRegister: { [TEST_FIXTURES.CHILD_CLASS_1.name]: TEST_FIXTURES.CHILD_CLASS_1 }
    });

    test.is(typeof TestFactory.create, 'function');
    test.is(typeof TestFactory.registerType, 'function');
    test.is(typeof TestFactory.unregisterType, 'function');
    test.deepEqual(TestFactory.typeRegister, TestFactory._initialTypeRegister);

    // static registerType(typeName: string, typeClass: function)

    TestFactory.registerType(TEST_FIXTURES.CHILD_CLASS_2.name, TEST_FIXTURES.CHILD_CLASS_2);

    test.deepEqual(
      TestFactory.typeRegister,
      {
        ...TestFactory._initialTypeRegister,
        [TEST_FIXTURES.CHILD_CLASS_2.name]: TEST_FIXTURES.CHILD_CLASS_2
      }
    );

    // static create(typeName: string, options: object)

    const createdInstance1 = TestFactory.create(TEST_FIXTURES.CHILD_CLASS_1.name);

    test.is(typeof createdInstance1, 'object');
    test.true(createdInstance1 instanceof TEST_FIXTURES.CHILD_CLASS_1);

    // static unregisterType(typeName: string)

    TestFactory.unregisterType(TEST_FIXTURES.CHILD_CLASS_2.name);

    test.deepEqual(TestFactory.typeRegister, TestFactory._initialTypeRegister);
  }
);

ava(
  'core.infrastructure.BaseFactory.typeRegister – errors',
  (test) => {
    const TestFactory1 = getTestFactory({});

    const expectedError1 = new errors.ImplementationError('_baseType', TestFactory1.CLASS_NAME);

    const error1 = test.throws(
      () => TestFactory1.typeRegister
    );
    test.is(typeof error1, 'object');
    test.deepEqual(error1, expectedError1);

    const TestFactory2 = getTestFactory({
      _baseType: TEST_FIXTURES.PARENT_CLASS,
      _initialTypeRegister: { [TEST_FIXTURES.NON_CHILD_CLASS_1.name]: TEST_FIXTURES.NON_CHILD_CLASS_1 }
    });

    const expectedError2 = new errors.TypeValidationError(TEST_FIXTURES.NON_CHILD_CLASS_1.name, TEST_FIXTURES.PARENT_CLASS);

    const error2 = test.throws(
      () => TestFactory2.typeRegister
    );
    test.is(typeof error2, 'object');
    test.deepEqual(error2, expectedError2);

    const TestFactory3 = getTestFactory({
      _baseType: TEST_FIXTURES.PARENT_CLASS,
      _initialTypeRegister: {
        [TEST_FIXTURES.NON_CHILD_CLASS_1.name]: TEST_FIXTURES.NON_CHILD_CLASS_1,
        [TEST_FIXTURES.NON_CHILD_CLASS_2.name]: TEST_FIXTURES.NON_CHILD_CLASS_2
      }
    });

    const expectedError3 = new Error(
      [
        new errors.TypeValidationError(TEST_FIXTURES.NON_CHILD_CLASS_1.name, TEST_FIXTURES.PARENT_CLASS).message,
        new errors.TypeValidationError(TEST_FIXTURES.NON_CHILD_CLASS_2.name, TEST_FIXTURES.PARENT_CLASS).message
      ].join(' ')
    );

    const error3 = test.throws(
      () => TestFactory3.typeRegister
    );
    test.is(typeof error3, 'object');
    test.deepEqual(error3, expectedError3);
  }
);

ava(
  'core.infrastructure.BaseFactory.create – errors',
  (test) => {
    const TestFactory = getTestFactory({
      _baseType: TEST_FIXTURES.PARENT_CLASS
    });

    const expectedError1 = new errors.TypeValidationError('typeName', String);

    const error1 = test.throws(
      () => TestFactory.create(null)
    );
    test.is(typeof error1, 'object');
    test.deepEqual(error1, expectedError1);

    const expectedError2 = new Error(`“${TEST_FIXTURES.CHILD_CLASS_2.name}” is not a registered type.`);

    const error2 = test.throws(
      () => TestFactory.create(TEST_FIXTURES.CHILD_CLASS_2.name)
    );
    test.is(typeof error2, 'object');
    test.deepEqual(error2, expectedError2);
  }
);

ava(
  'core.infrastructure.BaseFactory.registerType – errors',
  (test) => {
    const TestFactory1 = getTestFactory({});

    const expectedError1 = new errors.ImplementationError('_baseType', TestFactory1.CLASS_NAME);

    const error1 = test.throws(
      () => TestFactory1.registerType(TEST_FIXTURES.CHILD_CLASS_2.name, TEST_FIXTURES.CHILD_CLASS_2)
    );
    test.is(typeof error1, 'object');
    test.deepEqual(error1, expectedError1);

    const TestFactory2 = getTestFactory({
      _baseType: TEST_FIXTURES.PARENT_CLASS,
      _initialTypeRegister: { [TEST_FIXTURES.CHILD_CLASS_1.name]: TEST_FIXTURES.CHILD_CLASS_1 }
    });

    const expectedError2 = new errors.TypeValidationError('typeName', String);

    const error2 = test.throws(
      () => TestFactory2.registerType(null, TEST_FIXTURES.CHILD_CLASS_2)
    );
    test.is(typeof error2, 'object');
    test.deepEqual(error2, expectedError2);

    const expectedError3 = new errors.TypeValidationError('typeClass', Function);

    const error3 = test.throws(
      () => TestFactory2.registerType(TEST_FIXTURES.CHILD_CLASS_2.name, null)
    );
    test.is(typeof error3, 'object');
    test.deepEqual(error3, expectedError3);

    const expectedError4 = new errors.TypeValidationError('typeClass', TestFactory2._baseType);

    const error4 = test.throws(
      () => TestFactory2.registerType(TEST_FIXTURES.CHILD_CLASS_2.name, () => {})
    );
    test.is(typeof error4, 'object');
    test.deepEqual(error4, expectedError4);

    const expectedError5 = new Error(`“${TEST_FIXTURES.CHILD_CLASS_1.name}” is already a registered type.`);

    const error5 = test.throws(
      () => TestFactory2.registerType(TEST_FIXTURES.CHILD_CLASS_1.name, TEST_FIXTURES.CHILD_CLASS_1)
    );
    test.is(typeof error5, 'object');
    test.deepEqual(error5, expectedError5);
  }
);

ava(
  'core.infrastructure.BaseFactory.unregisterType – errors',
  (test) => {
    const TestFactory = getTestFactory({
      _baseType: TEST_FIXTURES.PARENT_CLASS,
      _initialTypeRegister: { [TEST_FIXTURES.CHILD_CLASS_1.name]: TEST_FIXTURES.CHILD_CLASS_1 }
    });

    const expectedError1 = new errors.TypeValidationError('typeName', String);

    const error1 = test.throws(
      () => TestFactory.unregisterType(null, TEST_FIXTURES.CHILD_CLASS_2)
    );
    test.is(typeof error1, 'object');
    test.deepEqual(error1, expectedError1);

    const expectedError2 = new Error(`“${TEST_FIXTURES.CHILD_CLASS_2.name}” is not a registered type.`);

    const error2 = test.throws(
      () => TestFactory.unregisterType(TEST_FIXTURES.CHILD_CLASS_2.name)
    );
    test.is(typeof error2, 'object');
    test.deepEqual(error2, expectedError2);
  }
);