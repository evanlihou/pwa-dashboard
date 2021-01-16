import React from 'react';
import { faTachometerAlt } from '@fortawesome/free-solid-svg-icons';
import ChronoWidget from './ChronoWidget';
import CountdownWidget from './CountdownWidget';
import DateWidget from './DateWidget';
import UserLayout from '../UserLayout';
import WorkWidget from './WorkWidget';
import NotesWidget from './NotesWidget';
import DashboardLayout from '../../dashboardLayout.json';

interface WidgetConfig {
  component: any, // this should be DashboardComponent but I can't get it to work...
  name: string,
  size?: string,
  color?: string,
  key?: string,
  passthroughOpts: object
}

class Dashboard extends React.PureComponent {
  private config: WidgetConfig[];

  constructor(props: {}) {
    super(props);
    const { widgets } = DashboardLayout;

    this.config = widgets.map<WidgetConfig>((widget) => {
      const normalizedSize = widget.size === 'whole' ? undefined : widget.size;
      if (widget.type === 'date') {
        return {
          component: DateWidget,
          name: widget.name,
          size: normalizedSize,
          passthroughOpts: {
            otherTzId: widget.otherTzId,
            otherTzName: widget.otherTzName,
          },
        };
      }
      if (widget.type === 'timetrack') {
        return {
          component: WorkWidget,
          name: widget.name,
          size: widget.size,
          passthroughOpts: {},
        };
      }
      if (widget.type === 'chrono') {
        return {
          component: ChronoWidget,
          name: widget.name,
          size: widget.size,
          key: widget.key,
          passthroughOpts: {},
        };
      }
      if (widget.type === 'countdown') {
        return {
          component: CountdownWidget,
          name: widget.name,
          size: widget.size,
          key: widget.key,
          passthroughOpts: {},
        };
      }
      if (widget.type === 'notes') {
        return {
          component: NotesWidget,
          name: widget.name,
          size: widget.size,
          key: widget.key,
          passthroughOpts: {},
        };
      }

      throw Error('Unknown widget type');
    });
  }

  render() {
    return (
      <UserLayout icon={faTachometerAlt} name="Dashboard">
        <div className="columns is-multiline">
          {this.config.map(component => (
            <div className={`column ${component.size !== undefined ? `is-${component.size}` : ''}`}>
              <component.component
                name={component.name}
                id={component.key}
                // This linting rule is bad
                // eslint-disable-next-line react/jsx-props-no-spreading
                {...component.passthroughOpts}
              />
            </div>
          ))}
        </div>
      </UserLayout>
    );
  }
}

export default Dashboard;
