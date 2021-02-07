import express from 'express';

import jwt from 'jsonwebtoken';
import CookieParser from 'cookie-parser';
import bodyParser from 'body-parser';

// Initialize the app
const app = express();

const anonymousPaths: string[] = [
  '/manifest.json',
  '/login',
  '/auth',
];

app.post('/api/auth', bodyParser.json(), (req, res) => {
  if (!req.body.password || req.body.password !== process.env.SERVER_AUTH_PASSWORD) {
    res.status(401).json({
      error: 'Bad credentials',
    });

    res.send();
    return;
  }

  const newJwt = jwt.sign({}, process.env.SERVER_JWT_SECRET!, { algorithm: 'HS256' });

  res.json({ jwt: newJwt });
});

app.post('/auth', bodyParser.urlencoded({ extended: false }), (req, res) => {
  if (!req.body.password || req.body.password !== process.env.SERVER_AUTH_PASSWORD) {
    res.status(401).json({
      error: 'Bad credentials',
    });

    res.send();
  }

  const newJwt = jwt.sign({}, process.env.SERVER_JWT_SECRET!, { algorithm: 'HS256' });

  res.cookie('dashboard', newJwt);
  res.redirect('/dashboard');
});

app.get('/login', (req, res) => {
  res.send('<form method="post" action="/auth"><label for="password">Login</label><input name="password" type="password" /><button type="submit">Submit</button></form>');
});

app.use(CookieParser(), (req, res, next) => {
  try {
    const token = req.cookies.dashboard;
    if (!token) {
      throw new Error();
    }
    const decodedToken = jwt.verify(token, process.env.SERVER_JWT_SECRET!, {
      algorithms: ['HS256'],
    });

    next();
  } catch (e) {
    if (anonymousPaths.includes(req.path)) {
      next();
    } else if (!req.path.startsWith('/api')) {
      res.redirect('/login');
    } else {
      res.status(401).json({
        error: 'Authentication required',
      });
    }
  }
});

export default app;
