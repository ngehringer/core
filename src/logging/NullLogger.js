import BaseLogger from './BaseLogger.js';


class NullLogger extends BaseLogger {
  static get CLASS_NAME() { return `@backwater-systems/core.logging.${NullLogger.name}`; }

  static _log() {
    // no operation
  }
}


export default NullLogger;