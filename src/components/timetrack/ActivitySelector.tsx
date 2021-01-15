import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons';
// import GetActivities from '../../libs/kimai/get_activities';
// import GroupedActivities from '../../libs/kimai/@types/GroupedActivities';

import KimaiSdk from 'kimai-sdk/src/index';
import GroupedActivities from 'kimai-sdk/src/@types/GroupedActivities';
import config from '../../libs/kimai/get_configuration';

// Get around the fact this package doesn't have types
const bulmaCollapsible: any = require('@creativebulma/bulma-collapsible');

type ActivitySelectorProps = {
  onSelectActivity: Function,
}
type ActivitySelectorState = {
  loading: boolean,
  activities: GroupedActivities,
}

export default class ActivitySelector extends React.Component<ActivitySelectorProps,
  ActivitySelectorState> {
  private collapsibles = React.createRef<HTMLDivElement>();

  constructor(props: ActivitySelectorProps) {
    super(props);
    this.state = {
      loading: true,
      activities: {},
    };
  }

  async componentDidMount() {
    const kimaiSdk = new KimaiSdk(config);
    const activities = await kimaiSdk.getActivities();

    this.setState({
      loading: false,
      activities,
    }, () => {
      bulmaCollapsible.attach('.is-collapsible', {
        container: this.collapsibles.current,
      });
    });
  }

  render() {
    const { loading, activities } = this.state;
    const { onSelectActivity } = this.props;
    return (
      <div>
        {loading ? (
          <span className="has-text-black">
            <FontAwesomeIcon icon={faCircleNotch} className="fa-spin" />
            {' '}
            Loading...
          </span>
        ) : (
          <div>

            <div ref={this.collapsibles} id="accordion_first">
              {Object.values(activities).map(proj => (
                <div className="message" key={proj.projectId}>
                  <div className="message-header" data-action="collapse" data-target={`#collapsible-message-accordion-${proj.projectId}`}>
                    {proj.name}
                    {/* <a href={`#collapsible-message-accordion-${proj.projectId}`} >
                      Collapse/Expand
                    </a> */}
                  </div>
                  <div
                    id={`#collapsible-message-accordion-${proj.projectId}`}
                    className="message-body is-collapsible"
                    data-parent="accordion_first"
                  >
                    {proj.activities.map((i: any) => (
                      <button
                        type="submit"
                        className="m-t-sm m-b-sm p-t-lg p-b-lg button is-fullwidth"
                        style={{ backgroundColor: i.color }}
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectActivity(i.activityId, proj.projectId);
                        }}
                        key={i.activityId}
                      >
                        {i.name}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }
}
