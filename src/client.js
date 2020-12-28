// Bulma CSS for light weight CSS. One can any css framework
// import 'bulma/css/bulma.min.css';
import './resources/css/custom-bulma.scss';
import './resources/css/util.scss';
import './resources/css/global.css';

export default class Client {
  // The wake lock sentinel.
  wakeLock = null;

  // Function that attempts to request a screen wake lock.
  keepAwake = async () => {
    try {
      this.wakeLock = await navigator.wakeLock.request('screen');
    } catch (err) {
      if (window.location.hostname === 'localhost') {
        // eslint-disable-next-line no-alert
        alert(`${err.name}, ${err.message}`);
      }
      // eslint-disable-next-line no-console
      console.error('Note that wakelock only works in an HTTP context if on localhost');
    }
  };

  handleVisibilityChange = async () => {
    const functionToRun = async () => {
      if (this.wakeLock !== null && document.visibilityState === 'visible') {
        await this.keepAwake();
      }
    };

    document.addEventListener('visibilitychange', functionToRun);
  };

  handleKeep

  apply(clientHandler) {
    clientHandler.hooks.renderComplete.tap('KeepAwakeVisibilityChange', async () => this.handleVisibilityChange());
    clientHandler.hooks.renderComplete.tap('KeepAwake', async () => this.keepAwake());
  }
}
