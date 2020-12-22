import config from './get_configuration';

/**
 * Get a timesheet
 * @param {number} id          - Timesheet ID
 */
export default async function GetTimesheet(id) {
  const response = await fetch(`${config.base_url}/timesheets/${id}`, {
    method: 'GET',
    headers: config.request_headers,
  });
  const body = await response.json();
  if (body.begin !== null) body.begin = new Date(body.begin);
  if (body.end !== null) body.end = new Date(body.end);
  return body;
}
