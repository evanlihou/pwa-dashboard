// Import express
import express from 'express';
import bodyParser from 'body-parser';
import fileUpload from 'express-fileupload';
import AdmZip from 'adm-zip';
import path from 'path';
import fs from 'fs';

// eslint-disable-next-line no-console
const localLog = (msg: any) => console.log(msg);

// Initialize the app
const app = express();

// enable files upload
app.use(fileUpload({
  createParentPath: true,
  useTempFiles: true,
}));

app.use(bodyParser.urlencoded({ extended: true }));

function restartServer() {
  if (process.send === undefined) {
    // eslint-disable-next-line no-console
    console.warn("Not a child process, can't restart self.");
    return;
  }

  process.send('restartMe');
}

// Send timestamp
app.post('/api/update', bodyParser.json(), async (req, res) => {
  if (process.send === undefined) {
    res.status(400).json({
      error: "Not running as a subprocess. Are you sure you're trying to update prod?",
    });
    return;
  }

  localLog('Starting update...');
  try {
    if (!req.files) {
      res.status(400).json({
        error: 'No file uploaded',
      });
      return;
    }
    // Use the name of the input field (i.e. "avatar") to retrieve the uploaded file
    const { updateZip } = req.files;

    if (Array.isArray(updateZip)) {
      res.status(400).json({
        error: 'Only one file allowed',
      });
      return;
    }

    if (updateZip.mimetype !== 'application/zip') {
      res.status(400).json({
        error: 'Not a zip file',
      });
      return;
    }

    if (updateZip.md5 !== req.body.md5) {
      res.status(400).json({
        error: "MD5 sums don't match",
      });
      return;
    }

    await fs.promises.rename(path.join(__dirname, './'), path.join(__dirname, '../oldDist/'));

    const extractPath = path.join(__dirname, '../newDist/');

    localLog(`Unzipping to ${extractPath}...`);
    const zip = new AdmZip(updateZip.tempFilePath);

    zip.extractAllTo(extractPath);

    localLog('Finished unzipping');

    await fs.promises.rename(extractPath, path.join(__dirname, './'));
    await fs.promises.rmdir(path.join(__dirname, '../oldDist/'), { recursive: true });

    // We need to send our response early because restarting the server will close the
    // HTTP connection
    res.status(200).send();

    restartServer();
  } catch (err) {
    res.status(500).send(err);
  }
});

app.post('/api/restartServer', async (_req, res) => {
  restartServer();
  res.status(200).send();
});

export default app;
