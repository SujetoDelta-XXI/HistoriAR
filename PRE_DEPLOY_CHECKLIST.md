# ✅ Checklist Pre-Despliegue

Verifica estos puntos antes de desplegar en Vercel.

---

## 🗄️ MongoDB Atlas

- [ ] Cluster de MongoDB Atlas creado
- [ ] Base de datos `historiar` creada
- [ ] Usuario con permisos de lectura/escritura
- [ ] Network Access configurado para `0.0.0.0/0` (o IPs específicas)
- [ ] Connection string copiado: `mongodb+srv://...`

**Cómo verificar:**
```bash
# Prueba la conexión localmente
node -e "require('mongoose').connect('TU_MONGODB_URI').then(() => console.log('✅ Conectado')).catch(e => console.log('❌', e.message))"
```

---

## ☁️ Google Cloud Storage

- [ ] Proyecto de GCP creado
- [ ] Bucket `histori_ar` creado
- [ ] Service Account creado con rol "Storage Object Admin"
- [ ] Archivo JSON de credenciales descargado
- [ ] Valores extraídos del JSON:
  - `project_id`
  - `client_email`
  - `private_key` (con `\n` preservados)

**Estructura del bucket:**
```
histori_ar/
├── models/
│   └── monuments/
└── images/
    └── monuments/
```

**Cómo verificar:**
```bash
# Prueba la conexión localmente
npm run verify
```

---

## 🔐 Seguridad

- [ ] JWT_SECRET generado (mínimo 32 caracteres)
- [ ] Credenciales NO están en el código
- [ ] `.env` está en `.gitignore`
- [ ] Variables de entorno preparadas para Vercel

**Generar JWT_SECRET:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## 📦 Backend

- [ ] `backend/api/index.js` existe
- [ ] `backend/vercel.json` configurado
- [ ] `backend/.vercelignore` creado
- [ ] Dependencias actualizadas: `npm install`
- [ ] Sin errores de sintaxis: `npm run build` (si aplica)
- [ ] Tests pasan: `npm test` (si aplica)

---

## 🎨 Admin Panel

- [ ] `admin-panel/vercel.json` configurado
- [ ] `admin-panel/.vercelignore` creado
- [ ] Build funciona localmente: `npm run build`
- [ ] Preview funciona: `npm run preview`

---

## 🌐 Variables de Entorno

### Backend
```bash
✓ MONGODB_URI
✓ JWT_SECRET
✓ GCS_PROJECT_ID
✓ GCS_BUCKET_NAME
✓ GCS_CLIENT_EMAIL
✓ GCS_PRIVATE_KEY
```

### Admin Panel
```bash
✓ VITE_API_BASE_URL (se configura después del deploy del backend)
✓ VITE_NODE_ENV=production
```

---

## 🚀 Orden de Despliegue

1. **Primero:** Backend
   - Desplegar
   - Configurar variables de entorno
   - Anotar URL: `https://tu-backend.vercel.app`

2. **Segundo:** Admin Panel
   - Configurar `VITE_API_BASE_URL` con URL del backend
   - Desplegar

3. **Tercero:** Actualizar CORS
   - Agregar URL del admin panel en `backend/src/app.js`
   - Redesplegar backend

---

## 🧪 Post-Despliegue

- [ ] Backend responde: `https://tu-backend.vercel.app/api/health`
- [ ] Admin panel carga: `https://tu-admin-panel.vercel.app`
- [ ] Login funciona
- [ ] Puede listar monumentos
- [ ] Puede subir imágenes a GCS
- [ ] Puede subir modelos 3D a GCS
- [ ] CORS configurado correctamente

---

## 📝 Comandos Útiles

```bash
# Ver logs del backend
vercel logs tu-backend.vercel.app

# Ver logs del admin panel
vercel logs tu-admin-panel.vercel.app

# Redesplegar backend
cd backend && vercel --prod

# Redesplegar admin panel
cd admin-panel && vercel --prod
```

---

## 🆘 Si algo falla

1. Revisa los logs en Vercel Dashboard
2. Verifica las variables de entorno
3. Consulta `VERCEL_DEPLOYMENT_GUIDE.md` sección Troubleshooting
4. Verifica que MongoDB Atlas permita conexiones
5. Verifica que GCS tenga los permisos correctos
