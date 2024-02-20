const fs = require("fs");
const path = require("path");
const { getVersion } = require("../helpers/helpers");

// Load environment variables
require("dotenv").config();

// Set up the Matomo and Google Analytics variables
var MATOMO = null;
const MATOMO_URL = process.env.MATOMO_URL;
const MATOMO_SITE_ID = process.env.MATOMO_SITE_ID;
const GA_TRACKING_ID = process.env.GA_TRACKING_ID;

// Set up the Matomo variables, if they are set
if (MATOMO_URL && MATOMO_SITE_ID) {
  MATOMO = {
    URL: MATOMO_URL,
    SITE_ID: MATOMO_SITE_ID,
  };
} else {
  MATOMO = null;
}

// Handler function for rendering the home page
exports.renderHomePage = (req, res) => {
  res.render("index", {
    error: null,
    title: null,
    thumbnail: null,
    filename: null,
    FinishedName: null,
    version: getVersion(),
    matomo: MATOMO,
    gaTrackingId: GA_TRACKING_ID,
  });
};

// Handler function for rendering the settings page
exports.renderSettingsPage = (req, res) => {
  res.render("settings", {
    error: null,
    title: null,
    thumbnail: null,
    filename: null,
    FinishedName: null,
    version: getVersion(),
    matomo: MATOMO,
    gaTrackingId: GA_TRACKING_ID,
  });
};

// Handler function for rendering the about page
exports.renderAboutPage = (req, res) => {
  res.render("about", {
    version: getVersion(),
    matomo: MATOMO,
    gaTrackingId: GA_TRACKING_ID,
  });
};

// Handler function for rendering the tiktok page
exports.renderTikTokPage = (req, res) => {
  res.render("tiktok", {
    error: null,
    title: null,
    thumbnail: null,
    filename: null,
    FinishedName: null,
    version: getVersion(),
    matomo: MATOMO,
    gaTrackingId: GA_TRACKING_ID,
  });
};

// Handler function for serving the downloaded video
exports.downloadVideo = (req, res) => {
  const url = req.query.url;
  if (!url) {
    res.status(400).send('Missing "url" parameter');
    return;
  }

  // Ensure the filename is a relative path (no leading slash) and contains no directory traversal
  if (url.startsWith("/") || url.startsWith("..") || url.includes("..")) {
    res.status(400).send('Invalid "url" parameter');
    return;
  }

  const filename = decodeURIComponent(url);
  const filePath = path.join(__dirname, "..", "public", "downloads", filename);
  fs.access(filePath, (err) => {
    if (err) {
      console.log(`Error: Could not find video "${filename}"`);
      res.status(404).send(`Video "${filename}" not found`);
      return;
    }

    res.download(filePath, filename, (err) => {
      if (err) {
        console.log(`Error: Could not download video "${filename}"`);
        res.status(500).send(`Error downloading video "${filename}"`);
        return;
      }

      console.log(`Video downloaded: ${filename}`);
      fs.unlink(filePath, (err) => {
        if (err) {
          console.log(
            `Error: Could not delete video "${filename}" after download`
          );
          return;
        }
        console.log(`Video deleted: ${filename}`);
      });
    });
  });
};

// Handler function for rendering the player page
exports.renderEmbedPage = (req, res) => {
  const { url, title } = req.query;

  // If the URL or title is missing, redirect to the home page
  if (!url || !title) {
    res.redirect("/");
    return;
  }

  // Make sure the URL is a relative path (no leading slash) and contains no directory traversal
  if (url.startsWith("/") || url.startsWith("..") || url.includes("..")) {
    res.status(400).send("Invalid URL");
    return;
  }

  // Set the file path
  const filePath = path.join("/downloads", url);

  // Render the player page
  res.render("embed", {
    url: filePath,
    title,
    version: getVersion(),
    matomo: MATOMO,
    gaTrackingId: GA_TRACKING_ID,
  });
};

// Handler function for rendering the player page
exports.renderPlayerPage = (req, res) => {
  const { url, title } = req.query;

  // If the URL or title is missing, redirect to the home page
  if (!url || !title) {
    res.redirect("/");
    return;
  }

  // Make sure the URL is a relative path (no leading slash) and contains no directory traversal
  if (url.startsWith("/") || url.startsWith("..") || url.includes("..")) {
    res.status(400).send("Invalid URL");
    return;
  }

  // Set the file path
  const filePath = path.join("/downloads", url);

  // Render the player page
  res.render("player", {
    url: filePath,
    title,
    version: getVersion(),
    matomo: MATOMO,
    gaTrackingId: GA_TRACKING_ID,
  });
};
