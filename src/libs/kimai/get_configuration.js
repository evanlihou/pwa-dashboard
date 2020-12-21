export default {
  friendly_url: process.env.KIMAI_FRIENDLY_URL,
  base_url: process.env.KIMAI_BASE_URL,
  user: process.env.KIMAI_USER,
  key: process.env.KIMAI_KEY,
  request_headers: {
    'Content-Type': 'application/json',
    'X-AUTH-USER': process.env.KIMAI_USER,
    'X-AUTH-TOKEN': process.env.KIMAI_KEY,
  },
  // cors_proxy_url: `http://${window.location.hostname}:${process.env.CORS_PROXY_PORT}`,
  // proxied_base_url: `http://${window.location.hostname}:${process.env.CORS_PROXY_PORT}/${process.env.TSHEETS_BASE_URL}`,
};
