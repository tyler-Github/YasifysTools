// Packages
const express = require('express');
const ytdl = require('ytdl-core');
const fs = require('fs');
const path = require('path');
const sanitize = require('sanitize-filename');
const { createServer } = require('http');
const { Server } = require("socket.io");
const { release } = require('os');
const semver = require('semver');
const fetch = require("node-fetch");

// Load environment variables
require('dotenv').config();

// Create Express app
const app = express();

// Set global variables
const app_url = process.env.APP_URL || 'http://localhost';
const app_port = process.env.APP_PORT || 3000;
const app_verbose = process.env.APP_VERBOSE;
const currentVersion = process.env.npm_package_version;

// Set up the Matomo and Google Analytics variables
const { MATOMO_URL, MATOMO_SITE_ID, GA_TRACKING_ID } = process.env;

// Set up the Matomo variables, if they are set
if (MATOMO_URL && MATOMO_SITE_ID) {
  var MATOMO = {
    url: MATOMO_URL,
    siteId: MATOMO_SITE_ID
  };
}
else {
  var MATOMO = null;
}

// Set up the view engine
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Set up the download folder
const downloadFolder = 'public/downloads';

// Create server
const server = createServer(app);

// Initialize Socket.io
const io = new Server(server);

// Create a list of socket connections
const connections = [];

// Routers
var indexRouter = require("./routes/index");

/**
 * Sanitize a string to be used as a filename
 * @param {string} str The string to sanitize
 * @returns {string} The sanitized string
 */
const slug = (str) => str.replace(/[^a-zA-Z0-9\s-]/g, '');

/**
 * Verbose Console Log
 * @param message - The message to log
 */
const vLog = (message) => {
  // Check if verbose logging is enabled
  if (app_verbose == true || app_verbose == 'true') {
    // Append a [V] to the beginning of the message to indicate verbose logging
    message = `[VERBOSE] ${message}`;

    // Log the message
    console.log(message);
  }
}

// Socket.io events
io.on('connection', function (socket) {
  socket.on('download-video', async function (url) {
    console.log('Starting download:', url);

    try {
      // Get the video info
      const info = await ytdl.getInfo(url);

      // Get the video title and sanitize it
      const title = sanitize(info.videoDetails.title);
      const thumbnail = info.videoDetails.thumbnails[info.videoDetails.thumbnails.length - 1].url;

      // Create the filename and sanitized title
      const sanitizedTitle = slug(info.videoDetails.title);
      const filename = `${downloadFolder}/${sanitizedTitle}-${info.videoDetails.videoId}.mp4`;
      const FinishedName = `${sanitizedTitle}-${info.videoDetails.videoId}.mp4`;

      // Create the download folder if it doesn't exist
      if (!fs.existsSync(downloadFolder)) {
        fs.mkdirSync(downloadFolder);
      }

      // Check if the file already exists
      if (fs.existsSync(filename)) {
        // Emit the download complete event
        console.log('File already exists:', filename);
        socket.emit('download-complete', { filename, thumbnail, title, FinishedName });
        return;
      }

      // Download the video
      const video = ytdl(url, { filter: 'audioandvideo', quality: 'highest' });
      video.pipe(fs.createWriteStream(filename));

      let totalSize = 0;
      let downloadedSize = 0;
      video.on('info', (info) => {
        totalSize = info.formats[0].contentLength;
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
        const deleteTime = 20 * 60 * 1000; // 20 minutes in milliseconds
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
              // File deleted
              console.log(`File auto-deleted: ${filename}`);

              // Notify the client that the file was deleted
              socket.emit('download-auto-deleted', { filename });
            }
          });
        }, deleteTime);
      });
    } catch (err) {
      // Remove any elements that could be used for XSS
      err.message = err.message.replace(/<|>/g, '');

      // Emit the download error event
      socket.emit('download-error', { error: err.message });
      console.error('Error:', err.message);
      return;
    }
  });
});

// Routes
app.use("/", indexRouter);

// 404 middleware
app.use((req, res, next) => {
  res.status(404).render('404', { matomo: MATOMO, gaTrackingId: GA_TRACKING_ID });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.render('index', { error: err.message, version: currentVersion, matomo: MATOMO, gaTrackingId: GA_TRACKING_ID });
});

/**
 * Get releases from GitHub

 * @returns {Promise} A promise that resolves to the releases
 */
async function getReleases() {
  // Get the releases from GitHub
  const response = await fetch('https://api.github.com/repos/tyler-Github/YasifysTools/releases');

  // Parse the response as JSON
  const data = await response.json();

  // Return the releases
  return data;
}

// Start the server on the specified port
server.listen(app_port, async () => {
  // Log the server URL and port
  console.log(`Server started: ${app_url}:${app_port}`);

  console.log('Checking for updates...');
  try {
    // Get the releases from GitHub
    vLog('Getting releases from GitHub...');
    const releases = await getReleases();

    // Get the latest version
    const latestVersion = releases[0].tag_name.slice(1);

    // Log the current and latest versions
    vLog(`Current version: ${currentVersion}`);
    vLog(`Latest version: ${latestVersion}`);

    // Check if the current version is less than the latest version
    if (semver.gt(latestVersion, currentVersion)) {
      console.log(`Update available: ${currentVersion} -> ${latestVersion}`);
    } else {
      console.log('Yasifys Tools is up to date');
    }
  } catch (err) {
    // Return if there is an error
    console.error('Error:', err);
  }
});
