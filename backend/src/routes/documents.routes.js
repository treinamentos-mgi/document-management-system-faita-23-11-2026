const crypto = require('node:crypto');
const path = require('node:path');
const express = require('express');
const multer = require('multer');
const repository = require('../repositories/documents.repository');
const controller = require('../controllers/documents.controller');

const router = express.Router();

const upload = multer({
  storage: multer.diskStorage({
    destination: repository.getStorageDirectory(),
    filename: (req, file, callback) => {
      const extension = path.extname(file.originalname);
      callback(null, `${crypto.randomUUID()}${extension}`);
    },
  }),
});

router.post('/upload', upload.single('file'), controller.upload);
router.get('/documents', controller.list);
router.get('/documents/:id/download', controller.download);

module.exports = router;
