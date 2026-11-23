const crypto = require('node:crypto');
const repository = require('../repositories/documents.repository');
const files = require('../repositories/document-files.repository');

function toPublicMetadata(document) {
  return {
    id: document.id,
    originalName: document.originalName,
    size: document.size,
    uploadedAt: document.uploadedAt,
    owner: document.owner,
  };
}

function upload(file, owner = 'local-user') {
  if (!file) {
    return null;
  }

  const document = repository.create({
    id: crypto.randomUUID(),
    originalName: file.originalname,
    storedName: file.filename,
    size: file.size,
    uploadedAt: new Date().toISOString(),
    owner,
  });

  return toPublicMetadata(document);
}

function list() {
  return repository.list().map(toPublicMetadata);
}

function findForDownload(id) {
  const document = repository.findById(id);

  if (!document) {
    return null;
  }

  const storagePath = files.findFile(document.storedName);
  if (!storagePath) {
    return null;
  }

  return { document, storagePath };
}

module.exports = {
  upload,
  list,
  findForDownload,
};
