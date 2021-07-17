import React from 'react';
import { History, Location } from 'history';
import {
  getAuth,
  createConnection,
  subscribeEntities,
  ERR_HASS_HOST_REQUIRED,
  AuthData,
  Connection,
} from 'home-assistant-js-websocket';
import { faInbox } from '@fortawesome/free-solid-svg-icons';
import UserLayout from '../UserLayout';
import DashboardComponent from '../DashboardComponent';

type DeskStatusProps = {
  history: History,
  location: Location,
}

enum DeskStatusType {
  Unknown,
  NotWorking,
  Available,
  MeetingNoCamera,
  MeetingWithCamera
}

type DeskStatusInfo = {
  text: string,
  bgColor?: string,
  textColor?: string,
}

const deskStatusInfo: {[key in DeskStatusType]: DeskStatusInfo} = {
  [DeskStatusType.Unknown]: {
    text: 'Status Unknown',
    bgColor: 'gray',
    textColor: 'danger',
  },
  [DeskStatusType.NotWorking]: {
    text: 'Not Working',
    bgColor: undefined,
    textColor: 'white',
  },
  [DeskStatusType.Available]: {
    text: 'Available',
    bgColor: 'success-dark',
    textColor: 'white',
  },
  [DeskStatusType.MeetingNoCamera]: {
    text: 'Meeting - Camera Off',
    bgColor: 'yellow',
    textColor: 'black',
  },
  [DeskStatusType.MeetingWithCamera]: {
    text: 'Meeting - Camera On',
    bgColor: 'danger-dark',
    textColor: 'white',
  },
};

type DeskStatusState = {
  status: DeskStatusType,
}

class DeskStatus extends DashboardComponent<DeskStatusProps, DeskStatusState> {
  private supportsLocalStorage: boolean;

  private localStorageKey: string;

  private haConnection?: Connection;

  private entityId: string = 'input_select.evan_desk_state';

  constructor(props: DeskStatusProps) {
    super(props);

    this.state = {
      status: DeskStatusType.Unknown,
    };
    this.supportsLocalStorage = typeof Storage !== 'undefined';

    this.localStorageKey = 'deskStatusAuth';
  }

  async componentDidMount() {
    await this.connect();
  }

  async connect() {
    const { addError } = this.context;
    let auth;
    try {
      // Try to pick up authentication after user logs in
      auth = await getAuth({
        saveTokens: (tokenObj: AuthData | null) => {
          if (this.supportsLocalStorage) {
            localStorage[this.localStorageKey] = JSON.stringify(tokenObj);
          }
        },
        loadTokens: () => new Promise((resolve, reject) => {
          const loadedAuth = localStorage[this.localStorageKey];
          if (loadedAuth !== null && loadedAuth !== undefined) {
            resolve(JSON.parse(loadedAuth));
          }

          return resolve(null);
        }),
      });
      // Remove all the auth info from the URL
      if (this.props.location.search !== '' && this.props.location.search !== null) {
        this.props.history.push(this.props.location.pathname);
      }
    } catch (err) {
      if (err === ERR_HASS_HOST_REQUIRED) {
        const hassUrl = 'https://home';
        // Redirect user to log in on their instance
        auth = await getAuth({
          hassUrl,
        });
        // Remove all the auth info from the URL
        if (this.props.location.search !== '' && this.props.location.search !== null) {
          this.props.history.push(this.props.location.pathname);
        }
      } else {
        addError(`Unknown error: ${err}`);
        console.log(`Unknown error: ${err}`);
        return;
      }
    }
    this.haConnection = await createConnection({ auth });
    subscribeEntities(this.haConnection, (ent) => {
      let statusEnumValue = DeskStatusType.Unknown;
      const statusString = ent[this.entityId].state;

      if (statusString === 'Available') {
        statusEnumValue = DeskStatusType.Available;
      } else if (statusString === 'Not Working') {
        statusEnumValue = DeskStatusType.NotWorking;
      } else if (statusString === 'Meeting - No Camera') {
        statusEnumValue = DeskStatusType.MeetingNoCamera;
      } else if (statusString === 'Meeting - Camera ON') {
        statusEnumValue = DeskStatusType.MeetingWithCamera;
      }

      this.setState({ status: statusEnumValue });
    });
  }

  componentWillUnmount() {
    this.haConnection?.close();
  }

  getStatusBgColor() {
    return deskStatusInfo[this.state.status].bgColor;
  }

  getStatusText() {
    return deskStatusInfo[this.state.status].text;
  }

  getStatusTextColor() {
    return deskStatusInfo[this.state.status].textColor;
  }

  render() {
    return (
      <UserLayout icon={faInbox} name="Status" fullHeight bgColor={this.getStatusBgColor()} textColor={this.getStatusTextColor()}>
        <div className="is-flex is-justify-content-center is-align-content-center">
          <h3 className="is-size-3 mt-6">{this.getStatusText()}</h3>
        </div>
      </UserLayout>
    );
  }
}

export default DeskStatus;
