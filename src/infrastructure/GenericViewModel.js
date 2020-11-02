import BaseViewModel from './BaseViewModel.js';


class GenericViewModel extends BaseViewModel {
  static get CLASS_NAME() { return `@backwater-systems/core.infrastructure.${GenericViewModel.name}`; }

  constructor({ data }) {
    super({ 'data': data });
  }

  getModel(data) {
    // create a read-only copy of the data object
    return Object.freeze({ ...data });
  }
}


export default GenericViewModel;