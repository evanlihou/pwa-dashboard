import React from 'react';
import PropTypes from 'prop-types';
import { format, startOfToday } from 'date-fns';
import clockOut from '../../libs/kimai/clock_out';
import updateNotes from '../../libs/kimai/update_timesheet';

export default class CurrentTimeEntryModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      timesheetId: null,
      activity: '',
      notes: '',
    };
  }

  componentDidMount() {
    const { status } = this.props;

    this.setState({
      hasValues: true,
      loading: false,
      timesheetId: status.timesheetId,
      notes: status.shift_notes,
      activity: `${status.jobName}`,
      startTimeStr: format(status.start, 'HH:mm'),
      startTimeMillis: null,
      startTimeChanged: false,
    }, () => {
      // Automatically focus the notes when the component mounts
      this.notesInput.focus();
      this.notesInput.selectionStart = this.notesInput.value.length;
      this.notesInput.selectionEnd = this.notesInput.value.length;
    });
  }

  async handleClockOut() {
    const { onClose } = this.props;
    const { timesheetId, notes } = this.state;

    await clockOut({
      id: timesheetId,
      description: notes,
    });

    onClose(true);
  }

  async handleNotesChange() {
    const { onClose } = this.props;
    const {
      timesheetId, notes, startTimeMillis, startTimeChanged,
    } = this.state;

    const beginDate = startOfToday();
    beginDate.setTime(beginDate.getTime() + startTimeMillis);

    await updateNotes({
      id: timesheetId,
      description: notes,
      begin: startTimeChanged === true ? beginDate : undefined,
    });

    onClose(true);
  }

  render() {
    const {
      loading, hasValues, activity, notes, startTimeStr,
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
                      <label className="label">
                        Notes
                        <div className="control">
                          <textarea className="textarea" onChange={e => this.setState({ notes: e.target.value })} value={notes} ref={(input) => { this.notesInput = input; }} />
                        </div>
                      </label>
                      <label className="label">
                        Start Time
                        <div className="control">
                          <input className="input" type="time" onChange={e => this.setState({ startTimeStr: e.target.value, startTimeMillis: e.target.valueAsDate.getTime(), startTimeChanged: true })} value={startTimeStr} />
                        </div>
                      </label>
                    </div>
                  </div>
                )}
              </section>
              <footer className="modal-card-foot is-flex is-justify-content-space-between">
                <button className="button p-lg" type="button" onClick={this.handleClockOut.bind(this)}>Clock Out</button>
                <button className="button is-success p-lg" type="submit" onClick={this.handleNotesChange.bind(this)}>Save</button>
              </footer>
            </div>
          )}
        </div>
      </div>
    );
  }
}

CurrentTimeEntryModal.propTypes = {
  status: PropTypes.objectOf().isRequired,
  onClose: PropTypes.func.isRequired,
};
