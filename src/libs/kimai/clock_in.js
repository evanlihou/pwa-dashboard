import { getServerTime } from './date_tools';
import config from './get_configuration';

/**
 * Clock in
 * @param {ClockInOpts} opts          - The request information
 */
export default async function ClockIn(opts) {
  const data = {
    project: opts.project,
    activity: opts.activity,
    begin: await getServerTime(),
  };
  if (opts.description !== undefined) {
    data.description = opts.description;
  }

  const response = await fetch(`${config.base_url}/timesheets`, {
    method: 'POST',
    headers: config.request_headers,
    body: JSON.stringify(data),
  });
  const body = await response.json();
  return body;
}

/**
 * Options for getting timesheets
 * @typedef {ClockInOpts} GetTimesheetsOpts
 * @property {int} project
 * @property {int} activity
 * @property {string?} description
 */
