import React, { PropsWithChildren } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import Navbar from './Navbar';
import ErrorProvider from './ErrorContext';
import useError from './use-error';

function ErrorNotification() {
  const { error, removeError } = useError();

  const handleSubmit = () => {
    removeError();
  };

  return (
    <div>
      <div>
        {error && error.message && (
          <div
            className="notification is-danger mx-3"
            style={{
              position: 'fixed',
              top: 0,
              right: 0,
              width: '50%',
              minWidth: '400px',
            }}
          >
            <button type="submit" className="delete" onClick={handleSubmit}>Close</button>
            {error.message}
          </div>
        )}
      </div>
    </div>
  );
}

type UserLayoutProps = PropsWithChildren<{
  icon: IconProp,
  name: string,
  bgColor?: string,
  textColor?: string,
  fullHeight?: boolean
}>

class UserLayout extends React.PureComponent<UserLayoutProps, {}> {
  render() {
    // eslint-disable-next-line
    const { children, icon, name, fullHeight, bgColor, textColor } = this.props;
    return (
      <ErrorProvider>
        <div className={`has-navbar-fixed-bottom ${bgColor !== undefined ? `has-background-${bgColor}` : ''} ${textColor !== undefined ? `has-text-${textColor}` : ''}`} style={{ minHeight: (fullHeight === true ? '100vh' : undefined) }}>
          <div className="wrapper container p-md">
            <div className="columns">
              <main className="column main">
                <div className="level">
                  <div className="level-left">
                    <div className="level-item">
                      <div className={`title ${textColor !== undefined ? `has-text-${textColor}` : 'has-text-primary'}`}>
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
        <ErrorNotification />
      </ErrorProvider>
    );
  }
}

export default UserLayout;
// export default withRouter(UserLayout);
