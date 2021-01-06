import ava from 'ava';

import deepCopy from '../deepCopy.js';


ava(
  'core.infrastructure.deepCopy – object',
  (t) => {
    const object1 = { key: 'value1' };
    const object2 = [ object1 ];
    const entity = {
      key1: object2,
      key2: 'property2'
    };

    const copiedEntity = deepCopy(entity);

    t.is(typeof copiedEntity, 'object');
    t.deepEqual(copiedEntity, entity);

    const object1KeyValue = object1.key;
    const object2Item1Value = { ...object2[0] };
    object1.key = 'value2';
    object2[0] = null;

    t.deepEqual(copiedEntity.key1[0], object2Item1Value);
    t.is(copiedEntity.key1[0].key, object1KeyValue);
  }
);

ava(
  'core.infrastructure.deepCopy – array',
  (t) => {
    const object1 = { key: 'value1' };
    const object2 = { key: object1 };
    const entity = [ object2, 'item2' ];

    const copiedEntity = deepCopy(entity);

    t.true( Array.isArray(copiedEntity) );
    t.deepEqual(copiedEntity, entity);

    const object1KeyValue = object1.key;
    const object2KeyValue = { ...object2.key };
    object1.key = 'value2';
    object2.key = null;

    t.deepEqual(copiedEntity[0].key, object2KeyValue);
    t.is(copiedEntity[0].key?.key, object1KeyValue);
  }
);

ava(
  'core.infrastructure.deepCopy – null',
  (t) => {
    const entity = null;

    const copiedEntity = deepCopy(entity);

    t.is(copiedEntity, entity);
  }
);

ava(
  'core.infrastructure.deepCopy – string',
  (t) => {
    const entity = 'entity';

    const copiedEntity = deepCopy(entity);

    t.is(typeof copiedEntity, typeof entity);
    t.is(copiedEntity, entity);
  }
);