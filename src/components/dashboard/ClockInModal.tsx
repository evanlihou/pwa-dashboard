import React from 'react';
import clockIn from '../../libs/kimai/clock_in';
import ActivitySelector from '../timetrack/ActivitySelector';
import DashboardComponent from '../DashboardComponent';

type ClockInModalProps = {
  onClose: Function,
};

type ClockInModalState = {
  clockInNotes: string | null,
};

export default class ClockInModal extends DashboardComponent<ClockInModalProps, ClockInModalState> {
  private notesInput = React.createRef<HTMLTextAreaElement>();

  constructor(props: ClockInModalProps) {
    super(props);
    this.state = {
      clockInNotes: null,
    };
    this.handleJobSelect = this.handleJobSelect.bind(this);
  }

  async componentDidMount() {
    // Automatically focus the notes when the component mounts
    if (this.notesInput.current !== null) this.notesInput.current.focus();
  }

  async handleJobSelect(activityId: number, projectId: number) {
    const { clockInNotes } = this.state;
    const { onClose } = this.props;
    const { addError } = this.context;

    try {
      await clockIn({
        activity: activityId,
        project: projectId,
        description: clockInNotes !== '' && clockInNotes !== null ? clockInNotes : undefined,
      });
    } catch (error) {
      addError(error.ToString());
    }

    onClose(true);
  }

  handleNotesChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
    this.setState({ clockInNotes: event.target.value });
  }

  render() {
    const { onClose } = this.props;
    return (
      <div className="modal is-active" role="dialog">
        <div role="none" className="modal-background" onClick={(e) => { e.stopPropagation(); onClose(); }} />
        <div className="modal-card">
          <header className="modal-card-head">
            <p className="modal-card-title">Clock In</p>
            <button className="delete" type="button" aria-label="close" onClick={(e) => { e.stopPropagation(); onClose(); }} />
          </header>
          <section className="modal-card-body">
            <div className="field">
              <label className="label">
                Notes
                <div className="control">
                  <textarea className="textarea" onChange={e => this.setState({ clockInNotes: e.target.value })} ref={this.notesInput} />
                </div>
              </label>
            </div>
            <ActivitySelector onSelectActivity={this.handleJobSelect} />
          </section>
        </div>
      </div>
    );
  }
}
