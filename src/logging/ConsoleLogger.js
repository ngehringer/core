import BaseLogger from './BaseLogger.js';


class ConsoleLogger extends BaseLogger {
  static get CLASS_NAME() { return `@backwater-systems/core.logging.${ConsoleLogger.name}`; }

  static log({
    data,
    logLevel = BaseLogger.DEFAULTS.LOG_LEVEL,
    sourceID = BaseLogger.DEFAULTS.SOURCE_ID,
    verbose = BaseLogger.DEFAULTS.VERBOSE
  }) {
    try {
      const logItem = super._getLogItem({
        data,
        logLevel,
        sourceID,
        verbose
      });

      // transform the log item into text
      const text = `[${logItem.time.toISOString()}] {${logItem.logLevel}${(logItem.sourceID === null) ? '' : `|${logItem.sourceID}`}} ${(logItem.message === null) ? '[null]' : logItem.message}`;

      // write the text to the console
      console.log(text);
    }
    catch (error) {
      BaseLogger._logInternalError(error);
    }
  }
}


export default ConsoleLogger;