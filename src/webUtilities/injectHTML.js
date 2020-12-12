import * as errors from '../errors/index.js';
import * as logging from '../logging/index.js';
import * as utilities from '../utilities/index.js';


/**
 * The module’s defaults
 */
const DEFAULTS = Object.freeze({
  DEBUG: false,
  LOGGER: logging.ConsoleLogger,
  REPLACE: false,
  SOURCE_ID: null
});

/**
 * The module’s ID
 */
const MODULE_ID = '@backwater-systems/core.webUtilities.injectHTML';

/**
 * Injects HTML into the specified target, replacing or appending to the existing contents.
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
  /**
   * Whether debug mode is enabled
   */
  const _debug = (typeof debug === 'boolean')
    ? debug
    : DEFAULTS.DEBUG
  ;

  /**
   * The module’s logger
   */
  const _logger = (
    (typeof logger === 'function')
    && utilities.validation.validateInheritance(logger, logging.BaseLogger)
  )
    ? logger
    : DEFAULTS.LOGGER
  ;

  /**
   * Whether the contents of the target should be replaced or appended to
   */
  const _replace = (typeof replace === 'boolean')
    ? replace
    : DEFAULTS.REPLACE
  ;

  /**
   * The logging source ID
   */
  const _sourceID = (
    (typeof sourceID === 'string')
    && utilities.validation.isNonEmptyString(sourceID)
  )
    ? `${MODULE_ID} @ “${sourceID}”`
    : MODULE_ID
  ;

  /**
   * The DOM injection target
   */
  let targetElement = null;
  // `target` is a “string” …
  if (
    (typeof target === 'string')
    && utilities.validation.isNonEmptyString(target)
  ) {
    // abort if the specified `target` parameter value does not look like an HTML ID
    if ( !target.match(/#.*/) ) throw new errors.InvalidParameterValueError({
      parameterName: 'target',
      reason: `“${target}” is not an HTML ID`
    });

    targetElement = document.querySelector(`${target}`);
    if (targetElement === null) throw new Error(`“${target}” does not exist.`);
  }
  // `target` is an “Element”
  else if (
    (typeof target === 'object')
    && (target instanceof Element)
  ) {
    targetElement = target;
  }
  else throw new errors.TypeValidationError('target', [ String, Element ]);

  // abort if the specified `html` parameter value is not a non-empty string
  if (
    (typeof html !== 'string')
    || !utilities.validation.isNonEmptyString(html)
  ) throw new errors.TypeValidationError('html', String);

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

  /**
   * A transient DOM element for extracting the text of the `<script>` nodes contained in the HTML
   */
  const htmlElement = document.createElement('div');
  // populate the transient element with the response’s HTML
  htmlElement.innerHTML = html;

  /**
   * The `<script>` nodes contained in the HTML
   */
  const scriptNodeList = Array.from(
    htmlElement.querySelectorAll('script')
  );

  /**
   * The text of the `<script>` nodes contained in the HTML
   */
  const scriptTextList = scriptNodeList
    // filter out scripts that are empty or all whitespace
    .filter(
      (scriptNode, index) => {
        /**
         * The text of the `<script>` node
         */
        const scriptText = scriptNode.textContent;

        if (_debug) {
          _logger.logDebug({
            data: `Parsing script (${utilities.formatting.formatNumber(index + 1)} / ${utilities.formatting.formatNumber(scriptNodeList.length)}) …`,
            sourceID: _sourceID,
            verbose: _debug
          });
        }

        /**
         * Whether the script is valid (negated – RegExp match: empty or contains only whitespace characters)
         */
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
  MODULE_ID,
  injectHTML
};