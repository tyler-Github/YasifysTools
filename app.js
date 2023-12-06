// Packages
const express = require("express");
const ytdl = require("@distube/ytdl-core");
const fs = require("fs");
const sanitize = require("sanitize-filename");
const { createServer } = require("http");
const { Server } = require("socket.io");
const semver = require("semver");
const fetch = require("node-fetch");
const mongoose = require("mongoose");
const helmet = require("helmet");
const { slug, vLog, getVersion } = require("./helpers/helpers");
const rateLimit = require("express-rate-limit");

// Load environment variables
require("dotenv").config();

// Create Express app
const app = express();

// Configure rate limiter
const apiLimiter = rateLimit({
  windowMs: 2 * 60 * 1000,
  max: 60,
});

// Apply rate limiting to all requests
app.use(apiLimiter);

// Disable X-Powered-By header
app.use(helmet.hidePoweredBy());

// Set global variables
const app_url = process.env.APP_URL || "http://localhost";
const app_port = process.env.APP_PORT || 3000;
const currentVersion = getVersion();
var MATOMO = null;

// Set up the Matomo and Google Analytics variables
const { MATOMO_URL, MATOMO_SITE_ID, GA_TRACKING_ID } = process.env;

// Set up the Matomo variables, if they are set
if (MATOMO_URL && MATOMO_SITE_ID) {
  MATOMO = {
    URL: MATOMO_URL,
    SITE_ID: MATOMO_SITE_ID,
  };
} else {
  MATOMO = null;
}

// Connect to MongoDB
mongoose
  .connect(
    `mongodb://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: process.env.DB_DATABASE || "YasifysTools",
    }
  )
  .then(() => {
    vLog(
      `Connected to MongoDB Database: ${
        process.env.DB_DATABASE || "YasifysTools"
      }`
    );
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

// app.set("trust proxy", true);
app.set("trust proxy", "127.0.0.1"); // specify a single subnet
// Set up the view engine
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// Set up the download folder
const downloadFolder = "public/downloads";

// Create server
const server = createServer(app);

// Initialize Socket.io
const io = new Server(server);

// Routers
var indexRouter = require("./routes/index");

// Socket.io events
io.on("connection", function (socket) {
  socket.on("download-video", async function (url, quality) {
    console.log("Starting download:", url);

    try {
      // Get the video info
      const info = await ytdl.getInfo(url);

      // Get the video title and sanitize it
      const title = sanitize(info.videoDetails.title);
      const thumbnail =
        info.videoDetails.thumbnails[info.videoDetails.thumbnails.length - 1]
          .url;

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
        // This is a temporary fix, we will keep everyone updated on if this fixes the current downloading issues.
        // Emit the download complete event
        console.warn(
          `File already exists: ${filename}, but we are going to download it anyways.`
        );
        //socket.emit('download-complete', { filename, thumbnail, title, FinishedName });
        // return;
      }

      // Download the video
      const video = ytdl(url, { filter: "audioandvideo", quality: quality });
      console.log(quality);
      video.pipe(fs.createWriteStream(filename));

      // Max percentage downloaded
      let maxPercentage = 0;

      // Emit the download progress event
      video.on("progress", (chunkLength, downloaded, total) => {
        // Calculate the percentage downloaded
        const progress = Math.round((downloaded / total) * 100);

        // Check if the percentage downloaded is greater than the max percentage
        maxPercentage = Math.max(maxPercentage, progress);

        // Emit the download progress event
        socket.emit("download-progress", { progress });
      });

      // Emit the download complete event
      video.on("end", () => {
        console.log("Download complete:", url);
        socket.emit("download-complete", {
          filename,
          thumbnail,
          title,
          FinishedName,
        });

        // Delete the file after 5 minutes
        const deleteTime = 20 * 60 * 1000; // 20 minutes in milliseconds
        setTimeout(() => {
          fs.unlink(filename, (err) => {
            if (err) {
              if (err.syscall === "unlink") {
                console.log("Could not find file to delete:", filename);
                return;
              } else {
                console.error(`Error deleting file ${filename}:`, err);
              }
            } else {
              // File deleted
              console.log(`File auto-deleted: ${filename}`);

              // Notify the client that the file was deleted
              socket.emit("download-auto-deleted", { filename });
            }
          });
        }, deleteTime);
      });
    } catch (err) {
      // Remove any elements that could be used for XSS
      err.message = err.message.replace(/<|>/g, "");

      // Emit the download error event
      socket.emit("download-error", { error: err.message });
      console.error("Error:", err.message);
      return;
    }
  });
});

// Routes
app.use("/", indexRouter);

// 404 middleware
app.use((req, res) => {
  res
    .status(404)
    .render("404", { matomo: MATOMO, gaTrackingId: GA_TRACKING_ID });
});

// Error handling middleware
app.use((err, req, res) => {
  console.error(err.stack);
  res.render("index", {
    error: err.message,
    version: currentVersion,
    matomo: MATOMO,
    gaTrackingId: GA_TRACKING_ID,
  });
});

/**
 * Get releases from GitHub

 * @returns {Promise} A promise that resolves to the releases
 */
async function getReleases() {
  // Get the releases from GitHub
  const response = await fetch(
    "https://api.github.com/repos/tyler-Github/YasifysTools/releases"
  );

  // Parse the response as JSON
  const data = await response.json();

  // Return the releases
  return data;
}

// Start the server on the specified port
server.listen(app_port, async () => {
  // Log the server URL and port
  console.log(`Server started: ${app_url}:${app_port}`);

  console.log("Checking for updates...");
  try {
    // Get the releases from GitHub
    vLog("Getting releases from GitHub...");
    const releases = await getReleases();

    // Get the latest version
    const latestVersion = releases[0].tag_name.slice(1);

    // Log the current and latest versions
    vLog(`Current version: ${currentVersion}`);
    vLog(`Latest version: ${latestVersion}`);

    if (semver.valid(currentVersion)) {
      // Only do that if the current version is not a pre-release such as a git commit hash
      if (semver.prerelease(currentVersion) === null) {
        // Check if the current version is less than the latest version
        if (semver.gt(latestVersion, currentVersion)) {
          console.log(
            `Update available: ${currentVersion} -> ${latestVersion}`
          );
        } else {
          console.log("Yasifys Tools is up to date");
        }
      } else {
        console.log(
          `Current pre-release: ${currentVersion}, not checking for updates`
        );
      }
    } else {
      console.log(
        `Current pre-release: ${currentVersion}, not checking for updates`
      );
    }
  } catch (err) {
    // Return if there is an error
    console.error("Error:", err);
  }
});
