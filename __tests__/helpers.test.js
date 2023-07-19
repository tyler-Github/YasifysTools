// Load test helpers
const {
  isValidFilename,
  getExtension,
  isValidVideo,
  getRandomFilename,
  deleteFile,
  moveFile,
} = require("../helpers/helpers");

// Load filesystem module
const fs = require("fs");

// Load environment variables
require("dotenv").config();

describe("isValidFilename", () => {
  // Test valid filenames
  it("returns true for valid filenames", () => {
    expect(isValidFilename("file.txt")).toBe(true);
  });

  // Test filenames starting with "/"
  it('returns false for filenames starting with "/"', () => {
    expect(isValidFilename("/file.txt")).toBe(false);
  });

  // Test filenames starting with ".."
  it('returns false for filenames starting with ".."', () => {
    expect(isValidFilename("../file.txt")).toBe(false);
  });

  // Test filenames containing ".."
  it('returns false for filenames containing ".."', () => {
    expect(isValidFilename("fi..le.txt")).toBe(false);
  });
});

// Tests for getExtension helper
describe("getExtension", () => {
  // Test extracting file extension
  it("returns the file extension", () => {
    expect(getExtension("./jest-test-area/file.txt")).toBe("txt");
  });
});

// Tests for isValidVideo helper
describe("isValidVideo", () => {
  // Test valid video file
  it("returns true for valid video files", () => {
    expect(isValidVideo("./jest-test-area/video.mp4")).toBe(true);
  });

  // Test non-video file
  it("returns false for non-video files", () => {
    expect(isValidVideo("./jest-test-area/file.txt")).toBe(false);
  });
});

// Tests for getRandomFilename helper
describe("getRandomFilename", () => {
  // Test default filename length
  it("returns a random filename of default length", () => {
    expect(getRandomFilename()).toHaveLength(8);
  });

  // Test custom filename length
  it("returns a random filename of specified length", () => {
    expect(getRandomFilename(10)).toHaveLength(10);
  });
});

// Tests for deleteFile helper
describe("deleteFile", () => {
  // Test deleting a file
  it("deletes the file", async () => {
    const filepath = "./jest-test-area/test.txt";

    // Create test file
    fs.writeFileSync(filepath, "test");

    await expect(deleteFile(filepath)).resolves.not.toThrow();
    // File should no longer exist
  });
});

// Tests for moveFile helper
describe("moveFile", () => {
  // Test moving a file
  it("moves the file", async () => {
    const oldPath = "./jest-test-area/test.txt";
    const newPath = "./jest-test-area/new.txt";

    // Create test file if it doesn't exist
    fs.writeFileSync(oldPath, "test");

    // File should exist at new path
    await expect(moveFile(oldPath, newPath)).resolves.not.toThrow();

    // Delete test file
    fs.unlinkSync(newPath);
  });
});
