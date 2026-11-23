const API_PREFIX = '/api';

async function readResponse(response) {
  const contentType = response.headers.get('content-type') || '';

  if (contentType.includes('application/json')) {
    return response.json();
  }

  return null;
}

async function request(url, options) {
  const response = await fetch(url, options);

  if (!response.ok) {
    const body = await readResponse(response);
    throw new Error(body?.error || 'Não foi possível concluir a operação');
  }

  return readResponse(response);
}

export async function uploadDocument(file) {
  const formData = new FormData();
  formData.append('file', file);

  return request(`${API_PREFIX}/upload`, {
    method: 'POST',
    body: formData,
  });
}

export function listDocuments() {
  return request(`${API_PREFIX}/documents`);
}

export function getDocumentDownloadUrl(id) {
  return `${API_PREFIX}/documents/${encodeURIComponent(id)}/download`;
}
