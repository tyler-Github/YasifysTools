const mongoose = require("mongoose");

/**
 * Download Schema
 *
 * @param {String} url - Download URL
 * @param {String} title - Video title
 * @param {String} thumbnail - Thumbnail URL
 * @param {String} filename - Filename, ie: "video-m5e0Tor2kMg.mp4"
 * @param {String} userHash - User Hash: IP address + User Agent
 * @param {Date} createdAt - Created at
 */
const downloadSchema = new mongoose.Schema({
    // Download URL
    url: {
        type: String,
        required: true,
    },
    // Video title
    title: {
        type: String,
        required: false,
    },
    // Thumbnail URL
    thumbnail: {
        type: String,
        required: false,
    },
    // Filename, ie: "video-m5e0Tor2kMg.mp4"
    filename: {
        type: String,
        required: false,
    },
    // User Hash: IP address + User Agent
    userHash: {
        type: String,
        required: false,
    },
    // Created at
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("Download", downloadSchema);
