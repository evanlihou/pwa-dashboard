// Import express
import express from 'express';

import nodeFetch from 'node-fetch';

// Initialize the app
const app = express();

app.get('/api/news', async (_req, res) => {
  const newsResp = await nodeFetch('https://rsshub.app/apnews/topics/apf-topnews');
  const newsText = await newsResp.text();
  res.set('Content-Type', 'text/xml');

  res.send(newsText);
});

export default app;
