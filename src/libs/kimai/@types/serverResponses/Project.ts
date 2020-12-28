interface Project {
  parentTitle: string,
  customer: number,
  id: number,
  name: string,
  start: string,
  end: string,
  visible: boolean,
  metaFields: {
    name: string,
    value: string
  }[],
  teams: {
      id: number,
      name: string
  }[],
  color: string
}

export default Project;
