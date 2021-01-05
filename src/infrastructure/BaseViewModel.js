import BaseModel from './BaseModel.js';


class BaseViewModel extends BaseModel {
  static get CLASS_NAME() { return `@backwater-systems/core.infrastructure.${BaseViewModel.name}`; }

  static get DEFAULTS() {
    return Object.freeze({
      id: BaseModel.DEFAULTS.id
    });
  }

  constructor({
    data,
    id = BaseViewModel.DEFAULTS.id()
  }) {
    super({
      data: data,
      id: id
    });
  }
}


export default BaseViewModel;