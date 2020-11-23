import BaseLogger from './BaseLogger.js';


class ConsoleLogger extends BaseLogger {
  static get CLASS_NAME() { return `@backwater-systems/core.logging.${ConsoleLogger.name}`; }

  static _log(logItem) {
    // transform the log item into text
    const text = `[${logItem.time.toISOString()}] {${logItem.logLevel}${(logItem.sourceID === null) ? '' : `|${logItem.sourceID}`}} ${(logItem.message === null) ? '[null]' : logItem.message}`;

    // write the text to the console
    console.log(text);
  }
}


export default ConsoleLogger;