import { getDocumentDownloadUrl } from '../services/documentApi.js';

export default function DownloadButton({ documentId, originalName }) {
  return (
    <a
      href={getDocumentDownloadUrl(documentId)}
      download={originalName}
    >
      Baixar
    </a>
  );
}
