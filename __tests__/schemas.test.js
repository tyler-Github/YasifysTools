const mongoose = require("mongoose");
const Cache = require("../schemas/Cache"); // Assuming the Cache schema is defined in a file named "Cache.js"
const { ActivityLog, obfuscateIPAddress } = require("../schemas/ActivityLog"); // Assuming the ActivityLog schema is defined in a file named "ActivityLog.js"

// Load environment variables
require("dotenv").config();

// Set the test database name
const testDatabaseName = `test-${process.env.DB_DATABASE}`;

// Connect to the test database before running the tests
beforeAll(async () => {
  const mongoURI = `mongodb://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}`;
  await mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: testDatabaseName,
  });
});

// Clear the test database after running the tests
afterAll(async () => {
  //   await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

describe("Cache Schema", () => {
  // Test case 1: Creating a cache entry
  it("should create a cache entry", async () => {
    const cacheData = {
      key: "test-key",
      value: "test-value",
      expiration: new Date(),
    };
    const cacheEntry = new Cache(cacheData);
    const savedCacheEntry = await cacheEntry.save();

    expect(savedCacheEntry._id).toBeDefined();
    expect(savedCacheEntry.key).toBe(cacheData.key);
    expect(savedCacheEntry.value).toBe(cacheData.value);
    expect(savedCacheEntry.expiration).toEqual(cacheData.expiration);
  });

  // Test case 2: Attempting to create a cache entry without a required field
  it("should not create a cache entry without a required field", async () => {
    const invalidCacheData = {
      value: "test-value",
      expiration: new Date(),
    };
    const cacheEntry = new Cache(invalidCacheData);

    let error;
    try {
      await cacheEntry.save();
    } catch (err) {
      error = err;
    }

    expect(error).toBeDefined();
    expect(error.name).toBe("ValidationError");
  });
});

describe("Activity Log Schema", () => {
  // Test case 1: Creating an activity log entry
  it("should create an activity log entry", async () => {
    const activityLogData = {
      action: "download",
      videoId: "video-123",
      ipAddress: "127.0.0.1",
      timestamp: new Date(),
    };
    const activityLogEntry = new ActivityLog(activityLogData);
    const savedActivityLogEntry = await activityLogEntry.save();

    expect(savedActivityLogEntry._id).toBeDefined();
    expect(savedActivityLogEntry.action).toBe(activityLogData.action);
    expect(savedActivityLogEntry.videoId).toBe(activityLogData.videoId);
    expect(savedActivityLogEntry.ipAddress).toBe(
      obfuscateIPAddress(activityLogData.ipAddress)
    );
    expect(savedActivityLogEntry.timestamp).toEqual(activityLogData.timestamp);
  });

  // Test case 2: Attempting to create an activity log entry without a required field
  it("should not create an activity log entry without a required field", async () => {
    const invalidActivityLogData = {
      videoId: "video-123",
      ipAddress: "127.0.0.1",
      timestamp: new Date(),
    };
    const activityLogEntry = new ActivityLog(invalidActivityLogData);

    let error;
    try {
      await activityLogEntry.save();
    } catch (err) {
      error = err;
    }

    expect(error).toBeDefined();
    expect(error.name).toBe("ValidationError");
  });
});
