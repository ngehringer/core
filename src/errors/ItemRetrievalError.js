class ItemRetrievalError extends Error {
  constructor(
    {
      itemName,
      collectionName = null
    },
    ...rest
  ) {
    super(...rest);

    // define the item’s name
    if (
      (typeof itemName !== 'string')
      || (itemName === '')
    ) throw new Error('“itemName” is not a non-empty string.');
    this.itemName = itemName;

    // define the collection’s name
    this.collectionName = (
      (typeof collectionName !== 'string')
      || (collectionName === '')
    )
      ? null
      : collectionName
    ;
  }

  get message() {
    return `Could not retrieve “${this.itemName}”${
      (this.collectionName === null)
        ? ''
        : ` from ${this.collectionName}`
      }).`
    ;
  }
}


export default ItemRetrievalError;