import config from './get_configuration';

export default async function GetActivities() {
  const activitiesByProject = {};
  const projects = await fetch(`${config.base_url}/projects`, {
    method: 'GET',
    headers: config.request_headers,
  });
  const projectsResponse = await projects.json();
  projectsResponse.forEach((element) => {
    activitiesByProject[element.id] = {
      projectId: element.id,
      name: `${element.name} (${element.parentTitle})`,
      activities: [],
    };
  });
  const activities = await fetch(`${config.base_url}/activities`, {
    method: 'GET',
    headers: config.request_headers,
  });
  const activitiesResponse = await activities.json();
  activitiesResponse.forEach((element) => {
    if (element.project !== null) {
      activitiesByProject[element.project].activities.push({
        activityId: element.id,
        color: element.color,
        name: element.name,
      });
    } else {
      Object.keys(activitiesByProject).forEach((proj) => {
        activitiesByProject[proj].activities.push({
          activityId: element.id,
          color: element.color,
          name: element.name,
        });
      });
    }
  });

  return activitiesByProject;
}
