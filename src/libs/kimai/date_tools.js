import format from 'date-fns/format';
import config from './get_configuration';

/**
 * Convert a date to the format that the Kimai API expects
 * @param {Date} date
 */
export function toLocalTime(date) {
  // YYYY-MM-DDTHH:mm:ss
  return format(date, "yyyy-MM-dd'T'HH:mm:ss");
}

export async function getServerTime() {
  // Get current time from server (combat drift)
  const timeResponse = await fetch(`${config.base_url}/config/i18n`, {
    method: 'GET',
    headers: config.request_headers,
  });
  const currentTime = (await timeResponse.json()).now;

  if (currentTime === undefined || currentTime === null) {
    alert('Unable to get current time from server');
    throw Error('Unable to get current time from server');
  }
}

export function secondsToHumanReadable(seconds) {
  const numMinutes = Math.round(seconds / 60) % 60;
  const numHours = Math.max(Math.floor(seconds / 60 / 60), 0);
  return `${numHours}:${numMinutes < 10 ? `0${numMinutes}` : numMinutes}`;
}
