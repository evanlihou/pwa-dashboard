import config from './get_configuration';

export default async function GetActivities() {
  const response = await fetch(`${config.base_url}/activities`, {
    method: 'GET',
    headers: config.request_headers,
  });
  const body = await response.json();
  return body.map(v => ({
    activityId: v.id,
    projectId: v.project,
    color: v.color,
    name: `${v.parentTitle} - ${v.name}`,
  }));
}
