const fs = require('node:fs');
const path = require('node:path');

const storageDirectory = path.resolve(__dirname, '../../storage');
const documents = new Map();

fs.mkdirSync(storageDirectory, { recursive: true });

function create(document) {
  documents.set(document.id, document);
  return document;
}

function findById(id) {
  return documents.get(id);
}

function list() {
  return Array.from(documents.values()).sort(
    (left, right) => right.uploadedAt.localeCompare(left.uploadedAt)
  );
}

function getStorageDirectory() {
  return storageDirectory;
}

module.exports = {
  create,
  findById,
  list,
  getStorageDirectory,
};
