import React from 'react';

export default class DateWidget extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      time: {
        main: '',
        otherTz: '',
        otherTzName: 'Chicago',
        zulu: '',
      },
    };
    this.tickInterval = null;
  }

  componentDidMount() {
    this.tick();
    this.tickInterval = setInterval(() => (this.tick()), 5 * 1000);
  }

  componentWillUnmount() {
    clearInterval(this.tickInterval);
  }

  tick() {
    const date = new Date();
    this.setState({
      time: {
        main: date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
        otherTzName: 'Chicago',
        otherTz: date.toLocaleTimeString('en-US', { timeZone: 'America/Chicago', hour: 'numeric', minute: '2-digit' }),
        zulu: date.toLocaleTimeString('en-US', {
          timeZone: 'Etc/UTC', hour: '2-digit', minute: '2-digit', hour12: false,
        }),
      },
    });
  }

  render() {
    const { time } = this.state;
    return (
      <div className="box notification is-info">
        <div className="heading">Time</div>
        <div className="title">{time.main}</div>
        <div className="level">
          <div className="level-item">
            <div className="">
              <div className="heading">{time.otherTzName}</div>
              <div className="title is-5">{time.otherTz}</div>
            </div>
          </div>
          <div className="level-item">
            <div className="">
              <div className="heading">Zulu</div>
              <div className="title is-5">{time.zulu}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
