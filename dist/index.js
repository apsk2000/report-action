/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 746:
/***/ ((module) => {

module.exports = eval("require")("@actions/core");


/***/ }),

/***/ 473:
/***/ ((module) => {

module.exports = eval("require")("axios");


/***/ }),

/***/ 317:
/***/ ((module) => {

"use strict";
module.exports = require("child_process");

/***/ }),

/***/ 896:
/***/ ((module) => {

"use strict";
module.exports = require("fs");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __nccwpck_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			__webpack_modules__[moduleId](module, module.exports, __nccwpck_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	if (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = __dirname + "/";
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
const core = __nccwpck_require__(746);
const fs = __nccwpck_require__(896);
const axios = __nccwpck_require__(473);
const { exec } = __nccwpck_require__(317);

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
module.exports = __webpack_exports__;
/******/ })()
;