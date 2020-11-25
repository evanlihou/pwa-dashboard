export default {
  cors_proxy_port: process.env.CORS_PROXY_PORT,
  base_url: process.env.TSHEETS_BASE_URL,
  key: process.env.TSHEETS_KEY,
  userid: process.env.TSHEETS_USERID,
  cors_proxy_url: `http://${window.location.hostname}:${process.env.CORS_PROXY_PORT}`,
  proxied_base_url: `http://${window.location.hostname}:${process.env.CORS_PROXY_PORT}/${process.env.TSHEETS_BASE_URL}`,
};
