import formatGetParams from '../formatGetParams';
import config from './get_configuration';

/**
 * Get the timesheets that fit the given parameters
 * @param {GetTimesheetsOpts} opts          - The request information
 */
export default async function GetTimesheets(opts) {
  const data = {
    full: true,
  };
  if (opts.start !== undefined) {
    data.begin = opts.start.toISOString();
  }
  if (opts.end !== undefined) {
    data.end = opts.end.toISOString();
  }

  const response = await fetch(`${config.base_url}/timesheets${formatGetParams(data)}`, {
    method: 'GET',
    headers: config.request_headers,
  });
  const body = await response.json();
  return body;
}

/**
 * Options for getting timesheets
 * @typedef {Object} GetTimesheetsOpts
 * @property {date} start
 * @property {date} end
 */
