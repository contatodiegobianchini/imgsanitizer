import express, { NextFunction, Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import { sanitizeImage } from './sanitizer';
import { fileFilter } from './utils';

const app = express();
const port = process.env.PORT || 3000;
const publicDir = path.join(process.cwd(), 'public');

const defaultMaxUploadMb = process.env.VERCEL ? 3 : 50;
const configuredMaxUploadMb = Number(process.env.IMG_SANITIZER_MAX_MB);
const maxUploadMb =
  Number.isFinite(configuredMaxUploadMb) &&
  configuredMaxUploadMb > 0 &&
  configuredMaxUploadMb <= 100
    ? configuredMaxUploadMb
    : defaultMaxUploadMb;

const maxUploadBytes = Math.floor(maxUploadMb * 1024 * 1024);

app.disable('x-powered-by');

app.use((_req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'no-referrer');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' https://cdn.tailwindcss.com; style-src 'self' 'unsafe-inline'; img-src 'self' blob: data:; connect-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'"
  );
  next();
});

app.use(express.static(publicDir));

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter,
  limits: {
    fileSize: maxUploadBytes,
    files: 1,
  },
});

app.get('/api/config', (_req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  res.json({
    maxUploadMb,
    hosted: Boolean(process.env.VERCEL),
  });
});

app.post('/api/sanitize', upload.single('image'), async (req, res, next) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: 'Nenhuma imagem enviada.' });
    }

    const sanitizedBuffer = await sanitizeImage(file.buffer);

    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('Content-Type', file.mimetype);
    res.setHeader('Content-Length', sanitizedBuffer.length.toString());
    return res.send(sanitizedBuffer);
  } catch (error) {
    return next(error);
  }
});

app.use(
  (error: unknown, _req: Request, res: Response, _next: NextFunction) => {
    if (error instanceof multer.MulterError && error.code === 'LIMIT_FILE_SIZE') {
      return res.status(413).json({
        error: `Arquivo muito grande. Limite atual: ${maxUploadMb} MB.`,
      });
    }

    const message =
      error instanceof Error ? error.message : 'Falha ao processar imagem.';

    const isClientError =
      message.includes('Formato de arquivo não suportado') ||
      message.includes('Input buffer contains unsupported image format');

    return res.status(isClientError ? 400 : 500).json({
      error: isClientError ? message : 'Falha ao processar imagem.',
    });
  }
);

if (!process.env.VERCEL) {
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}

export default app;
