/* ## Setting up Logging Requests ## */
const path = require("path");
const fs = require("fs-extra");
const rfs = require("rotating-file-stream");

// Logging to a file if requested
var logStream;
if (process.env.REQUEST_LOG_FILE) {
  (async () => {
    let logDirectory = path.dirname(process.env.REQUEST_LOG_FILE);
    await fs.ensureDir(logDirectory);
    logStream = rfs(process.env.REQUEST_LOG_FILE, {
      size: "10M", // rotate every 10MB of log written
      interval: "1d", // rotate daily
      compress: "gzip" // compress rotated files
    });
  })().catch(err => console.log(err));
}

module.exports.logStream = logStream;
