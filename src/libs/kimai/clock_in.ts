import { getServerTime } from './date_tools';
import config from './get_configuration';
import Timesheet from './@types/serverResponses/Timesheet';

/**
 * Clock in
 * @param {ClockInOpts} opts          - The request information
 */
export default async function ClockIn(opts: ClockInOpts): Promise<Timesheet> {
  const data: ClockInData = {
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
  if (!response.ok) throw new Error('Server reported an error trying to clock in');
  const body = await response.json();
  return body;
}

/**
 * Options for clocking in
 */
interface ClockInOpts {
  project: number,
  activity: number,
  description?: string
}

interface ClockInData {
  project: number,
  activity: number,
  begin: string,
  description?: string
}
