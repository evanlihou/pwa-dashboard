interface Activity {
  parentTitle: string,
  project: number,
  id: number,
  name: string,
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

export default Activity;
