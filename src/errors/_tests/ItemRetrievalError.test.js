import ava from 'ava';

import ItemRetrievalError from '../ItemRetrievalError.js';


const TEST_FIXTURES = Object.freeze({
  COLLECTION_NAME: 'COLLECTION_NAME',
  ITEM_NAME: 'ITEM_NAME'
});

ava(
  'core.errors.ItemRetrievalError',
  (test) => {
    const itemRetrievalError = new ItemRetrievalError({
      collectionName: TEST_FIXTURES.COLLECTION_NAME,
      itemName: TEST_FIXTURES.ITEM_NAME
    });

    test.is(typeof itemRetrievalError, 'object');
    test.true(itemRetrievalError instanceof Error);
    test.is(itemRetrievalError.message, `Could not retrieve the item “${TEST_FIXTURES.ITEM_NAME}” from the collection “${TEST_FIXTURES.COLLECTION_NAME}”.`);
    test.is(itemRetrievalError.name, ItemRetrievalError.name);
    test.is(itemRetrievalError.collectionName, TEST_FIXTURES.COLLECTION_NAME);
    test.is(itemRetrievalError.itemName, TEST_FIXTURES.ITEM_NAME);
  }
);

ava(
  'core.errors.ItemRetrievalError – unspecified parameters',
  (test) => {
    const itemRetrievalError = new ItemRetrievalError({});

    test.is(typeof itemRetrievalError, 'object');
    test.true(itemRetrievalError instanceof Error);
    test.is(itemRetrievalError.message, 'Could not retrieve the item from the collection.');
    test.is(itemRetrievalError.name, ItemRetrievalError.name);
    test.is(itemRetrievalError.collectionName, null);
    test.is(itemRetrievalError.itemName, null);
  }
);