import * as errors from '../errors/index.js';
import * as utilities from '../utilities/index.js';


class BaseModel {
  static get CLASS_NAME() { return `@backwater-systems/core.infrastructure.${BaseModel.name}`; }

  constructor({ data }) {
    // abort if the extending class does not implement a `getModel` function
    if (typeof this.getModel !== 'function') throw new errors.ImplementationError('getModel', this.constructor.CLASS_NAME);

    /**
     * A unique ID for the model
     */
    this.id = utilities.generateUUID();

    this.setData(data);
  }

  setData(data) {
    // abort if the specified `data` parameter value is not an object
    if (
      (typeof data !== 'object')
      || (data === null)
    ) throw new errors.TypeValidationError('data', Object);

    /**
     * The model’s source data
     */
    this.data = data;

    /**
     * The model evaluated from the source data
     */
    const model = this.getModel(data);

    // abort if the model did not evaluate to an object
    if (
      (typeof model !== 'object')
      || (model === null)
    ) throw new errors.TypeValidationError('model', Object);

    /**
     * The model evaluated from the source data
     */
    this.model = model;
  }
}


export default BaseModel;