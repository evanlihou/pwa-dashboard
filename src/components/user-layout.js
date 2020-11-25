import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTachometerAlt } from '@fortawesome/free-solid-svg-icons';

export default class GuestLayout extends React.PureComponent {
  render() {
    // eslint-disable-next-line
    const { children } = this.props;
    return (
      <div>
        <div className="wrapper container p-md">
          <div className="columns">
            <main className="column main">
              <div className="level">
                <div className="level-left">
                  <div className="level-item">
                    <div className="title has-text-primary">
                      <FontAwesomeIcon icon={faTachometerAlt} />
                      {' '}
                      Dashboard
                    </div>
                  </div>
                </div>
              </div>
              {children}
            </main>
          </div>
        </div>
      </div>
    );
  }
}
