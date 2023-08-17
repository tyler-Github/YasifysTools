// Description: Helper functions for the application
const fs = require("fs");
require("dotenv").config();

// Set global variables
const app_verbose = process.env.APP_VERBOSE;

/**
 * Checks if a filename is valid.
 *
 * @param {string} filename - The filename to check.
 * @returns {boolean} True if the filename is valid, false otherwise.
 */
const isValidFilename = (filename) => {
  return (
    !filename.startsWith("/") &&
    !filename.startsWith("..") &&
    !filename.includes("..")
  );
};

/**
 * Gets the extension of a filename.
 *
 * @param {string} filename - The filename to get the extension of.
 * @returns {string} The extension of the filename.
 */
const getExtension = (filename) => {
  return filename.split(".").pop();
};

/**
 * Checks if a filename is a valid video file.
 *
 * @param {string} filename - The filename to check.
 * @returns {boolean} True if the filename is a valid video file, false otherwise.
 */
const isValidVideo = (filename) => {
  const ext = getExtension(filename);
  const validExts = ["mp4", "mov", "avi", "mkv"];
  return validExts.includes(ext);
};

/**
 * Get a random filename
 *
 * @param {number} length - The length of the filename to generate.
 * @returns {string} The generated filename.
 */
const getRandomFilename = (length = 8) => {
  return Math.random().toString(36).substr(2, length);
};

/**
 * Delete a file safely
 *
 * @param {string} filepath - The path to the file to delete.
 * @returns {Promise} A promise that resolves when the file is deleted.
 */
const deleteFile = (filepath) => {
  return new Promise((resolve, reject) => {
    fs.unlink(filepath, (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
};

/**
 * Move a file
 *
 * @param {string} oldPath - The path to the file to move.
 * @param {string} newPath - The path to move the file to.
 * @returns {Promise} A promise that resolves when the file is moved.
 */
const moveFile = (oldPath, newPath) => {
  return new Promise((resolve, reject) => {
    fs.rename(oldPath, newPath, (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
};

/**
 * Sanitize a string to be used as a filename
 * @param {string} str The string to sanitize
 * @returns {string} The sanitized string
 */
const slug = (str) =>
  str
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s/g, "-");

/**
 * Verbose Console Log
 * @param message - The message to log
 */
const vLog = (message) => {
  // Check if verbose logging is enabled
  if (app_verbose == true || app_verbose == "true") {
    // Append a [V] to the beginning of the message to indicate verbose logging
    message = `[VERBOSE] ${message}`;

    // Log the message
    console.log(message);
  }
};

/**
 * Get the current version of the application
 * @returns {string} The current version of the application
 */
const getVersion = () => {
  var version = "unknown";
  try {
    version = fs.readFileSync("version", "utf8");
    version = version.replace("v", "").trim();
  } catch {
    const { execSync } = require("child_process");
    try {
      version = execSync("git describe --always --tags").toString();
      version = version.replace("v", "").trim();
    } catch {
      return process.env.npm_package_version;
    }
    fs.writeFileSync("version", version);
    return version;
  }

  return version;
};

module.exports = {
  isValidFilename,
  getExtension,
  isValidVideo,
  getRandomFilename,
  deleteFile,
  moveFile,
  slug,
  vLog,
  getVersion,
};
