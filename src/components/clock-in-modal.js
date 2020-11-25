import React from 'react';
import PropTypes from 'prop-types';
import getJobs from '../libs/tsheets/get_jobs';
import { clockIn } from '../libs/tsheets/clock_in_out';

export default class ClockInModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      jobList: [],
    };
  }

  componentDidMount() {
    function handleResponse(resp) {
      if (resp.error) {
        alert(resp.error.message);
        return;
      }
      this.setState({
        loading: false,
        jobList: resp.jobs,
      });
    }

    getJobs({}, handleResponse.bind(this));
  }

  handleJobSelect(id) {
    const { onClose } = this.props;
    function handleClockIn(resp) {
      if (resp.error) {
        alert(resp.error.message);
        return;
      }
      onClose(true);
    }

    clockIn({
      clockIn: {
        jobId: id,
      },
    }, handleClockIn.bind(this));
  }

  render() {
    const { loading, jobList } = this.state;
    const { onClose } = this.props;
    return (
      <div className="modal is-active" role="dialog">
        <div className="modal-background" aria-label="Modal Backdrop. Click to close." onClick={(e) => { e.stopPropagation(); onClose(); }} />
        <div className="modal-card">
          <header className="modal-card-head">
            <p className="modal-card-title">Clock In</p>
            <button className="delete" type="button" aria-label="close" onClick={(e) => { e.stopPropagation(); onClose(); }} />
          </header>
          <section className="modal-card-body">
            {loading ? <div>Loading...</div> : (
              <div>
                {jobList.map(i => (
                  <button type="submit" className="m-t-sm m-b-sm p-t-lg p-b-lg button is-fullwidth" onClick={(e) => { e.stopPropagation(); this.handleJobSelect(i.id); }} key={i.id}>{i.name}</button>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    );
  }
}

ClockInModal.propTypes = {
  onClose: PropTypes.func.isRequired,
};
