import React from 'react';
// import UpdateTimesheet from '../../libs/kimai/update_timesheet';
// import GetTimesheet from '../../libs/kimai/get_timesheet';
// import { toLocalTime } from '../../libs/kimai/date_tools';
// import GetActivities from '../../libs/kimai/get_activities';
import KimaiSdk from 'kimai-sdk/src/index';
import GroupedActivities, { ProjectActivities } from 'kimai-sdk/src/@types/GroupedActivities';
import config from '../../libs/kimai/get_configuration';
import DashboardComponent from '../DashboardComponent';

type TimesheetEditModalProps = {
  timesheetId: number,
  onClose: Function,
}

type TimesheetEditModalState = {
  hasValues: boolean,
  loading: boolean,
  timesheetId: number | null,
  notes: string,
  activity: string,
  activityChanged: boolean,
  startStr: string | null,
  selectedStartDate: Date | null,
  endStr: string | null,
  selectedEndDate: Date | null,
  activities: GroupedActivities | null,
}

export default class TimesheetEditModal extends DashboardComponent<
  TimesheetEditModalProps, TimesheetEditModalState> {
  private notesInput = React.createRef<HTMLTextAreaElement>();

  private kimaiSdk = new KimaiSdk(config);

  private autoFocusNotes = false;

  constructor(props: TimesheetEditModalProps) {
    super(props);
    this.state = {
      loading: true,
      hasValues: false,
      timesheetId: null,
      activity: '',
      notes: '',
      activityChanged: false,
      startStr: null,
      selectedStartDate: null,
      endStr: null,
      selectedEndDate: null,
      activities: null,
    };
  }

  async componentDidMount() {
    const { timesheetId } = this.props;

    const timesheet = await this.kimaiSdk.getTimesheet(timesheetId);

    const activities = await this.kimaiSdk.getActivities();

    this.setState({
      hasValues: true,
      loading: false,
      timesheetId: timesheet.id,
      notes: timesheet.description,
      activity: `${timesheet.project}-${timesheet.activity}`,
      activityChanged: false,
      startStr: this.kimaiSdk.toLocalTime(timesheet.begin, false),
      selectedStartDate: null,
      endStr: this.kimaiSdk.toLocalTime(timesheet.end, false),
      selectedEndDate: null,
      activities,
    });
  }

  async handleSave() {
    const { onClose } = this.props;
    const {
      timesheetId, notes, selectedStartDate, selectedEndDate, activity, activityChanged,
    } = this.state;

    const { addError } = this.context;

    if (timesheetId === null) {
      addError('Unable to get timesheet ID');
      return;
    }

    const activityId = Number(activity.split('-')[1]);
    const projectId = Number(activity.split('-')[0]);

    if (Number.isNaN(activityId) || Number.isNaN(projectId)) {
      addError('Activity or project ID is not a number');
      return;
    }

    await this.kimaiSdk.updateTimesheet({
      id: timesheetId,
      description: notes,
      activityId: activityChanged === true ? activityId : undefined,
      projectId: activityChanged === true ? projectId : undefined,
      begin: selectedStartDate ?? undefined,
      end: selectedEndDate ?? undefined,
    });

    onClose(true);
  }

  render() {
    const {
      loading, hasValues, activity, notes, startStr, endStr, activities,
    } = this.state;
    const { onClose } = this.props;
    return (
      <div className="modal is-active">
        {/* I dont think a "none" role is the right thing here */}
        <div role="none" className="modal-background" onClick={(e) => { e.stopPropagation(); onClose(); }} />
        <div className="modal-card">
          {loading ? <></> : (
            <div>
              <header className="modal-card-head">
                <p className="modal-card-title">Time Entry</p>
                <button type="button" className="delete" aria-label="close" onClick={(e) => { e.stopPropagation(); onClose(); }} />
              </header>
              <section className="modal-card-body">
                {loading ? <div>Loading...</div> : (
                  <div>
                    <div className="field">
                      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                      <label className="label">
                        Activity
                        <div className="control">
                          <div className="select">
                            <select
                              onChange={e => this.setState({
                                activity: e.target.value,
                                activityChanged: true,
                              })}
                              value={activity}
                            >
                              {/* eslint-disable-next-line max-len */}
                              {(Object.values(activities as GroupedActivities) as ProjectActivities[])?.map(proj => (
                                <optgroup label={proj.name} key={proj.projectId}>
                                  {proj.activities.map(i => (
                                    <option value={`${proj.projectId}-${i.activityId}`}>
                                      {i.name}
                                    </option>
                                  ))}
                                </optgroup>
                              ))}
                            </select>
                          </div>
                        </div>
                      </label>
                    </div>
                    <div className="field">
                      <label className="label">
                        Notes
                        <div className="control">
                          <textarea
                            className="textarea"
                            onChange={e => this.setState({ notes: e.target.value })}
                            value={notes ?? ''}
                            ref={this.notesInput}
                          />
                        </div>
                      </label>
                    </div>
                    <div className="field">
                      <label className="label">
                        Start
                        <div className="control">
                          <input
                            className="input"
                            type="datetime-local"
                            onChange={e => this.setState({
                              startStr: e.target.value,
                              selectedStartDate: e.target.value !== '' ? new Date(e.target.value.replace('T', ' ')) : null,
                            })}
                            value={startStr ?? ''}
                          />
                        </div>
                      </label>
                    </div>
                    <div className="field">
                      <label className="label">
                        End
                        <div className="control">
                          <input
                            className="input"
                            type="datetime-local"
                            onChange={e => this.setState({
                              endStr: e.target.value,
                              selectedEndDate: e.target.value !== '' ? new Date(e.target.value.replace('T', ' ')) : null,
                            })}
                            value={endStr ?? ''}
                          />
                        </div>
                      </label>
                    </div>
                  </div>
                )}
              </section>
              <footer className="modal-card-foot is-flex is-justify-content-space-between">
                <button className="button is-success p-lg" type="submit" onClick={this.handleSave.bind(this)}>Save</button>
              </footer>
            </div>
          )}
        </div>
      </div>
    );
  }
}
