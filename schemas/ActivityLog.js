const mongoose = require("mongoose");

/**
 * Activity Log Schema
 *
 * @param {String} action - Represents the action performed (e.g., "download" or "delete").
 * @param {String} videoId - Optionally stores the video identifier associated with the action.
 * @param {String} ipAddress - Stores the IP address of the user, with the last two octets obfuscated as "xx".
 * @param {Date} timestamp - Timestamp of when the action was performed.
 */
const activityLogSchema = new mongoose.Schema({
  // Represents the action performed (e.g., "download" or "delete").
  action: {
    type: String,
    required: true,
  },
  // Optionally stores the video identifier associated with the action.
  videoId: {
    type: String,
  },
  // Stores the IP address of the user, with the last two octets obfuscated as "xx".
  ipAddress: {
    type: String,
    required: true,
    set: obfuscateIPAddress,
  },
  // Timestamp of when the action was performed.
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

/**
 * Obfuscate the IP address by replacing the last octet with "xx".
 * @param ipAddress - IP address
 * @returns {string} - Obfuscated IP address
 */
function obfuscateIPAddress(ipAddress) {
  if (ipAddress) {
    const [octet1, octet2, octet3] = ipAddress.split(".");
    return `${octet1}.${octet2}.${octet3}.xx`;
  }
  return ipAddress;
}

const ActivityLog = mongoose.model("ActivityLog", activityLogSchema);

module.exports = { ActivityLog, obfuscateIPAddress };
