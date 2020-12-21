import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons';
import PropTypes from 'prop-types';
import getActivities from '../../libs/kimai/get_activities';
import clockIn from '../../libs/kimai/clock_in';

export default class ClockInModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      jobList: [],
    };

    getActivities().then((activities) => {
      this.setState({
        loading: false,
        jobList: activities,
      });
    });
  }

  handleJobSelect(activityId, projectId) {
    const { onClose } = this.props;

    clockIn({
      activity: activityId,
      project: projectId,
    });

    onClose(true);
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
            {loading ? <span className="has-text-black"><FontAwesomeIcon icon={faCircleNotch} className="fa-spin" /> Loading...</span> : (
              <div>
                {jobList.map(i => (
                  <button type="submit" className="m-t-sm m-b-sm p-t-lg p-b-lg button is-fullwidth" onClick={(e) => { e.stopPropagation(); this.handleJobSelect(i.activityId, i.projectId); }} key={i.activityId}>
                    <span style={{
                      backgroundColor: i.color, width: '1em', height: '1em', marginRight: '0.5em',
                    }}
                    />
                    {i.name}
                  </button>
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
