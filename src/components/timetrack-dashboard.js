import React from 'react';
import { faClock } from '@fortawesome/free-solid-svg-icons';
import DataGrid from 'react-data-grid';
import UserLayout from './user-layout';
import GetTimesheets from '../libs/kimai/get_timesheets';
import 'react-data-grid/dist/react-data-grid.css';
import config from '../libs/kimai/get_configuration';
import GetStatus from '../libs/kimai/get_status';

function sameDay(d1, d2) {
  return d1.getFullYear() === d2.getFullYear()
  && d1.getMonth() === d2.getMonth()
  && d1.getDate() === d2.getDate();
}

class TimetrackDashboard extends React.PureComponent {
  constructor() {
    super();
    this.columns = [
      { key: 'activity', name: 'Activity' },
      { key: 'description', name: 'Description' },
      { key: 'date', name: 'Date' },
      { key: 'start', name: 'Start' },
      { key: 'end', name: 'End' },
    ];

    this.state = {
      rows: [],
      timesheetEditModalOpen: false,
    };
  }

  async componentDidMount() {
    await this.getTimesheets();
    await this.getStatus();
  }

  onRowClick(row) {
    console.log(row);
    this.setState({
      timesheetEditModalOpen: true,
    });
  }

  async getStatus() {
    const status = await GetStatus();
    this.setState({
      weekTotal: status.totals.week,
      dayTotal: status.totals.day,
    });
  }

  async getTimesheets() {
    const timesheets = await GetTimesheets({});
    const formattedTimesheets = timesheets.map((r) => {
      const beginDate = new Date(r.begin);
      const endDate = r.end !== null ? new Date(r.end) : null;
      return {
        id: r.id,
        description: r.description,
        activity: `${r.activity.name} (${r.activity.project.name})`,
        date: (r.end === null || sameDay(beginDate, endDate) ? beginDate.toLocaleDateString() : `${beginDate.toLocaleDateString()} -> ${endDate.toLocaleDateString()}`),
        start: beginDate.toLocaleTimeString(),
        end: endDate !== null ? endDate.toLocaleTimeString() : '',
      };
    });
    this.setState({
      rows: formattedTimesheets,
    });
  }

  render() {
    const {
      rows, timesheetEditModalOpen, weekTotal, dayTotal,
    } = this.state;
    return (
      <UserLayout icon={faClock} name="Timetrack">
        <div className="columns is-multiline">
          <div className="column is-third">
            <div className="box notification">
              <div className="heading">This Week</div>
              <div className="title is-5">{weekTotal}</div>
            </div>
          </div>
          <div className="column is-third">
            <div className="box notification">
              <div className="heading">Today</div>
              <div className="title is-5">{dayTotal}</div>
            </div>
          </div>
          <div className="column is-third">
            <div className="box notification">
              Test 3
            </div>
          </div>
        </div>
        <DataGrid
          columns={this.columns}
          rows={rows}
          onRowClick={(_idx, row) => this.onRowClick(row)}
        />
        {timesheetEditModalOpen ? 'OPEN MODAL' : <></>}

        {config.friendly_url !== undefined
          ? (
            <div className="has-text-centered has-text-white mt-3">
              <a className="button is-dark" href={config.friendly_url}>Open administration interface</a>
            </div>
          ) : <></>}
      </UserLayout>
    );
  }
}

export default TimetrackDashboard;
