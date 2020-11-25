import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons';
import getCurrentStatus from '../libs/tsheets/get_current_status';
import ClockInModal from './clock-in-modal';
import CurrentTimeEntryModal from './current-timeentry-modal';
import tsheetsConfig from '../libs/tsheets/get_configuration';

export default class WorkWidget extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      promptClockInJobs: false,
      promptTimeEntryModal: false,
      hasValues: false,
      isIn: false,
      activity: '',
      activityLength: '',
      timeIn: '',
      today: '',
      thisWeek: '',
    };
    this.tickInterval = null;
  }

  componentDidMount() {
    console.log(tsheetsConfig);
    this.tick();
    this.tickInterval = setInterval(() => (this.tick()), 30 * 1000);
  }

  componentWillUnmount() {
    clearInterval(this.tickInterval);
  }

  tick() {
    function handleResponse(resp) {
      if (resp.error) {
        alert(resp.error.message);
        return;
      }
      this.setState({
        hasValues: true,
        loading: false,
        isIn: resp.status.clockedIn,
        activity: resp.status.jobName,
        activityLength: resp.status.shift_time,
        timeIn: (new Date(resp.status.start)).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
        today: resp.totals.day,
        thisWeek: resp.totals.week,
      });
    }
    this.setState({ loading: true });
    getCurrentStatus(handleResponse.bind(this));
  }

  clockInOut() {
    const { isIn } = this.state;
    if (isIn) {
      this.setState({
        promptTimeEntryModal: true,
      });
    } else {
      this.setState({
        promptClockInJobs: true,
      });
    }
  }

  render() {
    const {
      loading, hasValues, isIn, activity, activityLength, timeIn, today, thisWeek,
      promptClockInJobs, promptTimeEntryModal,
    } = this.state;
    return (
      <div role="button" tabIndex={0} className="box notification is-purple" onClick={() => { this.clockInOut(); }} onKeyPress={(e) => { if (e.key === 'Enter') this.clockInOut(); }}>
        <div className="heading">Work</div>
        {loading ? <span style={{ position: 'absolute', top: '5px', right: '10px' }}><FontAwesomeIcon icon={faCircleNotch} className="fa-spin" /></span> : <></>}
        {!hasValues ? <></> : (
          <div>
            <div className="title">{isIn ? `${activity} - ${activityLength}` : 'out'}</div>
            <div className="level">
              <div className="level-item">
                <div className="">
                  <div className="heading">Time In</div>
                  <div className="title is-5">{isIn ? timeIn : '-'}</div>
                </div>
              </div>

              <div className="level-item">
                <div className="">
                  <div className="heading">Today</div>
                  <div className="title is-5">{today}</div>
                </div>
              </div>
              <div className="level-item">
                <div className="">
                  <div className="heading">This Week</div>
                  <div className="title is-5">{thisWeek}</div>
                </div>
              </div>
            </div>
          </div>
        )}
        {promptClockInJobs ? (
          <ClockInModal
            onClose={(shouldRefresh = false) => {
              if (shouldRefresh) {
                this.tick();
              }
              this.setState({ promptClockInJobs: false });
            }}
          />
        ) : <></>}
        {promptTimeEntryModal ? (
          <CurrentTimeEntryModal
            onClose={(shouldRefresh = false) => {
              if (shouldRefresh) {
                this.tick();
              }
              this.setState({ promptTimeEntryModal: false });
            }}
          />
        ) : <></>}
      </div>
    );
  }
}
