const core = require('@actions/core');
const fs = require('fs');
const axios = require('axios');
const { exec } = require('child_process');

async function fetchAndDumpScanData() {
    try {
        // Get inputs from the GitHub Action
        console.log('Fetching inputs...');
        const repoUrl = core.getInput('repo_url');
        const token = core.getInput('token');
        console.log(`Repository URL: ${repoUrl}`);
        console.log("Token:" );
        // Extract owner and repo from the repo URL
        const match = repoUrl.match(/github\.com\/(.+?)\/(.+?)(\.git|$)/);
        if (!match) {
            throw new Error('Invalid repository URL');
        }
        const owner = match[1];
        const repo = match[2];

        // Construct the API URL
        const apiUrl = `https://api.github.com/repos/${owner}/${repo}/code-scanning/alerts`;
        console.log(`API URL: ${apiUrl}`);

        // Make the API call
        const response = await axios.get(apiUrl, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/vnd.github+json'
            }
        });

        // Write the response data to a text file
        const fileName = 'scan_data.txt';
        fs.writeFileSync(fileName, JSON.stringify(response.data, null, 2));

        console.log(`${fileName} has been created.`);

        // Upload the file as an artifact
        exec(`zip artifact.zip ${fileName} && echo "artifact.zip"`, (error, stdout, stderr) => {
            if (error) {
                core.setFailed(`Error creating artifact: ${error.message}`);
                return;
            }
            console.log('Artifact created successfully:', stdout);
        });
    } catch (error) {
        core.setFailed(`Error fetching scan data: ${error.message}`);
    }
}

fetchAndDumpScanData();