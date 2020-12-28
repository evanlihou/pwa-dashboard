export default {
  cors_proxy_port: process.env.CORS_PROXY_PORT,
  base_url: process.env.CLIMACELL_BASE_URL,
  key: process.env.CLIMACELL_KEY,
  cors_proxy_url: `http://${window.location.hostname}:${process.env.CORS_PROXY_PORT}`,
  proxied_base_url: `http://${window.location.hostname}:${process.env.CORS_PROXY_PORT}/${process.env.CLIMACELL_BASE_URL}`,
  lat: process.env.CLIMACELL_LAT,
  long: process.env.CLIMACELL_LONG,
};
