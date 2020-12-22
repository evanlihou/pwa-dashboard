import React from 'react';
import PropTypes from 'prop-types';
import clockIn from '../../libs/kimai/clock_in';
import ActivitySelector from '../timetrack/activity_selector';

export default class ClockInModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      clockInNotes: null,
    };
    this.handleJobSelect = this.handleJobSelect.bind(this);
  }

  async componentDidMount() {
    // Automatically focus the notes when the component mounts
    this.notesInput.focus();
  }

  async handleJobSelect(activityId, projectId) {
    const { clockInNotes } = this.state;
    const { onClose } = this.props;

    await clockIn({
      activity: activityId,
      project: projectId,
      description: clockInNotes !== '' && clockInNotes !== null ? clockInNotes : undefined,
    });

    onClose(true);
  }

  handleNotesChange(event) {
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
                  <textarea className="textarea" onChange={e => this.setState({ clockInNotes: e.target.value })} ref={(input) => { this.notesInput = input; }} />
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

ClockInModal.propTypes = {
  onClose: PropTypes.func.isRequired,
};
