import ava from 'ava';

import BaseFactory from '../BaseFactory.js';


class Parent {}
class Child1 extends Parent {}
class Child2 extends Parent {}

const TEST_FIXTURES = Object.freeze({
  CHILD_CLASS_1: Child1,
  CHILD_CLASS_2: Child2,
  PARENT_CLASS: Parent
});

const getTestFactory = () => class extends BaseFactory {
  static get _baseType() {
    return TEST_FIXTURES.PARENT_CLASS;
  }

  static get _initialTypeList() {
    return {
      [TEST_FIXTURES.CHILD_CLASS_1.name]: TEST_FIXTURES.CHILD_CLASS_1
    };
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
    const TestFactory = getTestFactory();

    test.is(typeof TestFactory.create, 'function');
    test.is(typeof TestFactory.registerType, 'function');
    test.is(typeof TestFactory.unregisterType, 'function');
    test.deepEqual(TestFactory.typeList, TestFactory._initialTypeList);

    // static registerType(typeName: string, typeClass: function)

    const error = test.throws(
      () => TestFactory.registerType(TEST_FIXTURES.CHILD_CLASS_1.name, TEST_FIXTURES.CHILD_CLASS_1)
    );

    test.is(typeof error, 'object');
    test.true(error instanceof Error);
    test.is(error.message, `“${TEST_FIXTURES.CHILD_CLASS_1.name}” is already a registered type.`);
    test.deepEqual(TestFactory.typeList, TestFactory._initialTypeList);

    TestFactory.registerType(TEST_FIXTURES.CHILD_CLASS_2.name, TEST_FIXTURES.CHILD_CLASS_2);

    test.deepEqual(
      TestFactory.typeList,
      {
        ...TestFactory._initialTypeList,
        [TEST_FIXTURES.CHILD_CLASS_2.name]: TEST_FIXTURES.CHILD_CLASS_2
      }
    );

    // static unregisterType(typeName: string)

    TestFactory.unregisterType(TEST_FIXTURES.CHILD_CLASS_2.name);

    test.deepEqual(TestFactory.typeList, TestFactory._initialTypeList);
  }
);