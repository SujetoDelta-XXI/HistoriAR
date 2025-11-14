# 🚀 Quick Start - Despliegue en Vercel

## ✅ Archivos ya configurados

Tu proyecto ya está listo para Vercel:

```
✓ backend/api/index.js       - Punto de entrada serverless
✓ backend/vercel.json         - Configuración backend
✓ backend/.vercelignore       - Archivos a ignorar
✓ admin-panel/vercel.json     - Configuración frontend
✓ admin-panel/.vercelignore   - Archivos a ignorar
```

---

## 📝 Pasos para Desplegar

### 1️⃣ Desplegar Backend

```bash
cd backend
vercel --prod
```

Anota la URL: `https://tu-backend.vercel.app`

### 2️⃣ Configurar Variables de Entorno del Backend

En Vercel Dashboard > Backend Project > Settings > Environment Variables:

```bash
MONGODB_URI=mongodb+srv://usuario:pass@cluster.mongodb.net/historiar
JWT_SECRET=tu_secreto_super_seguro_minimo_32_caracteres
GCS_PROJECT_ID=tu-proyecto-gcp
GCS_BUCKET_NAME=histori_ar
GCS_CLIENT_EMAIL=service-account@proyecto.iam.gserviceaccount.com
GCS_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

### 3️⃣ Desplegar Admin Panel

```bash
cd admin-panel
vercel --prod
```

### 4️⃣ Configurar Variables de Entorno del Admin Panel

En Vercel Dashboard > Admin Panel Project > Settings > Environment Variables:

```bash
VITE_API_BASE_URL=https://tu-backend.vercel.app/api
VITE_NODE_ENV=production
```

### 5️⃣ Actualizar CORS

Edita `backend/src/app.js` y agrega tu dominio del admin panel:

```javascript
const corsOptions = {
  origin: [
    'http://localhost:5173',
    'https://tu-admin-panel.vercel.app',  // ← Agregar
  ],
  credentials: true,
};

app.use(cors(corsOptions));
```

Redespliega el backend: `vercel --prod`

---

## ✅ Verificación

1. Backend: `https://tu-backend.vercel.app/api/health`
2. Admin Panel: `https://tu-admin-panel.vercel.app`
3. Login y prueba subir una imagen

---

## 📚 Documentación Completa

- `VERCEL_DEPLOYMENT_GUIDE.md` - Guía detallada paso a paso
- `VERCEL_VS_LOCAL.md` - Diferencias entre local y serverless

---

## 🆘 Problemas Comunes

**Error: Cannot connect to MongoDB**
→ Verifica `MONGODB_URI` y permite `0.0.0.0/0` en MongoDB Atlas

**Error: GCS authentication failed**
→ Verifica que `GCS_PRIVATE_KEY` tenga los `\n` correctos

**Error: CORS blocked**
→ Agrega tu dominio en `app.js` y redespliega
