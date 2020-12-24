import * as errors from '../errors/index.js';
import * as utilities from '../utilities/index.js';


class BaseModel {
  static get CLASS_NAME() { return `@backwater-systems/core.infrastructure.${BaseModel.name}`; }

  constructor({ data }) {
    // abort if the specified `data` parameter value is not an object
    if (
      (typeof data !== 'object')
      || (data === null)
    ) throw new errors.TypeValidationError('data', Object);

    /** The (cached) source data for the model */
    this.data = data;

    /**
     * A unique ID for the model
     */
    this.id = utilities.generateUUID();
  }

  /**
   * The model evaluated from the source data
   */
  get model() {
    return { ...this.data };
  }
}


export default BaseModel;