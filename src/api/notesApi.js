// Filename: `src/api/index.js`
// Import express
import express from 'express';
import fs from 'fs';
import path from 'path';
import sanitizeHtml from 'sanitize-html';
import bodyParser from 'body-parser';

const FILES_DIR = path.join(__dirname, './userNotes/');

// Initialize the app
const app = express();

async function getFiles(dir) {
  const dirents = await fs.promises.readdir(dir, { withFileTypes: true });
  const files = await Promise.all(dirents.map((dirent) => {
    const rslv = path.resolve(dir, dirent.name);
    return dirent.isDirectory() ? getFiles(rslv) : path.relative(FILES_DIR, rslv);
  }));
  return Array.prototype.concat(...files);
}

// Send timestamp
app.get('/api/notes', async (req, res) => {
  try {
    if (!fs.existsSync(FILES_DIR)) {
      fs.mkdirSync(FILES_DIR);
    }

    const files = await getFiles(FILES_DIR);
    // return Array.prototype.concat(...files);
    return res.json({
      files,
    });
  } catch (e) {
    if (e.code === 'ENOENT') {
      return res.json({
        error: 'Unable to create directory',
      });
    }
    console.log(e);
    return res.json({
      error: 'Unhandled error',
    });
  }
});

app.post(/\/api\/notes\/([\w\d/.]+)$/, bodyParser.text(), async (req, res) => {
  console.log(req.body);
  const userProvidedPath = req.params[0];
  if (userProvidedPath === null || userProvidedPath === undefined) {
    return res.json({
      error: 'No path provided',
    });
  }
  // Prevent directory traversal
  const safePath = path.join(FILES_DIR, userProvidedPath);
  if (safePath.indexOf(FILES_DIR) !== 0 && safePath !== FILES_DIR) {
    return res.json({
      error: 'Invalid path',
    });
  }

  if (path.basename(safePath) === '.html' || path.extname(safePath) !== '.html') {
    return res.json({
      error: 'Extension must be ".html"',
    });
  }

  if (req.body === undefined || req.body.length === 0) {
    return res.json({
      error: 'File content required',
    });
  }

  console.log(req.body);

  const safeContent = sanitizeHtml(req.body);

  await fs.promises.mkdir(path.dirname(safePath), { recursive: true });
  await fs.promises.writeFile(safePath, safeContent);
  return res.json();
});

app.delete(/\/api\/notes\/([\w\d/.]+)$/, async (req, res) => {
  const userProvidedPath = req.params[0];
  if (userProvidedPath === null || userProvidedPath === undefined) {
    return res.json({
      error: 'No path provided',
    });
  }
  // Prevent directory traversal
  const safePath = path.join(FILES_DIR, userProvidedPath);
  if (safePath.indexOf(FILES_DIR) !== 0 && safePath !== FILES_DIR) {
    return res.json({
      error: 'Invalid path',
    });
  }

  try {
    if (fs.lstatSync(safePath).isDirectory()) {
      await fs.promises.rmdir(safePath, { recursive: false });
    } else {
      await fs.promises.unlink(safePath);
      // await fsPromises.rm(safePath);
    }
  } catch (e) {
    if (e.code === 'ENOTEMPTY') {
      return res.json({
        error: 'Directory not empty',
      });
    }
    console.error(e);
  }

  return res.json();
});

export default app;
