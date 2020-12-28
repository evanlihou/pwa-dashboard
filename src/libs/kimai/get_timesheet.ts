import Timesheet from './@types/serverResponses/Timesheet';
import config from './get_configuration';

/**
 * Get a timesheet
 * @param {number} id          - Timesheet ID
 */
export default async function GetTimesheet(id: number): Promise<Timesheet> {
  const response = await fetch(`${config.base_url}/timesheets/${id}`, {
    method: 'GET',
    headers: config.request_headers,
  });
  if (!response.ok) throw new Error('Server reported an error trying to get timesheet');
  const body = await response.json();
  if (body.begin !== null) body.begin = new Date(body.begin);
  if (body.end !== null) body.end = new Date(body.end);
  return body;
}
