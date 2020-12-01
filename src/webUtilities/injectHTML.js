import * as errors from '../errors/index.js';
import * as logging from '../logging/index.js';
import * as utilities from '../utilities/index.js';


/** the process’s defaults */
const DEFAULTS = Object.freeze({
  DEBUG: false,
  LOGGER: logging.ConsoleLogger,
  REPLACE: false,
  SOURCE_ID: null
});

/** the process’s ID */
const PROCESS_ID = '@backwater-systems/core.webUtilities.injectHTML';

/**
  * Injects HTML into the specified target, replacing or appending to the contents.
  * **WARNING:** `<script>` blocks in the HTML are executed; do not inject HTML from untrusted sources.
  */
const injectHTML = ({
  debug = DEFAULTS.DEBUG,
  html,
  logger = DEFAULTS.LOGGER,
  replace = DEFAULTS.REPLACE,
  sourceID = DEFAULTS.SOURCE_ID,
  target
}) => {
  /** whether debug mode is enabled */
  const _debug = utilities.validation.validateType(debug, Boolean)
    ? debug
    : DEFAULTS.DEBUG
  ;

  /** the process’s logger */
  const _logger = (
    utilities.validation.validateType(logger, Object)
    && utilities.validation.validateInheritance(logger, logging.BaseLogger)
  )
    ? logger
    : DEFAULTS.LOGGER
  ;

  /** whether the target’s contents should be replaced or appended */
  const _replace = utilities.validation.validateType(replace, Boolean)
    ? replace
    : DEFAULTS.REPLACE
  ;

  /** the process’s logging source ID */
  const _sourceID = utilities.validation.isNonEmptyString(sourceID)
    ? `${PROCESS_ID} @ “${sourceID}”`
    : PROCESS_ID
  ;

  /** the DOM injection target */
  let targetElement = null;
  // ‘target’ is a “string” …
  if ( utilities.validation.isNonEmptyString(target) ) {
    // … looks like it’s an HTML ID
    if ( !target.match(/#.*/) ) throw new Error(`“${target}” is not an HTML ID.`);
    targetElement = document.querySelector(`${target}`);
    if (targetElement === null) throw new Error(`“${target}” does not exist.`);
  }
  // ‘target’ is an “Element”
  else if ( utilities.validation.validateType(target, Element) ) {
    targetElement = target;
  }
  else throw new errors.TypeValidationError('target', [ String, Element ]);

  // abort if the specified “html” parameter value is not a non-empty string
  if ( !utilities.validation.isNonEmptyString(html) ) throw new errors.TypeValidationError('html', String);

  // inject the response into the DOM by …
  // … replacing the contents of the target element
  if (_replace) {
    targetElement.innerHTML = html;
  }
  // … appending to the contents of the target element
  else {
    targetElement.insertAdjacentHTML('beforeend', html);
  }

  // attempt to execute any JavaScript <script> nodes contained in the HTML

  /** a transient DOM element for extracting the text of the `<script>` nodes contained in the HTML */
  const htmlElement = document.createElement('div');
  // populate the transient element with the response’s HTML
  htmlElement.innerHTML = html;

  /** the `<script>` nodes contained in the HTML */
  const scriptNodeList = Array.from(
    htmlElement.querySelectorAll('script')
  );

  /** the text of the `<script>` nodes contained in the HTML */
  const scriptTextList = scriptNodeList
    // filter out scripts that are empty or all whitespace
    .filter(
      (scriptNode, index) => {
        const scriptText = scriptNode.textContent;

        if (_debug) {
          _logger.logDebug({
            data: `Parsing script (${utilities.formatting.formatNumber(index + 1)} / ${utilities.formatting.formatNumber(scriptNodeList.length)}) …`,
            sourceID: _sourceID,
            verbose: _debug
          });
        }

        /** whether the script is valid (negated – RegExp match: empty or contains only whitespace characters) */
        const validScript = !(/^\s*$/).test(scriptText);

        if (!validScript) {
          _logger.logWarning({
            data: `Script ${utilities.formatting.formatNumber(index + 1)} is empty or contains only whitespace.`,
            sourceID: _sourceID,
            verbose: _debug
          });
        }

        return validScript;
      }
    )
    // extract the “<script>” node’s text content
    .map(
      (scriptNode) => scriptNode.textContent
    )
  ;

  // execute the scripts serially, in the order that they occur in the markup
  for (
    // index: the ordinal position of the script in the HTML
    // scriptText: the text of the script
    const [ index, scriptText ] of Object.entries(scriptTextList)
  ) {
    if (_debug) {
      _logger.logDebug({
        data: `Executing script (${utilities.formatting.formatNumber(Number(index) + 1)} / ${utilities.formatting.formatNumber(scriptTextList.length)}) …`,
        sourceID: _sourceID,
        verbose: _debug
      });
    }

    // execute the script …
    try {
      // <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/eval#Never_use_eval!>
      Function(`"use strict";${scriptText}`)();
    }
    catch (error) {
      // … logging and consuming any errors thrown during execution
      _logger.logError({
        data: error,
        sourceID: `${_sourceID} (injected script ${utilities.formatting.formatNumber(Number(index) + 1)} / ${utilities.formatting.formatNumber(scriptTextList.length)})`,
        verbose: _debug
      });
    }
  }
};


export default injectHTML;
export {
  DEFAULTS,
  PROCESS_ID,
  injectHTML
};