import React from 'react';
import PropTypes from 'prop-types';
import UpdateTimesheet from '../../libs/kimai/update_timesheet';
import GetTimesheet from '../../libs/kimai/get_timesheet';
import { toLocalTime } from '../../libs/kimai/date_tools';
import GetActivities from '../../libs/kimai/get_activities';

export default class TimesheetEditModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      timesheetId: null,
      activity: '',
      notes: '',
    };
  }

  async componentDidMount() {
    const { timesheetId } = this.props;

    const timesheet = await GetTimesheet(timesheetId);

    const activities = await GetActivities();

    this.setState({
      hasValues: true,
      loading: false,
      timesheetId: timesheet.id,
      notes: timesheet.description,
      activity: `${timesheet.project}-${timesheet.activity}`,
      activityChanged: false,
      startStr: toLocalTime(timesheet.begin, false),
      selectedStartDate: undefined,
      endStr: toLocalTime(timesheet.end, false),
      selectedEndDate: undefined,
      activities,
    });
  }

  async handleSave() {
    const { onClose } = this.props;
    const {
      timesheetId, notes, selectedStartDate, selectedEndDate, activity, activityChanged,
    } = this.state;

    await UpdateTimesheet({
      id: timesheetId,
      description: notes,
      activityId: activityChanged === true ? activity.split('-')[1] : undefined,
      projectId: activityChanged === true ? activity.split('-')[0] : undefined,
      begin: selectedStartDate !== undefined ? selectedStartDate : undefined,
      end: selectedEndDate !== undefined ? selectedEndDate : undefined,
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
                <p className="modal-card-title">
                  Time Entry
                  {hasValues ? ` - ${activity}` : ''}
                </p>
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
                              {Object.values(activities).map(proj => (
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
                            ref={(input) => { this.notesInput = input; }}
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
                            value={startStr}
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
                            value={endStr}
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

TimesheetEditModal.propTypes = {
  timesheetId: PropTypes.number.isRequired,
  onClose: PropTypes.func.isRequired,
};
