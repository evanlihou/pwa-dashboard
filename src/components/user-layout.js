import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { withRouter } from 'react-router-dom';
import Navbar from './navbar';

class GuestLayout extends React.PureComponent {
  render() {
    // eslint-disable-next-line
    const { children, icon, name } = this.props;
    return (
      <div className="has-navbar-fixed-bottom">
        <div className="wrapper container p-md">
          <div className="columns">
            <main className="column main">
              <div className="level">
                <div className="level-left">
                  <div className="level-item">
                    <div className="title has-text-primary">
                      <FontAwesomeIcon icon={icon} />
                      {' '}
                      {name}
                    </div>
                  </div>
                </div>
              </div>
              {children}
            </main>
          </div>
        </div>
        <Navbar />
      </div>
    );
  }
}

export default withRouter(GuestLayout);
