const express = require('express');
const ytdl = require('ytdl-core');
const fs = require('fs');
const path = require('path');
const sanitize = require('sanitize-filename');
const { createServer } = require('http');
const { Server } = require("socket.io");

const app = express();
const port = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

const downloadFolder = 'public/downloads';

const server = createServer(app);

// Initialize Socket.io
const io = new Server(server);

// Create a list of socket connections
const connections = [];

const slug = str =>
  str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');

io.on('connection', function (socket) {
  socket.on('download-video', async function (url) {
    console.log('Starting download:', url);

    try {
      const info = await ytdl.getInfo(url);
      const title = sanitize(info.videoDetails.title);
      const thumbnail = info.videoDetails.thumbnails[info.videoDetails.thumbnails.length - 1].url;
      const sanitizedTitle = slug(info.videoDetails.title);
      const filename = `${downloadFolder}/${sanitizedTitle}-${info.videoDetails.videoId}.mp4`;

      const FinishedName = `${sanitizedTitle}-${info.videoDetails.videoId}.mp4`;
      if (!fs.existsSync(downloadFolder)) {
        fs.mkdirSync(downloadFolder);
      }

      const video = ytdl(url, { filter: 'audioandvideo', quality: 'highest' });
      video.pipe(fs.createWriteStream(filename));

      let totalSize = 0;
      let downloadedSize = 0;
      video.on('info', (info) => {
        totalSize = info.size;
      });
      video.on('data', (chunk) => {
        downloadedSize += chunk.length;
        const progress = Math.round(downloadedSize / totalSize * 100);
        socket.emit('download-progress', { progress });
      });
      video.on('end', () => {
        console.log('Download complete:', url);
        socket.emit('download-complete', { filename, thumbnail, title, FinishedName });

        // Delete the file after 5 minutes
        const deleteTime = 5 * 60 * 1000; // 5 minutes in milliseconds
        setTimeout(() => {
          fs.unlink(filename, (err) => {
            if (err) {
              if (err.syscall === 'unlink') {
                console.log('Could not find file to delete:', filename);
                return;
              }
              else {
                console.error(`Error deleting file ${filename}:`, err);
              }
            } else {
              console.log(`File auto-deleted: ${filename}`);
            }
          });
        }, deleteTime);
      });
    } catch (err) {
      socket.emit('download-error', { error: err.message });
      console.log('Error getting video info:', err);
      return;
    }
  });
});


// Route for rendering the home page
app.get('/', (req, res) => {
  res.render('index', { error: null, title: null, thumbnail: null, filename: null, FinishedName: null });
});

// Route for rendering the home page
app.get('/about', (req, res) => {
  res.render('about', { error: null, title: null, thumbnail: null, filename: null, FinishedName: null });
});

// Route for rendering the home page
app.get('/tiktok', (req, res) => {
  res.render('tiktok', { error: null, title: null, thumbnail: null, filename: null, FinishedName: null });
});


// Route for serving the downloaded video
app.get('/download', (req, res) => {
  const url = req.query.url;
  if (!url) {
    res.status(400).send('Missing "url" parameter');
    return;
  }

  const filename = decodeURIComponent(url);
  const filePath = path.join(__dirname, downloadFolder, filename);

  fs.access(filePath, (err) => {
    if (err) {
      console.log(`Error accessing file: ${filename}`, err);
      res.status(404).send(`File "${filename}" not found`);
      return;
    }

    res.download(filePath, filename, (err) => {
      if (err) {
        console.log(`Error downloading file: ${filename}`, err);
        res.status(500).send(`Error downloading file "${filename}"`);
        return;
      }

      console.log(`File downloaded: ${filename}`);
      fs.unlink(filePath, (err) => {
        if (err) {
          console.log(`Error deleting file: ${filename}`, err);
          return;
        }
        console.log(`File deleted: ${filename}`);
      });
    });
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.render('index', { error: err.message });
});

server.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
