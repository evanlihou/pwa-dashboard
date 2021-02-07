import KimaiConfiguration from 'kimai-sdk/src/KimaiConfiguration';

export const ServerConfiguration = {
  friendly_url: process.env.KIMAI_FRIENDLY_URL,
  base_url: process.env.KIMAI_BASE_URL,
  user: process.env.KIMAI_USER,
  token: process.env.KIMAI_KEY,
} as KimaiConfiguration;

export default {
  friendly_url: process.env.KIMAI_FRIENDLY_URL,
  base_url: '/api/timeProxy',
} as KimaiConfiguration;
