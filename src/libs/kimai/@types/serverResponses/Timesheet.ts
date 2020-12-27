import Activity from './Activity';
import Project from './Project';

interface Timesheet {
  activity: number | Activity,
  project: number | Project,
  user: number,
  tags: string[],
  id: number,
  begin: Date,
  end: Date,
  duration: number,
  description: string,
  rate: number,
  internalRate: number,
  fixedRate: number,
  hourlyRate: number,
  exported: true,
  metaFields: {
    name: string,
    value: string
  }[]
}

export default Timesheet;
