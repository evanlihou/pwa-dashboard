import React from 'react';
import DashboardComponent from '../DashboardComponent';

type ChronoWidgetProps = {
  id?: string,
  color: string,
  name: string
};

type ChronoWidgetState = {
  isRunning: boolean,
  startTime: Date | null,
  runningTime: string,
};

export default class ChronoWidget extends DashboardComponent<ChronoWidgetProps, ChronoWidgetState> {
  private tickInterval: number | null;

  private supportsLocalStorage: boolean;

  private localStorageKey: string;

  constructor(props: ChronoWidgetProps) {
    super(props);
    this.state = {
      isRunning: false,
      startTime: null,
      runningTime: '00.0',
    };
    this.tickInterval = null;
    this.supportsLocalStorage = typeof Storage !== 'undefined';
    // ID can be used to support multiple chronometers on a dashboard while keeping
    // their respective start times
    const idString = props.id !== undefined ? props.id : '';
    this.localStorageKey = `chronoStartTime${idString}`;
  }

  componentDidMount() {
    if (this.supportsLocalStorage && localStorage[this.localStorageKey] !== undefined) {
      this.setState({
        isRunning: true,
        startTime: new Date(localStorage[this.localStorageKey]),
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

  onLongPress() {
    this.setState({
      isRunning: false,
      runningTime: '00.0',
    });
  }

  tick() {
    const { isRunning, startTime } = this.state;
    if (isRunning && startTime) {
      const runningMs = new Date().getTime() - startTime.getTime();
      const hours = Math.floor(runningMs / (1000 * 60 * 60));
      const minutes = Math.floor(runningMs / (1000 * 60)) % 60;
      const seconds = Math.floor(runningMs / (1000)) % 60;
      const tenths = Math.round((runningMs % 1000) / 100) % 10;

      let ret = '';
      if (hours > 0) ret += `${hours}:`;
      if (hours > 0 || minutes > 0) ret += `${minutes > 9 ? minutes : `0${minutes}`}:`;
      ret += `${seconds > 9 ? seconds : `0${seconds}`}.`;
      ret += tenths;

      this.setState({
        runningTime: ret,
      });
    }
  }

  startStopChrono() {
    const { isRunning } = this.state;
    if (isRunning) {
      this.setState({
        isRunning: false,
      });
      if (this.tickInterval !== null) {
        window.clearInterval(this.tickInterval);
      }
      if (this.supportsLocalStorage) {
        delete localStorage[this.localStorageKey];
      }
    } else {
      const startTime = new Date();
      this.setState({
        isRunning: true,
        startTime,
      });
      this.tick();
      this.tickInterval = window.setInterval(() => (this.tick()), 100);
      localStorage[this.localStorageKey] = startTime.toJSON();
    }
  }

  render() {
    return (
      <div className={`box notification is-${this.props.color}`} role="button" tabIndex={0} onKeyPress={(e) => { if (e.key === 'Enter') this.startStopChrono(); else if (e.key === 'r') this.onLongPress(); }} onClick={() => { this.startStopChrono(); }} onContextMenu={(e) => { e.preventDefault(); this.onLongPress(); }}>
        <div className="heading">{this.props.name}</div>
        <div className="title">{this.state.runningTime}</div>
      </div>
    );
  }
}
