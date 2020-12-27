/**
 * @file Helper to take an array of parameters and format them as a GET query string
 */

/**
 * Take an array of parameters and format them as a GET query string
 * @param {Array} params
 */
export default function formatGetParams(params: Params) {
  return `?${Object.keys(params).map(key => `${key}=${encodeURIComponent(params[key])}`).join('&')}`;
}

interface Params extends Object {
  [key: string]: any
}
