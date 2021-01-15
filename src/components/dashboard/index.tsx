import React from 'react';
import { faTachometerAlt } from '@fortawesome/free-solid-svg-icons';
import ChronoWidget from './ChronoWidget';
import CountdownWidget from './CountdownWidget';
import DateWidget from './DateWidget';
import UserLayout from '../UserLayout';
import WeatherWidget from './WeatherWidget';
import WorkWidget from './WorkWidget';
import NotesWidget from './NotesWidget';
import DashboardLayout from '../../dashboardLayout.json';
import DashboardComponent from '../DashboardComponent';

interface WidgetConfig {
  component: DashboardComponent<any, any, any>,
  name: string,
  size?: string,
  key?: string,
  passthroughOpts: object
}

class Dashboard extends React.PureComponent {
  constructor(props: {}) {
    super(props);
    const { widgets } = DashboardLayout;

    // const config: WidgetConfig[] = widgets.map<WidgetConfig>((widget) => {
    //   const normalizedSize = widget.size === 'whole' ? undefined : widget.size;
    //   if (widget.type === 'date') {
    //     return {
    //       component: DateWidget,
    //       name: widget.name,
    //       size: normalizedSize,
    //       passthroughOpts: {
    //         otherTzId: widget.otherTzId,
    //         otherTzName: widget.otherTzName,
    //       },
    //     };
    //   }
    //   // throw Error('Unknown widget type');
    // });
  }

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
            {/* <ChronoWidget id="1" /> */}
            <CountdownWidget id="0" />
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
