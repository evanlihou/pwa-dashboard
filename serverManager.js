/**
 * @file
 * Manager for the server in a production environment. This allows support for restarting
 * which is needed for self-updating functionality. Child processes can send a `restartMe` message
 * to be fully restarted.
 */

const { fork } = require('child_process');
const path = require('path');

let process;

// eslint-disable-next-line no-console
const log = msg => console.log('SERVERMAN: ', msg);

const startServer = () => {
  process = fork(path.join(__dirname, './server.js'));
  process.on('message', (msg) => {
    if (msg !== 'restartMe') return;
    log('Restarting server...');
    process.kill('SIGTERM');
    setTimeout(() => { startServer(); }, 500);
  });
};

startServer();
