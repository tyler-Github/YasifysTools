const express = require('express');
const router = express.Router();
const handlers = require('../handlers');

// Route for rendering the home page
router.get('/', handlers.renderHomePage);

// Route for rendering the about page
router.get('/about', handlers.renderAboutPage);

// Route for rendering the tiktok page
router.get('/tiktok', handlers.renderTikTokPage);

// Route for serving the downloaded video
router.get('/download', handlers.downloadVideo);

// Route for rendering the player page
router.get('/player', handlers.renderPlayerPage);

module.exports = router;