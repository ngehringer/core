import BaseModel from './BaseModel.js';


class BaseViewModel extends BaseModel {
  static get CLASS_NAME() { return `@backwater-systems/core.infrastructure.${BaseViewModel.name}`; }

  constructor({ data }) {
    super({ data: data });
  }
}


export default BaseViewModel;