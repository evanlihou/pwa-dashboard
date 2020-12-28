/**
 * This widget is currently not in use, it could use some better TypeScript-ificaiton at some point
 */

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons';
import getWeather from '../../libs/climacell/get_weather';
import DashboardComponent from '../DashboardComponent';

const weatherIcons = require.context('../resources/img/weather_icons', true);

type WeatherWidgetProps = {
}

type WeatherWidgetState = {
  loading: boolean,
  hasValues: boolean,
  weather: any,
  icon: any
}

export default class WeatherWidget
  extends DashboardComponent<WeatherWidgetProps, WeatherWidgetState> {
  private tickInterval?: number;

  constructor(props: WeatherWidgetProps) {
    super(props);
    this.state = {
      loading: true,
      hasValues: false,
      weather: {},
      icon: null,
    };
  }

  componentDidMount() {
    this.tick();
    this.tickInterval = window.setInterval(() => (this.tick()), 120 * 1000);
  }

  componentWillUnmount() {
    clearInterval(this.tickInterval);
  }

  tick() {
    this.setState({ loading: true });
    const handleResposne = (resp: any) => {
      if (resp.error !== undefined) {
        // alert('Error fetching weather!');
        return;
      }
      // console.log(resp);
      try {
        this.setState({
          icon: weatherIcons(`./${resp.weather.weather_code.value}.svg`).default,
        });
      } catch {
        // This is really hacky idk how they expect you to interpret whether to use day/night icons
        this.setState({
          icon: weatherIcons(`./${resp.weather.weather_code.value}_day.svg`).default,
        });
      }
      this.setState({
        loading: false,
        hasValues: true,
        weather: resp.weather,
      });
    };
    getWeather(handleResposne);
  }

  render() {
    const {
      loading, hasValues, icon, weather,
    } = this.state;
    return (
      <div role="button" tabIndex={0} className="box notification is-grey-light" onClick={() => { this.tick(); }} onKeyPress={(e) => { if (e.key === 'Enter') this.tick(); }}>
        <div className="heading">Weather</div>
        {loading ? <span style={{ position: 'absolute', top: '5px', right: '10px' }}><FontAwesomeIcon icon={faCircleNotch} className="fa-spin" /></span> : <></>}
        {!hasValues ? <></> : (
          <div>
            <div className="title">
              <span className="icon"><img alt="" src={icon} /></span>
              {Math.round(weather.feels_like.value)}
              º
            </div>
            <div className="level">
              <div className="level-item">
                <div className="">
                  <div className="heading">Sunset</div>
                  <div className="title is-5">{weather.sunset.value.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}</div>
                </div>
              </div>
              <div className="level-item">
                <div className="">
                  <div className="heading">Today</div>
                  <div className="title is-5" />
                </div>
              </div>
              <div className="level-item">
                <div className="">
                  <div className="heading">This Week</div>
                  <div className="title is-5" />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}
