const documents = new Map();

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

module.exports = {
  create,
  findById,
  list,
};
