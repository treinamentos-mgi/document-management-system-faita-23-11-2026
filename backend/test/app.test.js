const { after, before, test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const app = require('../src/app');

const storageDirectory = path.resolve(__dirname, '../storage');
const initialStorageFiles = new Set(fs.readdirSync(storageDirectory));
const fileContent = 'conteudo do documento';
let server;
let baseUrl;
let uploadedDocument;

before(async () => {
  server = app.listen(0);
  await new Promise((resolve) => server.once('listening', resolve));
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

after(async () => {
  await new Promise((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });

  for (const filename of fs.readdirSync(storageDirectory)) {
    if (!initialStorageFiles.has(filename)) {
      fs.unlinkSync(path.join(storageDirectory, filename));
    }
  }
});

test('o app backend é exportado', () => {
  assert.ok(app, 'o app deve estar definido');
  assert.strictEqual(typeof app, 'function', 'o app Express deve ser uma função');
});

test('POST /upload envia um documento e retorna seus metadados', async () => {
  const formData = new FormData();
  formData.append('file', new Blob([fileContent], { type: 'text/plain' }), 'relatorio.txt');
  formData.append('owner', 'usuario-teste');

  const response = await fetch(`${baseUrl}/upload`, {
    method: 'POST',
    body: formData,
  });

  assert.equal(response.status, 201);
  uploadedDocument = await response.json();
  assert.ok(uploadedDocument.id);
  assert.equal(uploadedDocument.originalName, 'relatorio.txt');
  assert.equal(uploadedDocument.size, Buffer.byteLength(fileContent));
  assert.equal(uploadedDocument.owner, 'usuario-teste');
});

test('GET /documents lista os metadados do documento enviado', async () => {
  const response = await fetch(`${baseUrl}/documents`);

  assert.equal(response.status, 200);
  const documents = await response.json();
  assert.ok(documents.some((document) => document.id === uploadedDocument.id));
});

test('GET /documents/:id/download baixa o conteúdo do documento', async () => {
  const response = await fetch(`${baseUrl}/documents/${uploadedDocument.id}/download`);

  assert.equal(response.status, 200);
  assert.match(response.headers.get('content-disposition'), /attachment/);
  assert.equal(await response.text(), fileContent);
});
