import config from './get_configuration';
import { getServerTime } from './date_tools';

/**
 * Clock out
 * @param {ClockOutOpts} opts          - The request information
 */
export default async function ClockOut(opts) {
  const data = {
    end: await getServerTime(),
  };
  if (opts.description !== undefined) {
    data.description = opts.description;
  }

  const response = await fetch(`${config.base_url}/timesheets/${opts.id}`, {
    method: 'PATCH',
    headers: config.request_headers,
    body: JSON.stringify(data),
  });
  const body = await response.json();
  return body;
}

/**
 * Options for getting timesheets
 * @typedef {Object} ClockOutOpts
 * @property {int} id Timesheet ID to clock out of
 */
