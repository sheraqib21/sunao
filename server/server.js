const express = require('express');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const cors = require('cors');
const youtubedl = require('youtube-dl-exec');
const axios = require('axios');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use('/downloads', express.static(path.join(__dirname, 'downloads')));

// Ensure downloads directory exists
const downloadsDir = path.join(__dirname, 'downloads');
if (!fs.existsSync(downloadsDir)) {
    fs.mkdirSync(downloadsDir);
}

// Endpoint to add a new song
app.post('/add-song', async (req, res) => {
    const newSong = req.body;

    // Check if the URL is a YouTube link
    if (newSong.url.includes('youtube.com') || newSong.url.includes('youtu.be')) {
        try {
            const videoId = newSong.url.split('v=')[1] || newSong.url.split('youtu.be/')[1];
            const videoInfo = await getYouTubeInfo(videoId);
            const mp3Path = await downloadYouTubeAsMP3(newSong.url, videoId);
            const thumbnailPath = await downloadThumbnail(videoInfo.thumbnail_url, videoId);

            // Use the title and artist from the videoInfo
            newSong.title = videoInfo.title; // Set the title
            newSong.artist = videoInfo.author_name; // Set the artist name (channel name)
            newSong.url = `/downloads/${videoId}.mp3`;
            newSong.artwork = `/downloads/${videoId}.jpg`;

            // Respond with success without saving to library.json
            res.status(200).send('Song added successfully');
        } catch (error) {
            console.error('Error processing YouTube link:', error);
            return res.status(500).send('Error processing YouTube link');
        }
    } else {
        return res.status(400).send('Invalid YouTube URL');
    }
});

// Function to get YouTube video information
async function getYouTubeInfo(videoId) {
    const response = await axios.get(`https://www.youtube.com/oembed?url=http://www.youtube.com/watch?v=${videoId}&format=json`);
    return response.data;
}

// Function to download YouTube video as MP3
function downloadYouTubeAsMP3(url, videoId) {
    return new Promise((resolve, reject) => {
        const mp3Path = path.join(__dirname, 'downloads', `${videoId}.mp3`);
        console.log(`MP3 Path: ${mp3Path}`);
        youtubedl(url, {
            extractAudio: true,
            audioFormat: 'mp3',
            output: mp3Path
        }).then(() => resolve(mp3Path)).catch(reject);
    });
}

// Function to download the thumbnail
async function downloadThumbnail(thumbnailUrl, videoId) {
    const response = await axios.get(thumbnailUrl, { responseType: 'arraybuffer' });
    const thumbnailPath = path.join(__dirname, 'downloads', `${videoId}.jpg`);
    fs.writeFileSync(thumbnailPath, response.data);
    return thumbnailPath;
}

// Endpoint to get the list of files in the downloads folder
app.get('/list', (req, res) => {
    const downloadsDir = path.join(__dirname, 'downloads');

    // Read the directory to get the list of files
    fs.readdir(downloadsDir, (err, files) => {
        if (err) {
            return res.status(500).json({ error: 'Unable to read directory' });
        }

        // Filter to only include audio files (e.g., .m4a, .mp3, .webm)
        const audioFiles = files.filter((file) => file.endsWith('.m4a') || file.endsWith('.mp3') || file.endsWith('.webm'));

        // Return the list of files as JSON
        res.json(audioFiles);
    });
});

// Test the server's root URL
app.get('/', (req, res) => {
    res.send('File server is running');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
