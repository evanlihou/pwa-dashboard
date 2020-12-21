import React from 'react';
import { faTachometerAlt } from '@fortawesome/free-solid-svg-icons';
import ChronoWidget from './chrono-widget';
import DateWidget from './date-widget';
import UserLayout from '../user-layout';
// import WeatherWidget from './weather-widget';
import WorkWidget from './work-widget';
import NotesWidget from './notes-widget';

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
            <ChronoWidget id={0} />
          </div>
          <div className="column is-half">
            <ChronoWidget id={1} />
          </div>
          {/* <div className="column is-half">
            <WeatherWidget />
          </div> */}
          <div className="column">
            <NotesWidget />
          </div>
        </div>
      </UserLayout>
    );
  }
}

export default Dashboard;
