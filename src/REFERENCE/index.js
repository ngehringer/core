import ENUMERATIONS from './ENUMERATIONS/index.js';


/**
 * `core` reference data
 */
const REFERENCE = Object.freeze({
  ENUMERATIONS: ENUMERATIONS,
  NULL_PLACEHOLDER: '—',
  UUID_REGEXP: /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/
});


export default REFERENCE;