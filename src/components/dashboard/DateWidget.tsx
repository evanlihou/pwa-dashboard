import React from 'react';
import DashboardComponent from '../DashboardComponent';

type DateWidgetProps = {
  name: string,
  otherTzId: string,
  otherTzName: string,
}

type DateWidgetState = {
  time: {
    main: string,
    otherTz: string,
    zulu: string
  }
}

export default class DateWidget extends DashboardComponent<DateWidgetProps, DateWidgetState> {
  private tickInterval?: number;

  constructor(props: DateWidgetProps) {
    super(props);
    this.state = {
      time: {
        main: '',
        otherTz: '',
        zulu: '',
      },
    };
    this.tickInterval = undefined;
  }

  componentDidMount() {
    this.tick();
    this.tickInterval = window.setInterval(() => (this.tick()), 5 * 1000);
  }

  componentWillUnmount() {
    clearInterval(this.tickInterval);
  }

  tick() {
    const date = new Date();
    this.setState({
      time: {
        main: date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
        otherTz: date.toLocaleTimeString('en-US', { timeZone: this.props.otherTzId, hour: 'numeric', minute: '2-digit' }),
        zulu: date.toLocaleTimeString('en-US', {
          timeZone: 'Etc/UTC', hour: '2-digit', minute: '2-digit', hour12: false,
        }),
      },
    });
  }

  render() {
    const { time } = this.state;
    const { otherTzName } = this.props;
    return (
      <div className="box notification is-info">
        <div className="heading">Time</div>
        <div className="title">{time.main}</div>
        <div className="level">
          <div className="level-item">
            <div className="">
              <div className="heading">{otherTzName}</div>
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
