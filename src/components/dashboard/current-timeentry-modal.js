import React from 'react';
import PropTypes from 'prop-types';
import getCurrentStatus from '../../libs/tsheets/get_current_status';
import { clockOut } from '../../libs/tsheets/clock_in_out';
import updateNotes from '../../libs/tsheets/update_notes';

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
    function handleResponse(resp) {
      if (resp.error) {
        alert(resp.error.message);
        return;
      }
      this.setState({
        hasValues: true,
        loading: false,
        timesheetId: resp.status.timesheetId,
        notes: resp.status.shift_notes,
        activity: resp.status.jobName,
      }, () => {
        // Automatically focus the notes when the component mounts
        this.notesInput.focus();
        this.notesInput.selectionStart = this.notesInput.value.length;
        this.notesInput.selectionEnd = this.notesInput.value.length;
      });
    }
    getCurrentStatus(handleResponse.bind(this));
  }

  handleClockOut() {
    const { onClose } = this.props;
    const { timesheetId } = this.state;
    function handleResponse(resp) {
      if (resp.error) {
        alert(resp.error.message);
        return;
      }

      onClose(true);
    }

    clockOut({
      clockOut: {
        timesheetId,
      },
    }, handleResponse.bind(this));
  }

  handleNotesChange() {
    const { onClose } = this.props;
    const { timesheetId, notes } = this.state;
    function handleResponse(resp) {
      if (resp.error) {
        alert(resp.error.message);
        return;
      }

      onClose(true);
    }

    updateNotes({
      updateNotes: {
        timesheetId,
        notes,
      },
    }, handleResponse.bind(this));
  }

  render() {
    const {
      loading, hasValues, activity, notes,
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
  onClose: PropTypes.func.isRequired,
};
