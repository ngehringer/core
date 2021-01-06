import * as errors from '../errors/index.js';
import * as utilities from '../utilities/index.js';


class BaseModel {
  static get CLASS_NAME() { return `@backwater-systems/core.infrastructure.${BaseModel.name}`; }

  static get DEFAULTS() {
    return Object.freeze({
      id: utilities.generateUUID
    });
  }

  constructor({
    data,
    id = BaseModel.DEFAULTS.id()
  }) {
    // abort if the specified `data` parameter value is not an object
    if (
      (typeof data !== 'object')
      || (data === null)
    ) throw new errors.TypeValidationError('data', Object);

    /**
     * The source data for the model
     */
    this.data = data;

    /**
     * A unique ID for the model
     */
    this.id = (
      (typeof id === 'string')
      && ( utilities.validation.isNonEmptyString(id) )
    )
      ? id
      : BaseModel.DEFAULTS.id()
    ;
  }

  /**
   * The model evaluated from the source data
   */
  get model() {
    return utilities.deepCopy(this.data);
  }
}


export default BaseModel;