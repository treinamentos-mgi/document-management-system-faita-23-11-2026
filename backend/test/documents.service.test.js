const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const service = require('../src/services/documents.service');
const repository = require('../src/repositories/documents.repository');
const files = require('../src/repositories/document-files.repository');

test('upload e listagem retornam metadados públicos, e download localiza o arquivo', (t) => {
  const directory = fs.mkdtempSync(path.join(files.getStorageDirectory(), 'test-'));
  t.after(() => fs.rmSync(directory, { recursive: true, force: true }));
  const storedName = `${path.basename(directory)}.txt`;
  const storagePath = path.join(files.getStorageDirectory(), storedName);
  t.after(() => fs.rmSync(storagePath, { force: true }));
  fs.writeFileSync(storagePath, 'conteúdo');

  assert.equal(service.upload(null), null);
  const uploaded = service.upload({
    originalname: 'original.txt',
    filename: storedName,
    size: 9,
  });

  assert.equal(uploaded.originalName, 'original.txt');
  assert.equal(uploaded.size, 9);
  assert.equal(uploaded.owner, 'local-user');
  assert.ok(uploaded.id);
  assert.ok(uploaded.uploadedAt);
  assert.equal('storedName' in uploaded, false);
  assert.deepEqual(service.list().find((document) => document.id === uploaded.id), uploaded);
  assert.deepEqual(service.findForDownload(uploaded.id), {
    document: repository.findById(uploaded.id),
    storagePath,
  });

  fs.unlinkSync(storagePath);
  assert.equal(service.findForDownload(uploaded.id), null);
  assert.equal(service.findForDownload('id-inexistente'), null);
  assert.equal(files.findFile('../document.txt'), null);
  assert.equal(files.findFile('..'), null);
});

test('download rejeita diretórios e preserva erros inesperados do filesystem', (t) => {
  const directory = fs.mkdtempSync(path.join(files.getStorageDirectory(), 'test-'));
  t.after(() => fs.rmSync(directory, { recursive: true, force: true }));
  const uploaded = service.upload({
    originalname: 'diretorio',
    filename: path.basename(directory),
    size: 0,
  }, 'outra-pessoa');

  assert.equal(uploaded.owner, 'outra-pessoa');
  assert.equal(service.findForDownload(uploaded.id), null);

  const error = new Error('erro de leitura');
  t.mock.method(fs, 'statSync', () => { throw error; });
  assert.throws(() => service.findForDownload(uploaded.id), (actual) => actual === error);
});
