import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons';
import bulmaCollapsible from '@creativebulma/bulma-collapsible';
import GetActivities from '../../libs/kimai/get_activities';

export default class ActivitySelector extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      activities: {},
    };
    this.collapsibles = React.createRef();
  }

  async componentDidMount() {
    const activities = await GetActivities();

    this.setState({
      loading: false,
      activities,
    }, () => {
      this.bulmaCollapsibles = bulmaCollapsible.attach('.is-collapsible', {
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
                    {proj.activities.map(i => (
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

ActivitySelector.propTypes = {
  onSelectActivity: PropTypes.func.isRequired,
};
