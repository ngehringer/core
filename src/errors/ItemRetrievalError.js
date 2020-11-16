class ItemRetrievalError extends Error {
  constructor(
    {
      collectionName = null,
      itemName = null
    },
    ...rest
  ) {
    super(...rest);

    // define the error’s name
    this.name = ItemRetrievalError.name;

    // define the collection’s name
    this.collectionName = (
      (typeof collectionName === 'string')
      && (collectionName !== '')
    )
      ? collectionName
      : null
    ;

    // define the item’s name
    this.itemName = (
      (typeof itemName === 'string')
      && (itemName !== '')
    )
      ? itemName
      : null
    ;
  }

  get message() {
    return `Could not retrieve the item${
      (this.itemName === null)
        ? ''
        : ` “${this.itemName}”`
    } from the collection${
      (this.collectionName === null)
        ? ''
        : ` “${this.collectionName}”`
    }.`;
  }
}


export default ItemRetrievalError;