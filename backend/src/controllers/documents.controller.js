const service = require('../services/documents.service');

function upload(req, res) {
  if (!req.file) {
    return res.status(400).json({ error: 'Arquivo não enviado' });
  }

  try {
    const document = service.upload(req.file, req.body?.owner);
    return res.status(201).json(document);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Falha ao enviar documento' });
  }
}

function list(req, res) {
  try {
    return res.status(200).json(service.list());
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Falha ao listar documentos' });
  }
}

function download(req, res) {
  try {
    const result = service.findForDownload(req.params.id);

    if (!result) {
      return res.status(404).json({ error: 'Documento não encontrado' });
    }

    return res.download(result.storagePath, result.document.originalName);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Falha ao baixar documento' });
  }
}

module.exports = {
  upload,
  list,
  download,
};
