import config from './get_configuration';
import { getServerTime } from './date_tools';
import Timesheet from './@types/serverResponses/Timesheet';

/**
 * Clock out
 */
export default async function ClockOut(opts: ClockOutOpts): Promise<Timesheet> {
  const data: ClockOutData = {
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
  if (!response.ok) throw new Error('Server reported an error trying to clock out');
  const body = await response.json();
  return body;
}

/**
 * Options for clocking out
 */
interface ClockOutOpts {
  id: number,
  description?: string
}

interface ClockOutData {
  end: string,
  description?: string
}
