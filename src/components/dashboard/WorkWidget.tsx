import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons';
import getStatus, { StatusStatus } from '../../libs/kimai/get_status';
import ClockInModal from './ClockInModal';
import CurrentTimeEntryModal from './CurrentTimeEntryModal';
import DashboardComponent from '../DashboardComponent';

type WorkWidgetState = {
  loading: boolean,
  promptClockInJobs: boolean,
  promptTimeEntryModal: boolean,
  hasValues: boolean,
  isIn: boolean,
  activity: string | null,
  activityLength: string | null,
  timeIn: string | null,
  today: string,
  thisWeek: string,
  status: StatusStatus | null,
}

export default class WorkWidget extends DashboardComponent<{}, WorkWidgetState> {
  private tickInterval: number | null;

  constructor(props: {}) {
    super(props);
    this.state = {
      loading: true,
      promptClockInJobs: false,
      promptTimeEntryModal: false,
      hasValues: false,
      isIn: false,
      activity: null,
      activityLength: null,
      timeIn: '',
      today: '',
      thisWeek: '',
      status: null,
    };
    this.tickInterval = null;
  }

  async componentDidMount() {
    this.tick();
    this.tickInterval = window.setInterval(() => (this.tick()), 30 * 1000);
  }

  componentWillUnmount() {
    if (this.tickInterval !== null) {
      window.clearInterval(this.tickInterval);
      // Ideally we would clear `this.tickInterval` but we know that the component
      // is being unmounted anyway
    }
  }

  async tick() {
    const { addError } = this.context;
    this.setState({ loading: true });
    try {
      const { status, totals } = await getStatus();
      this.setState({
        status,
        hasValues: true,
        loading: false,
        isIn: status.clockedIn,
        activity: status.jobName,
        activityLength: status.shiftTime,
        timeIn: status.start !== null
          ? (new Date(status.start)).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
          : null,
        today: totals.day,
        thisWeek: totals.week,
      });
    } catch (error) {
      addError(error);
    }
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
      promptClockInJobs, promptTimeEntryModal, status,
    } = this.state;
    return (
      <div role="button" tabIndex={0} className="box notification is-purple" onClick={() => { this.clockInOut(); }} onKeyPress={(e) => { if (e.key === 'Enter') this.clockInOut(); }}>
        <div className="heading">TimeTrack</div>
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
            status={status!}
          />
        ) : <></>}
      </div>
    );
  }
}
