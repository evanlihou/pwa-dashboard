import React from 'react';
import { faTachometerAlt } from '@fortawesome/free-solid-svg-icons';
import ChronoWidget from './ChronoWidget';
import DateWidget from './DateWidget';
import UserLayout from '../UserLayout';
// import WeatherWidget from './WeatherWidget';
import WorkWidget from './WorkWidget';
import NotesWidget from './NotesWidget';

class Dashboard extends React.PureComponent {
  render() {
    return (
      <UserLayout icon={faTachometerAlt} name="Dashboard">
        <div className="columns is-multiline">
          <div className="column is-half">
            <DateWidget />
          </div>
          <div className="column is-half">
            <WorkWidget />
          </div>
          <div className="column is-half">
            <ChronoWidget id="0" />
          </div>
          <div className="column is-half">
            <ChronoWidget id="1" />
          </div>
          {/* <div className="column is-half">
            <WeatherWidget />
          </div> */}
          <div className="column">
            <NotesWidget id="0" />
          </div>
        </div>
      </UserLayout>
    );
  }
}

export default Dashboard;
