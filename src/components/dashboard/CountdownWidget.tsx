import { addDays, startOfToday, format } from 'date-fns';
import React from 'react';
import DashboardComponent from '../DashboardComponent';

type CountdownWidgetProps = {
  id?: string,
};

type CountdownWidgetState = {
  modalVisible: boolean,
  isRunning: boolean,
  endTimeStr: string | null,
  endTime: Date | null,
  endTimeMillis: number | null,
  runningTime: string,
  isFlash: number,
  didFlash: boolean,
  flashIntervalId?: number,
};

export default class CountdownWidget extends DashboardComponent<
    CountdownWidgetProps, CountdownWidgetState> {
  private tickInterval: number | null;

  private supportsLocalStorage: boolean;

  private localStorageKey: string;

  constructor(props: CountdownWidgetProps) {
    super(props);
    this.state = {
      modalVisible: false,
      isRunning: false,
      endTimeStr: null,
      endTime: null,
      endTimeMillis: null,
      runningTime: '\u2014',
      isFlash: 0,
      // True to prevent it flashing on page load, gets reset on countdown start
      didFlash: true,
    };
    this.tickInterval = null;
    this.supportsLocalStorage = typeof Storage !== 'undefined';
    // ID can be used to support multiple chronometers on a dashboard while keeping
    // their respective start times
    const idString = props.id !== undefined ? props.id : '';
    this.localStorageKey = `countdownEndTime${idString}`;
  }

  componentDidMount() {
    if (this.supportsLocalStorage && localStorage[this.localStorageKey] !== undefined) {
      const endDate = new Date(localStorage[this.localStorageKey]);
      this.setState({
        isRunning: true,
        endTime: endDate,
        endTimeStr: format(endDate, 'HH:mm'),
        didFlash: endDate < new Date(),
      });
      this.tick();
      this.tickInterval = window.setInterval(() => (this.tick()), 100);
    }
  }

  componentWillUnmount() {
    if (this.tickInterval !== null) {
      window.clearInterval(this.tickInterval);
    }
  }

  onClick() {
    this.setState({
      modalVisible: true,
    });
  }

  tick() {
    const { isRunning, endTime } = this.state;
    if (isRunning && endTime) {
      const runningMs = endTime.getTime() - new Date().getTime();
      const totalSeconds = Math.abs(Math.round(runningMs / (1000)));
      const seconds = totalSeconds % 60;
      const minutes = Math.trunc((totalSeconds / 60) % 60);
      const hours = Math.trunc(totalSeconds / 60 / 60);

      const isPast = runningMs < 0;

      let ret = '';
      if (isPast) ret += '+';
      if (hours > 0) ret += `${hours}:`;
      ret += `${minutes > 9 ? minutes : `0${minutes}`}:`;
      ret += `${seconds > 9 ? seconds : `0${seconds}`}`;

      // ret = runningMs;

      this.setState({
        runningTime: ret,
      });

      if (runningMs < 5000 && !this.state.didFlash) {
        this.doFlash();
      }
    }
  }

  handleEndTimeUpdate() {
    const { endTimeMillis } = this.state;
    if (endTimeMillis === null) {
      return;
    }

    let endDate = startOfToday();
    endDate.setTime(endDate.getTime() + (endTimeMillis !== null ? endTimeMillis : 0));

    if (endDate < new Date()) {
      endDate = addDays(endDate, 1);
    }

    this.setState({
      endTime: endDate,
    });

    localStorage[this.localStorageKey] = endDate.toJSON();
  }

  startCountdown() {
    this.handleEndTimeUpdate();

    const { endTime } = this.state;
    if (endTime === null) {
      return;
    }
    this.setState({
      isRunning: true,
      modalVisible: false,
      didFlash: false,
    });
    this.tick();
    this.tickInterval = window.setInterval(() => (this.tick()), 100);
  }

  stopCountdown() {
    this.setState({
      isRunning: false,
      modalVisible: false,
      runningTime: '\u2014',
      isFlash: 0,
    });
    if (this.tickInterval !== null) {
      window.clearInterval(this.tickInterval);
    }
    if (this.supportsLocalStorage) {
      delete localStorage[this.localStorageKey];
    }
  }

  doFlash() {
    if (this.state.didFlash) {
      return;
    }

    let flashesToDo = 200;
    const intervalId = window.setInterval(() => {
      this.setState({
        isFlash: this.state.isFlash !== 1 ? 1 : 2,
      });

      flashesToDo -= 1;

      if (flashesToDo <= 0) {
        window.clearInterval(intervalId);
      }
    }, 500);

    this.setState({
      didFlash: true,
      flashIntervalId: intervalId,
    });
  }

  stopFlash() {
    if (this.state.flashIntervalId === undefined) {
      return;
    }

    window.clearInterval(this.state.flashIntervalId);

    this.setState({
      didFlash: true,
      isFlash: 0,
      flashIntervalId: undefined,
    });
  }

  render() {
    const {
      runningTime, modalVisible, endTimeStr, isFlash,
    } = this.state;
    return (
      <div>
        <div className="box notification is-yellow" style={{ marginBottom: 0 }} role="button" tabIndex={0} onKeyPress={(e) => { if (e.key === 'Enter') this.onClick(); else if (e.key === 'r') this.stopCountdown(); }} onClick={() => { this.onClick(); }} onContextMenu={(e) => { e.preventDefault(); this.stopCountdown(); }}>
          <div className="heading">Countdown</div>
          <div className="title">{runningTime}</div>
        </div>
        {modalVisible ? (
          <div className="modal is-active">
            {/* I dont think a "none" role is the right thing here */}
            <div role="none" className="modal-background" onClick={(e) => { e.stopPropagation(); this.setState({ modalVisible: false }); }} />
            <div className="modal-card">
              <div>
                <header className="modal-card-head">
                  <p className="modal-card-title">
                    Countdown
                  </p>
                  <button type="button" className="delete" aria-label="close" onClick={(e) => { e.stopPropagation(); this.setState({ modalVisible: false }); }} />
                </header>
                <section className="modal-card-body">
                  <div>
                    <div className="field">
                      <label className="label">
                        Start Time
                        <div className="control">
                          <input className="input" type="time" onChange={(e) => { this.setState({ endTimeStr: e.target.value, endTimeMillis: e.target.valueAsDate?.getTime() ?? null }); }} value={endTimeStr ?? ''} />
                        </div>
                      </label>
                    </div>
                  </div>
                </section>
                <footer className="modal-card-foot is-flex is-justify-content-space-between">
                  <button className="button p-lg" type="button" onClick={this.stopCountdown.bind(this)}>Stop</button>
                  <button className="button is-success p-lg" type="submit" onClick={this.startCountdown.bind(this)}>Start</button>
                </footer>
              </div>
            </div>
          </div>
        ) : <></>}
        {isFlash !== 0 ? (
          <div className="modal is-active">
            <div role="none" className="modal-background" style={{ backgroundColor: `rgba(170, 0, 0, ${isFlash === 1 ? '0.86' : 0})` }} onClick={this.stopFlash.bind(this)} />
          </div>
        ) : <></>}
      </div>
    );
  }
}
