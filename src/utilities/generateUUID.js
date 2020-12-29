/* eslint-disable */
/**
 * Generates a version 4 UUID.
 *
 * > **NOTE:** This implementation is from <https://stackoverflow.com/revisions/2117523/11>.
 */
const generateUUID = () =>
  'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    let r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  })
;


export default generateUUID;