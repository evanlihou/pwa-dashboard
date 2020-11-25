import React from 'react';
import PropTypes from 'prop-types';

export default class ChronoWidget extends React.Component {
  constructor(props) {
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
    this.idString = props.id !== undefined ? props.id : '';
    this.localStorageKey = `chronoStartTime${this.idString}`;
  }

  componentDidMount() {
    if (this.supportsLocalStorage && localStorage[this.localStorageKey] !== undefined) {
      this.setState({
        isRunning: true,
        startTime: new Date(localStorage[this.localStorageKey]),
      });
      this.tick();
      this.tickInterval = setInterval(() => (this.tick()), 100);
    }
  }

  componentWillUnmount() {
    clearInterval(this.tickInterval);
  }

  onLongPress() {
    this.setState({
      isRunning: false,
      runningTime: '00.0',
    });
  }

  tick() {
    const { isRunning, startTime } = this.state;
    if (isRunning) {
      const runningMs = new Date() - startTime;
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
      clearInterval(this.tickInterval);
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
      this.tickInterval = setInterval(() => (this.tick()), 100);
      localStorage[this.localStorageKey] = startTime.toJSON();
    }
  }

  render() {
    const { runningTime } = this.state;
    return (
      <div className="box notification is-yellow" role="button" tabIndex={0} onKeyPress={(e) => { if (e.key === 'Enter') this.startStopChrono(); else if (e.key === 'r') this.onLongPress(); }} onClick={() => { this.startStopChrono(); }} onContextMenu={(e) => { e.preventDefault(); this.onLongPress(); }}>
        <div className="heading">Chrono</div>
        <div className="title">{runningTime}</div>
      </div>
    );
  }
}

ChronoWidget.propTypes = {
  id: PropTypes.string.isRequired,
};
