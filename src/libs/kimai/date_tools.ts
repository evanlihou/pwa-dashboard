import format from 'date-fns/format';
import config from './get_configuration';

/**
 * Convert a date to the format that the Kimai API expects
 */
export function toLocalTime(date: Date, useSeconds = true): string | null {
  if (date === null || date === undefined) return null;
  // YYYY-MM-DDTHH:mm:ss
  return format(date, (useSeconds ? "yyyy-MM-dd'T'HH:mm:ss" : "yyyy-MM-dd'T'HH:mm"));
}

/**
 * Get the current server time in a format that can then be sent back to the server
 */
export async function getServerTime(): Promise<string> {
  // Get current time from server (combat drift)
  const timeResponse = await fetch(`${config.base_url}/config/i18n`, {
    method: 'GET',
    headers: config.request_headers,
  });
  if (!timeResponse.ok) throw new Error('Server reported an error trying to get the current time');
  const currentTime = (await timeResponse.json()).now;

  if (currentTime === undefined || currentTime === null) {
    throw new Error('Unable to get current time from server');
  }

  return currentTime;
}

export function secondsToHumanReadable(seconds: number): string {
  const numMinutes = Math.round(seconds / 60) % 60;
  const numHours = Math.max(Math.floor(seconds / 60 / 60), 0);
  return `${numHours}:${numMinutes < 10 ? `0${numMinutes}` : numMinutes}`;
}
