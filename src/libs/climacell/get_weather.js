import config from './get_configuration';
import formatGetParams from '../formatGetParams';

const FIELDS = [
  'precipitation',
  'wind_gust',
  'temp',
  'feels_like',
  'wind_speed',
  'wind_direction',
  'precipitation_type',
  'sunset',
  'cloud_cover',
  'weather_code',
  'road_risk_score',
  'road_risk_conditions',
];
const UNITS = 'us';

/**
 * Get the current weather
 * @param {function} sendResponse Callback function with response
 */
export default function getWeather(sendResponse) {
  const data = {
    fields: FIELDS,
    lat: config.lat,
    lon: config.long,
    apikey: config.key,
    unit_system: UNITS,
  };
  fetch(`${config.proxied_base_url}/weather/realtime${formatGetParams(data)}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  }).then((response) => {
    if (!response.ok) {
      sendResponse({
        error: {
          statusCode: response.status,
          message: `Got response with code ${response.status}`,
        },
      });

      throw new Error('Bad response code');
    } else {
      return response.json();
    }
  }).then((response) => {
    response.sunset.value = new Date(response.sunset.value);
    response.observation_time.value = new Date(response.observation_time.value);
    sendResponse({ weather: response });
  });
}
