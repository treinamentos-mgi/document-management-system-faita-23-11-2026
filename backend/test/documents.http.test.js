const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const app = require('../src/app');
const repository = require('../src/repositories/documents.repository');
const files = require('../src/repositories/document-files.repository');

test('fluxo HTTP de upload, listagem e download', async (t) => {
  const server = app.listen(0, '127.0.0.1');
  await new Promise((resolve) => server.once('listening', resolve));
  t.after(() => new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve())));
  const baseUrl = `http://127.0.0.1:${server.address().port}`;

  const emptyUpload = await fetch(`${baseUrl}/upload`, { method: 'POST' });
  assert.equal(emptyUpload.status, 400);
  assert.deepEqual(await emptyUpload.json(), { error: 'Arquivo não enviado' });

  const form = new FormData();
  form.append('file', new Blob(['documento de teste']), 'teste.txt');
  form.append('owner', 'pessoa');
  const response = await fetch(`${baseUrl}/upload`, { method: 'POST', body: form });
  assert.equal(response.status, 201);
  const uploaded = await response.json();
  const stored = repository.findById(uploaded.id);
  const storagePath = path.join(files.getStorageDirectory(), stored.storedName);
  t.after(() => fs.rmSync(storagePath, { force: true }));
  assert.equal(uploaded.originalName, 'teste.txt');
  assert.equal(uploaded.owner, 'pessoa');
  assert.equal('storedName' in uploaded, false);

  const list = await fetch(`${baseUrl}/documents`);
  assert.equal(list.status, 200);
  assert.deepEqual(await list.json(), [uploaded]);

  const download = await fetch(`${baseUrl}/documents/${uploaded.id}/download`);
  assert.equal(download.status, 200);
  assert.match(download.headers.get('content-disposition'), /teste\.txt/);
  assert.equal(await download.text(), 'documento de teste');

  fs.unlinkSync(storagePath);
  assert.equal((await fetch(`${baseUrl}/documents/${uploaded.id}/download`)).status, 404);
  assert.equal((await fetch(`${baseUrl}/documents/inexistente/download`)).status, 404);
});
