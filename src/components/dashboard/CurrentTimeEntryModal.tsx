import React from 'react';
import { format, startOfToday } from 'date-fns';
import KimaiSdk from 'kimai-sdk/src/index';
import { StatusStatus } from 'kimai-sdk/src/GetStatus';
import config from '../../libs/kimai/get_configuration';
import DashboardComponent from '../DashboardComponent';

type CurrentTimeEntryModalProps = {
  onClose: Function,
  status: StatusStatus
};

type CurrentTimeEntryModalState = {
  loading: boolean,
  hasValues: boolean,
  timesheetId: number | null,
  activity: string | null,
  startTimeStr: string,
  startTimeMillis: number | null,
  startTimeChanged: boolean,
  notes: string | null
};

export default class CurrentTimeEntryModal extends DashboardComponent<
  CurrentTimeEntryModalProps, CurrentTimeEntryModalState> {
  private notesInput = React.createRef<HTMLTextAreaElement>();

  private kimaiSdk = new KimaiSdk(config);

  private autoFocusNotes = false;

  constructor(props: CurrentTimeEntryModalProps) {
    super(props);
    this.state = {
      loading: true,
      hasValues: false,
      timesheetId: null,
      activity: '',
      startTimeStr: '',
      startTimeMillis: null,
      startTimeChanged: false,
      notes: '',
    };
  }

  componentDidMount() {
    const { status } = this.props;

    this.setState({
      hasValues: true,
      loading: false,
      timesheetId: status.timesheetId,
      notes: status.shiftNotes,
      activity: `${status.jobName}`,
      startTimeStr: status.start !== null ? format(status.start, 'HH:mm') : '',
      startTimeMillis: null,
      startTimeChanged: false,
    }, () => {
      // Automatically focus the notes when the component mounts
      if (this.autoFocusNotes && this.notesInput.current !== null) {
        this.notesInput.current.focus();
        this.notesInput.current.selectionStart = this.notesInput.current.value.length;
        this.notesInput.current.selectionEnd = this.notesInput.current.value.length;
      }
    });
  }

  async handleClockOut() {
    const { onClose } = this.props;
    const { timesheetId, notes } = this.state;
    const { addError } = this.context;

    if (timesheetId === null) {
      addError('Unable to get current timesheet');
      return;
    }

    await this.kimaiSdk.clockOut({
      id: timesheetId,
      description: notes ?? '',
    });

    onClose(true, true);
  }

  async handleNotesChange() {
    const { onClose } = this.props;
    const {
      timesheetId, notes, startTimeMillis, startTimeChanged,
    } = this.state;
    const { addError } = this.context;

    if (timesheetId === null) {
      addError('Unable to get current timesheet');
      return;
    }

    const beginDate = startOfToday();
    beginDate.setTime(beginDate.getTime() + (startTimeMillis !== null ? startTimeMillis : 0));

    await this.kimaiSdk.updateTimesheet({
      id: timesheetId,
      description: notes ?? '',
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
                          <textarea className="textarea" onChange={e => this.setState({ notes: e.target.value })} value={notes ?? ''} ref={this.notesInput} />
                        </div>
                      </label>
                      <label className="label">
                        Start Time
                        <div className="control">
                          <input className="input" type="time" onChange={e => this.setState({ startTimeStr: e.target.value, startTimeMillis: e.target.valueAsDate?.getTime() ?? null, startTimeChanged: true })} value={startTimeStr} />
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
