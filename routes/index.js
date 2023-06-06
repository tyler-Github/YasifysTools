var express = require("express");
var router = express.Router();
const path = require('path');
const fs = require('fs');
const downloadFolder = '../public/downloads';

// Route for rendering the home page
router.get('/', (req, res) => {
    res.render('index', { error: null, title: null, thumbnail: null, filename: null, FinishedName: null, version: process.env.npm_package_version });
});

// Route for rendering the about page
router.get('/about', (req, res) => {
    res.render('about', { error: null, title: null, thumbnail: null, filename: null, FinishedName: null, version: process.env.npm_package_version });
});

// Route for rendering the tiktok page
router.get('/tiktok', (req, res) => {
    res.render('tiktok', { error: null, title: null, thumbnail: null, filename: null, FinishedName: null, version: process.env.npm_package_version });
});

// Route for serving the downloaded video
router.get('/download', (req, res) => {
    const url = req.query.url;
    if (!url) {
        res.status(400).send('Missing "url" parameter');
        return;
    }

    // Ensure the filename is a relative path (no leading slash) and contains no directory traversal
    if (url.startsWith('/') || url.startsWith('..') || url.includes('..')) {
        res.status(400).send('Invalid "url" parameter');
        return;
    }

    const filename = decodeURIComponent(url);
    const filePath = path.join(__dirname, downloadFolder, filename);
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
                    console.log(`Error: Could not delete video "${filename}" after download`);
                    return;
                }
                console.log(`Video deleted: ${filename}`);
            });
        });
    });
});

router.get('/player', (req, res) => {
    const { url, title } = req.query;
    const filePath = path.join('/downloads', url);

    res.render('player', { url: filePath, title, version: process.env.npm_package_version });
});

module.exports = router;