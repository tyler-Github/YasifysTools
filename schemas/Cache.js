const mongoose = require("mongoose");

/**
 * Cache Schema
 *
 * @param {String} key - Cache key
 * @param {String} value - Cache value
 * @param {Date} expiration - Expiration date
 */
const cacheSchema = new mongoose.Schema({
  // Cache key
  key: {
    type: String,
    required: true,
    unique: true,
  },
  // Cache value
  value: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
  // Expiration date
  expiration: {
    type: Date,
    required: true,
  },
});

const Cache = mongoose.model("Cache", cacheSchema);

module.exports = Cache;
