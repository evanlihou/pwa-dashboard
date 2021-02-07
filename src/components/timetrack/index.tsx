import React from 'react';
import { faClock } from '@fortawesome/free-solid-svg-icons';
import DataGrid from 'react-data-grid';
import KimaiSdk from 'kimai-sdk/src/index';
import Activity from 'kimai-sdk/src/@types/serverResponses/Activity';
import Project from 'kimai-sdk/src/@types/serverResponses/Project';
import UserLayout from '../UserLayout';
// import 'react-data-grid/dist/react-data-grid.css';
import config from '../../libs/kimai/get_configuration';
import TimesheetEditModal from './TimesheetEditModal';
import DashboardComponent from '../DashboardComponent';

function sameDay(d1: Date, d2: Date) {
  return d1.getFullYear() === d2.getFullYear()
  && d1.getMonth() === d2.getMonth()
  && d1.getDate() === d2.getDate();
}

type TimetrackDashboardProps = {}

type TimetrackDashboardState = {
  rows: Row[],
  timesheetEditModalOpen: boolean,
  selectedRow: Row | null,
  status: {
    weekTotal: string,
    dayTotal: string,
    fribWeekTotal: string,
  } | null
}

type Row = {
  id: number,
  description: string,
  activity: string,
  date: string,
  start: string | null,
  end: string | null
}

class TimetrackDashboard extends DashboardComponent<
  TimetrackDashboardProps, TimetrackDashboardState> {
  private columns: {key: string, name: string}[]

  private kimaiSdk = new KimaiSdk(config);

  constructor(props: TimetrackDashboardProps) {
    super(props);
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
      selectedRow: null,
      status: null,
    };
  }

  async componentDidMount() {
    await this.getTimesheets();
    await this.getStatus();
  }

  onRowClick(row: Row) {
    this.setState({
      timesheetEditModalOpen: true,
      selectedRow: row,
    });
  }

  async getStatus() {
    try {
      const status = await this.kimaiSdk.getStatus();
      this.setState({
        status: {
          weekTotal: status.totals.week,
          dayTotal: status.totals.day,
          fribWeekTotal: status.totals.fribWeek,
        },
      });
    } catch (error) {
      const { addError } = this.context;
      addError(error.toString());
    }
  }

  async getTimesheets() {
    try {
      const timesheets = await this.kimaiSdk.getTimesheets({});
      const formattedTimesheets = timesheets.map((r) => {
        const beginDate = new Date(r.begin);
        const endDate = r.end !== null ? new Date(r.end) : null;
        return {
          id: r.id,
          description: r.description,
          activity: `${(r.activity as Activity).name} (${(r.project as Project).name})`,
          date: (endDate === null || sameDay(beginDate, endDate) ? beginDate.toLocaleDateString() : `${beginDate.toLocaleDateString()} -> ${endDate.toLocaleDateString()}`),
          start: beginDate.toLocaleTimeString(),
          end: endDate !== null ? endDate.toLocaleTimeString() : '',
        };
      });
      this.setState({
        rows: formattedTimesheets,
      });
    } catch (error) {
      const { addError } = this.context;
      addError(error.toString());
    }
  }

  render() {
    const { rows, timesheetEditModalOpen, selectedRow } = this.state;

    return (
      <UserLayout icon={faClock} name="Timetrack">
        {this.state.status !== null ? (
          <div className="columns is-multiline">
            <div className="column is-third">
              <div className="box notification">
                <div className="heading">This Week</div>
                <div className="title is-5">{this.state.status.weekTotal}</div>
              </div>
            </div>
            <div className="column is-third">
              <div className="box notification">
                <div className="heading">Today</div>
                <div className="title is-5">{this.state.status.dayTotal}</div>
              </div>
            </div>
            <div className="column is-third">
              <div className="box notification">
                <div className="heading">FRIB This Week</div>
                <div className="title is-5">{this.state.status.fribWeekTotal}</div>
              </div>
            </div>
          </div>
        ) : <></>}
        <DataGrid
          columns={this.columns}
          rows={rows}
          onRowClick={(_idx, row) => this.onRowClick(row)}
        />

        {config.friendly_url !== undefined
          ? (
            <div className="has-text-centered has-text-white mt-3">
              <a className="button is-dark" href={config.friendly_url}>Open administration interface</a>
            </div>
          ) : <></>}
        {timesheetEditModalOpen && selectedRow !== null ? (
          <TimesheetEditModal
            timesheetId={selectedRow.id}
            onClose={(shouldRefresh = false) => {
              if (shouldRefresh) {
                this.getTimesheets();
                this.getStatus();
              }
              this.setState({ timesheetEditModalOpen: false });
            }}
          />
        ) : <></>}
      </UserLayout>
    );
  }
}

export default TimetrackDashboard;
