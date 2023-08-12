const mongoose = require("mongoose");

/**
 * Download Expiration Schema
 *
 * @param {String} videoId - Stores the video identifier associated with the download.
 * @param {String} source - The source of the download, e.g., "youtube" or "tiktok".
 * @param {String} userHash - Stores the hashed uid + ip + user-agent of the user.
 * @param {Date} expiresAt - Timestamp of when the download expires.
 */
const DownloadExpirationSchema = new mongoose.Schema({
  // Stores the video identifier associated with the download.
  videoId: {
    type: String,
    required: true,
  },
  // The source of the download, e.g., "youtube" or "tiktok".
  source: {
    type: String,
    required: true,
  },
  // Stores the hashed uid + ip + user-agent of the user.
  userHash: {
    type: String,
    required: true,
  },
  // Timestamp of when the download expires.
  expiresAt: {
    type: Date,
    required: true,
  },
  // Timestamp of when the action was performed.
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const DownloadExpiration = mongoose.model(
  "DownloadExpiration",
  DownloadExpirationSchema
);

module.exports = DownloadExpiration;
