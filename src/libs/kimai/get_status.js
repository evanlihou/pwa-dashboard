import { startOfWeek, startOfDay, differenceInSeconds } from 'date-fns';
import formatGetParams from '../formatGetParams';
import { secondsToHumanReadable, toLocalTime } from './date_tools';
import config from './get_configuration';

export async function GetWeekTotal({ customer }) {
  let totalSeconds = 0;
  const weekStart = startOfWeek(new Date());
  const data = {
    begin: toLocalTime(weekStart),
  };
  if (customer !== undefined) {
    data.customers = customer;
  }
  const response = await fetch(`${config.base_url}/timesheets${formatGetParams(data)}`, {
    method: 'GET',
    headers: config.request_headers,
  });
  const body = await response.json();
  const durations = body.map(v => (
    v.end !== null
      ? v.duration
      : differenceInSeconds(new Date(), new Date(v.begin))));
  if (durations.length > 0) totalSeconds += durations.reduce((acc, item) => acc + item);

  return totalSeconds;
}

export async function GetDayTotal({ customer }) {
  let totalSeconds = 0;
  const dayStart = startOfDay(new Date());
  const data = {
    begin: toLocalTime(dayStart),
  };
  if (customer !== undefined) {
    data.customers = customer;
  }
  const response = await fetch(`${config.base_url}/timesheets${formatGetParams(data)}`, {
    method: 'GET',
    headers: config.request_headers,
  });
  const body = await response.json();
  const durations = body.map(v => (
    v.end !== null
      ? v.duration
      : differenceInSeconds(new Date(), new Date(v.begin))));
  if (durations.length > 0) totalSeconds += durations.reduce((acc, item) => acc + item);

  return totalSeconds;
}

export async function GetCurrentTimesheet() {
  const response = await fetch(`${config.base_url}/timesheets/active`, {
    method: 'GET',
    headers: config.request_headers,
  });
  const body = await response.json();

  // NOTE: This assumes there will only ever be 1 or 0 timesheets running
  return (body.length === 0 ? null : body[0]);
}

/**
 * Get current status and statistics about time tracking
 * @param {GetStatusOpts} opts          - The request information
 */
export default async function GetStatus(_opts) {
  const opts = _opts ?? {};
  const [dayTotal, weekTotal, fribWeekTotal, currentTimesheet] = await Promise.all([
    GetDayTotal(opts), GetWeekTotal(opts), GetWeekTotal({ customer: 1 }), GetCurrentTimesheet()]);
  const status = {
    status: {
      timesheetId: currentTimesheet !== null ? currentTimesheet.id : null,
      clockedIn: currentTimesheet !== null,
      jobName: currentTimesheet !== null ? currentTimesheet.activity.name : null,
      start: currentTimesheet !== null ? new Date(currentTimesheet.begin) : null,
      end: currentTimesheet !== null && currentTimesheet.end !== null
        ? new Date(currentTimesheet.end) : null,
      shift_time: currentTimesheet !== null
        ? secondsToHumanReadable(differenceInSeconds(new Date(), new Date(currentTimesheet.begin)))
        : null,
      shift_notes: currentTimesheet !== null ? currentTimesheet.description : null,
    },
    totals: {
      day: secondsToHumanReadable(dayTotal),
      week: secondsToHumanReadable(weekTotal),
      fribWeek: secondsToHumanReadable(fribWeekTotal),
    },
  };

  return status;
}

/**
 * Options for getting timesheets
 * @typedef {Object} GetStatusOpts
 * @property {int?} project
 */
