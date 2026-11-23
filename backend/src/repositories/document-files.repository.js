const fs = require('node:fs');
const path = require('node:path');

const storageDirectory = path.resolve(__dirname, '../../storage');

fs.mkdirSync(storageDirectory, { recursive: true });

function getStorageDirectory() {
  return storageDirectory;
}

function findFile(storedName) {
  const storagePath = path.join(storageDirectory, storedName);
  if (!fs.existsSync(storagePath) || !fs.statSync(storagePath).isFile()) {
    return null;
  }

  return storagePath;
}

module.exports = {
  getStorageDirectory,
  findFile,
};
