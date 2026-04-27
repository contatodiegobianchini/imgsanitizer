import express from 'express';
import multer from 'multer';
import cors from 'cors';
import path from 'path';
import { storage } from './storage';
import { sanitizeImage } from './sanitizer';
import { fileFilter } from './utils';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.static('public'));

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB
  },
});

app.post('/api/sanitize', upload.array('images'), async (req, res) => {
  try {
    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) {
      return res.status(400).json({ error: 'Nenhuma imagem enviada.' });
    }

    const results = await Promise.all(
      files.map(async (file) => {
        const sanitizedBuffer = await sanitizeImage(file.buffer);
        const id = storage.save(sanitizedBuffer, file.originalname, file.mimetype);
        return {
          id,
          originalName: file.originalname,
          size: sanitizedBuffer.length,
        };
      })
    );

    res.json({ success: true, images: results });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/download/:id', (req, res) => {
  const { id } = req.params;
  const image = storage.get(id);

  if (!image) {
    return res.status(404).json({ error: 'Imagem não encontrada ou expirada.' });
  }

  res.setHeader('Content-Type', image.mimeType);
  res.setHeader('Content-Disposition', `attachment; filename="sanitized-${image.originalName}"`);
  res.send(image.buffer);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
