import formatGetParams from '../format_get_params';
import config from './get_configuration';
import GetTimesheetsData from './@types/GetTimesheetsData';
import Timesheet from './@types/serverResponses/Timesheet';

/**
 * Get the timesheets that fit the given parameters
 * @param {GetTimesheetsOpts} opts          - The request information
 */
export default async function GetTimesheets(opts: GetTimesheetsOpts): Promise<Timesheet[]> {
  const data: GetTimesheetsData = {
    full: true,
  };
  if (opts.start !== undefined) {
    data.begin = opts.start.toISOString();
  }
  if (opts.end !== undefined) {
    data.end = opts.end.toISOString();
  }
  if (opts.customerId !== undefined) {
    data.customers = opts.customerId;
  }

  const response = await fetch(`${config.base_url}/timesheets${formatGetParams(data)}`, {
    method: 'GET',
    headers: config.request_headers,
  });
  if (!response.ok) throw new Error('Server reported an error trying to get timesheets');
  const body = await response.json();
  return body;
}

/**
 * Options for getting timesheets
 * @typedef {Object} GetTimesheetsOpts
 * @property {date} start
 * @property {date} end
 * @property {int?} customerId
 */

interface GetTimesheetsOpts {
  start?: Date,
  end?: Date,
  customerId?: number
}
