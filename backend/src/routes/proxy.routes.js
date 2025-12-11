import express from 'express';
import https from 'https';

const router = express.Router();

/**
 * Proxy para imágenes de S3 - Solución temporal para CORS
 * GET /api/proxy/image?url=<s3-url>
 */
router.get('/image', (req, res) => {
  const { url } = req.query;

  if (!url || !url.includes('historiar-storage.s3')) {
    return res.status(400).json({ error: 'URL inválida' });
  }

  // Configurar headers CORS manualmente
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Cache-Control', 'public, max-age=31536000');

  // Hacer request a S3 y pipear la respuesta
  https.get(url, (s3Response) => {
    // Copiar content-type de S3
    res.setHeader('Content-Type', s3Response.headers['content-type']);
    
    // Pipear la imagen directamente
    s3Response.pipe(res);
  }).on('error', (error) => {
    console.error('Error al obtener imagen de S3:', error);
    res.status(500).json({ error: 'Error al obtener imagen' });
  });
});

export default router;
