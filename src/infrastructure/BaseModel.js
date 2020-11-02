import * as errors from '../errors/index.js';
import * as utilities from '../utilities/index.js';


class BaseModel {
  static get CLASS_NAME() { return `@backwater-systems/core.infrastructure.${BaseModel.name}`; }

  constructor({ data }) {
    // ensure the extending class implements a “getModel” function
    if ( !utilities.validateType(this.getModel, Function) ) throw new errors.ImplementationError('getModel', this.constructor.CLASS_NAME);

    // generate a unique ID for the model
    this.id = utilities.generateUUID();

    this.setData(data);
  }

  setData(data) {
    // ensure the model’s source data is valid
    if ( !utilities.validateType(data, Object) ) throw new errors.TypeValidationError('data', Object);

    // evaluate the model from its source data
    const model = this.getModel(data);

    // ensure the model evaluated to an object
    if ( !utilities.validateType(model, Object) ) throw new errors.TypeValidationError('model', Object);

    this.model = model;
  }
}


export default BaseModel;