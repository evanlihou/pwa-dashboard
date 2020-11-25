import React from 'react';
import ReactPWAIcon from './resources/img/react-pwa.png';

export default class Server {
  // eslint-disable-next-line
  apply(serverHandler) {
    serverHandler.hooks.beforeHtmlRender.tapPromise('AddTheming', async (Application) => {
      const { htmlProps: { head } } = Application;
      head.push(<meta key="meta-theme-color" name="theme-color" content="#209cee" />);
      head.push(<meta key="no-scale" name="viewport" content="user-scalable=no,width=device-width,initial-scale=1" />);
      // head.push(<meta key="no-scale" name="viewport" content="user-scalable=no" />);
    });

    serverHandler.hooks.beforeHtmlRender.tapPromise('AddFavIcon', async (Application) => {
      const { htmlProps: { head } } = Application;
      head.push(<link key="favicon" rel="shortcut icon" type="image/png" href={ReactPWAIcon} />);
      return true;
    });
  }
}
