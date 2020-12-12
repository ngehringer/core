class ItemRetrievalError extends Error {
  constructor(
    {
      collectionName = null,
      itemName = null
    },
    ...rest
  ) {
    super(...rest);

    /**
     * The error name
     */
    this.name = ItemRetrievalError.name;

    /**
     * The name of the item collection
     */
    this.collectionName = (
      (typeof collectionName === 'string')
      && (collectionName !== '')
    )
      ? collectionName
      : null
    ;

    /**
     * The name of the item that could not be retrieved
     */
    this.itemName = (
      (typeof itemName === 'string')
      && (itemName !== '')
    )
      ? itemName
      : null
    ;

    /**
     * The error message
     */
    this.message = `Could not retrieve the item${
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