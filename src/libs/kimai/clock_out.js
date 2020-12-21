import config from './get_configuration';

/**
 * Clock out
 * @param {ClockOutOpts} opts          - The request information
 */
export default async function ClockOut(opts) {
  // Get current time from server (combat drift)

  const response = await fetch(`${config.base_url}/timesheets/${opts.id}/stop`, {
    method: 'PATCH',
    headers: config.request_headers,
  });
  const body = await response.json();
  return body;
}

/**
 * Options for getting timesheets
 * @typedef {Object} ClockOutOpts
 * @property {int} id Timesheet ID to clock out of
 */
