// Import express
import bodyParser from 'body-parser';
import express from 'express';
import nodeFetch from 'node-fetch';
import formatGetParams from '../libs/format_get_params';

import { ServerConfiguration as config } from '../libs/kimai/get_configuration';

// Initialize the app
const app = express();

app.all(/\/api\/timeProxy\/([\w\d/.?=&]+)$/, bodyParser.json(), async (req, res) => {
  const { method, query } = req;
  const path = req.params[0];

  const url = `${config.base_url}/${path}${formatGetParams(query)}`;

  const timeResp = await nodeFetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      'X-AUTH-USER': config.user,
      'X-AUTH-TOKEN': config.token,
    },
    body: method !== 'GET' && req.body ? JSON.stringify(req.body) : undefined,
  });

  res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');

  res.statusCode = timeResp.status;

  res.send(await timeResp.json());
});

export default app;
