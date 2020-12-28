interface GroupedActivities {
  [projectId: number]: ProjectActivities
}

export interface Activity {
  activityId: number,
  color: string,
  name: string
}

export interface ProjectActivities {
  projectId: number,
  name: string,
  activities: Activity[]
}
export default GroupedActivities;
