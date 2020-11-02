import * as errors from '../errors/index.js';
import * as logging from '../logging/index.js';
import * as utilities from '../utilities/index.js';


const DEFAULTS = Object.freeze({
  'DEBUG': false,
  'REPLACE': false,
  'SOURCE_ID': null
});

const PROCESS_ID = '@backwater-systems/core.webUtilities.injectHTML';

const injectHTML = ({
  debug = DEFAULTS.DEBUG,
  html,
  replace = DEFAULTS.REPLACE,
  sourceID = DEFAULTS.SOURCE_ID,
  target,
}) => {
  // define whether debug mode is enabled
  const _debug = utilities.validateType(debug, Boolean)
    ? debug
    : DEFAULTS.DEBUG
  ;

  // define whether the target’s contents should be replaced or appended
  const _replace = utilities.validateType(replace, Boolean)
    ? replace
    : DEFAULTS.DEBUG
  ;

  // get a reference to the DOM injection target
  let targetElement = null;
  // ‘target’ is a “string” …
  if ( utilities.isNonEmptyString(target) ) {
    // … looks like it’s an HTML ID
    if ( !target.match( new RegExp('#.*') ) ) throw new Error(`“${target}” is not an HTML ID.`);
    targetElement = document.querySelector(`${target}`);
    if (targetElement === null) throw new Error(`“${target}“ does not exist.`);
  }
  // ‘target’ is an “Element”
  else if ( utilities.validateType(target, Element) ) {
    targetElement = target;
  }
  else throw new Error('Invalid “target” parameter value specified: must be a “string” (HTML ID) or an “Element”.');

  if ( !utilities.isNonEmptyString(html) ) throw new errors.TypeValidationError('html', String);

  // inject the response into the DOM by …
  // … replacing the contents of the target element
  if (_replace) {
    targetElement.innerHTML = html;
  }
  // … appending to the contents of the target element
  else {
    targetElement.insertAdjacentHTML('beforeend', html);
  }

  // attempt to execute any JavaScript blocks contained in the HTML

  // create a transient DOM element
  const htmlElement = document.createElement('div');
  // populate the transient element with the response’s HTML
  htmlElement.innerHTML = html;
  // extract the “<script>” nodes from the transient element
  const scriptNodeList = Array.from(
    htmlElement.querySelectorAll('script')
  );
  // extract the text content of the “<script>” nodes
  const scriptTextList = scriptNodeList
    // filter out scripts that are empty or all whitespace
    .filter(
      (scriptNode, index) => {
        const scriptText = scriptNode.textContent;

        logging.Logger.logDebug(
          `Parsing script (${utilities.formatNumber(index + 1)} / ${utilities.formatNumber(scriptNodeList.length)}) …`,
          PROCESS_ID,
          _debug
        );

        const validScript = new RegExp('^\\s*$').test(scriptText);

        if (!validScript) {
          logging.Logger.logDebug(
            `Script ${utilities.formatNumber(index + 1)} is empty or contains only whitespace.`,
            PROCESS_ID,
            _debug
          );
        }

      return validScript;
    })
    // extract the “<script>” node’s text content
    .map(
      (scriptNode) => scriptNode.textContent
    )
  ;

  // execute the scripts
  for (const scriptText of scriptTextList) {
    try {
      eval(scriptText);
    }
    catch (error) {
      // log errors caused by injected script blocks
      logging.Logger.logError(
        error.message,
        `${PROCESS_ID} (injected script block${(sourceID === null) ? '' : ` @ “${sourceID}”`})`,
        _debug
      );
    }
  }
};


export default injectHTML;