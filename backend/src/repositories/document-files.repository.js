const fs = require('node:fs');
const path = require('node:path');

const storageDirectory = path.resolve(__dirname, '../../storage');

fs.mkdirSync(storageDirectory, { recursive: true });

function getStorageDirectory() {
  return storageDirectory;
}

function findFile(storedName) {
  const fileName = path.basename(storedName);
  if (fileName !== storedName || fileName === '.' || fileName === '..') {
    return null;
  }

  const storagePath = path.join(storageDirectory, fileName);
  if (!fs.existsSync(storagePath) || !fs.statSync(storagePath).isFile()) {
    return null;
  }

  return storagePath;
}

module.exports = {
  getStorageDirectory,
  findFile,
};
