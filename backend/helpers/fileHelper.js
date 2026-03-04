const fs = require('fs');
const path = require('path');

// Build the full path to a data file
function getFilePath(filename) {
  return path.join(__dirname, '..', 'data', filename);
}

// Read data from a JSON file
function readData(filename) {
  const filePath = getFilePath(filename);

  // If file doesn't exist yet, return empty array
  if (!fs.existsSync(filePath)) {
    return [];
  }

  const fileContent = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(fileContent);
}

// Write data to a JSON file
function writeData(filename, data) {
  const filePath = getFilePath(filename);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

module.exports = { readData, writeData };
