import DownloadButton from './DownloadButton.jsx';

function formatSize(size) {
  if (size < 1024) {
    return `${size} B`;
  }

  return `${(size / 1024).toFixed(1)} KB`;
}

export default function DocumentList({ documents, isLoading, error }) {
  return (
    <section>
      <h2>Documentos</h2>

      {isLoading && <p>Carregando documentos...</p>}
      {error && <p role="alert">{error}</p>}

      {!isLoading && !error && documents.length === 0 && (
        <p>Nenhum documento enviado.</p>
      )}

      {!isLoading && documents.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Tamanho</th>
              <th>Enviado em</th>
              <th>Ação</th>
            </tr>
          </thead>
          <tbody>
            {documents.map((document) => (
              <tr key={document.id}>
                <td>{document.originalName}</td>
                <td>{formatSize(document.size)}</td>
                <td>{new Date(document.uploadedAt).toLocaleString('pt-BR')}</td>
                <td>
                  <DownloadButton
                    documentId={document.id}
                    originalName={document.originalName}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}
