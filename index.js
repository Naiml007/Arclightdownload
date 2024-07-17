const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public'))); 

const GITHUB_API_URL = 'https://api.github.com/repos/IzzelAliz/Arclight/releases';
// **Important:**  If you are making many requests, you will likely need a GitHub Personal Access Token
//  for authentication to avoid rate limiting: 
//  const GITHUB_TOKEN = 'your_github_personal_access_token'; 
//  More info: https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token

app.get('/releases', async (req, res) => {
    try {
        const headers =  { 
            'User-Agent': 'Your-App-Name', // Required by GitHub API
            // 'Authorization': `token ${GITHUB_TOKEN}`, // Uncomment if using a token 
        }; 
        const response = await axios.get(GITHUB_API_URL, { headers: headers });
        const releases = response.data;

        const formattedReleases = releases.map(release => ({
            version: release.tag_name,
            date: release.published_at,
            assets: release.assets.map(asset => ({
                name: asset.name,
                url: asset.browser_download_url
            }))
        }));

        res.json(formattedReleases);
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred while fetching data from GitHub API.');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});