const express = require('express');
const { uploadSingleFile } = require('../middleware/upload');

const router = express.Router();

// POST /api/upload — single file, field name: file
router.post('/', uploadSingleFile, (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: 'No file uploaded. Use field name "file".',
    });
  }

  res.status(201).json({
    success: true,
    filename: req.file.filename,
    filepath: `/uploads/${req.file.filename}`,
  });
});

module.exports = router;
