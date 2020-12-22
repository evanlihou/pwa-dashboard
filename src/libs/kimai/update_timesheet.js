import config from './get_configuration';
import { toLocalTime } from './date_tools';

/**
 * Clock out
 * @param {ClockOutOpts} opts          - The request information
 */
export default async function UpdateTimesheet(opts) {
  const data = {
    description: opts.description,
    project: opts.projectId,
    activity: opts.activityId,
  };

  if (opts.begin !== undefined) {
    data.begin = toLocalTime(opts.begin);
  }
  if (opts.end !== undefined) {
    data.end = toLocalTime(opts.end);
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
 * @typedef {Object} UpdateNotesOpts
 * @property {int} id Timesheet ID to clock out of
 * @property {string} description
 * @property {Date} begin
 * @property {Date} end
 */
