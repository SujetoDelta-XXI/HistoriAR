# Guía de Despliegue en Vercel - HistoriAR

Esta guía te ayudará a desplegar tanto el **Backend** como el **Admin Panel** en Vercel.

## 📋 Requisitos Previos

1. Cuenta en [Vercel](https://vercel.com)
2. MongoDB Atlas configurado y accesible
3. Google Cloud Storage (GCS) configurado con:
   - Bucket creado (`histori_ar`)
   - Service Account con permisos
   - Credenciales JSON descargadas
4. Repositorio Git (GitHub, GitLab, o Bitbucket)

---

## 🚀 Parte 1: Despliegue del Backend

### 1.1 Preparar el Backend para Vercel

✅ **Ya está configurado!** Los archivos necesarios ya están creados:

- `backend/api/index.js` - Punto de entrada serverless
- `backend/vercel.json` - Configuración de Vercel
- `backend/.vercelignore` - Archivos a ignorar

**Nota importante:** Vercel usa **serverless functions**, por lo que no se usa `app.listen()`. La conexión a MongoDB se inicializa automáticamente en cada request.

### 1.2 Variables de Entorno del Backend

En Vercel Dashboard > Tu Proyecto Backend > Settings > Environment Variables, agrega:


#### Variables Obligatorias:

```bash
# Server Configuration
PORT=4000
NODE_ENV=production

# Database - MongoDB Atlas
MONGODB_URI=mongodb+srv://USUARIO:PASSWORD@cluster-xxx.mongodb.net/historiar?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=tu_secreto_jwt_super_seguro_cambiar_en_produccion_minimo_32_caracteres
JWT_EXPIRES_IN=7d

# Google Cloud Storage
GCS_PROJECT_ID=tu-proyecto-gcp-id
GCS_BUCKET_NAME=histori_ar

# GCS Credentials (Método recomendado para Vercel)
GCS_CLIENT_EMAIL=tu-service-account@tu-proyecto.iam.gserviceaccount.com
GCS_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nTU_CLAVE_PRIVADA_AQUI\n-----END PRIVATE KEY-----\n"

# API Configuration (se actualizará después del despliegue)
API_BASE_URL=https://tu-backend.vercel.app
```

#### 📝 Notas Importantes:

**MongoDB Atlas:**
- Asegúrate de que tu IP de Vercel esté en la whitelist (o permite `0.0.0.0/0` para producción)
- Ve a MongoDB Atlas > Network Access > Add IP Address > Allow Access from Anywhere

**JWT_SECRET:**
- Genera uno seguro: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

**GCS_PRIVATE_KEY:**
- Copia la clave privada de tu archivo JSON de credenciales de GCS
- Mantén los `\n` para los saltos de línea
- Encierra todo entre comillas dobles


### 1.3 Obtener Credenciales de GCS

1. Ve a [Google Cloud Console](https://console.cloud.google.com)
2. Selecciona tu proyecto
3. Ve a **IAM & Admin > Service Accounts**
4. Encuentra tu service account o crea uno nuevo
5. Click en **Keys > Add Key > Create New Key > JSON**
6. Descarga el archivo JSON

El archivo tendrá esta estructura:
```json
{
  "type": "service_account",
  "project_id": "tu-proyecto-id",
  "private_key_id": "...",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  "client_email": "tu-service-account@tu-proyecto.iam.gserviceaccount.com",
  "client_id": "...",
  "auth_uri": "...",
  "token_uri": "...",
  "auth_provider_x509_cert_url": "...",
  "client_x509_cert_url": "..."
}
```

Usa los valores de `project_id`, `client_email` y `private_key` para las variables de entorno.

### 1.4 Desplegar Backend en Vercel

**Opción A: Desde la CLI de Vercel**
```bash
cd backend
npm install -g vercel
vercel login
vercel --prod
```

**Opción B: Desde el Dashboard de Vercel**
1. Ve a [Vercel Dashboard](https://vercel.com/dashboard)
2. Click en **Add New > Project**
3. Importa tu repositorio
4. Configura:
   - **Framework Preset:** Other
   - **Root Directory:** `backend`
   - **Build Command:** (dejar vacío)
   - **Output Directory:** (dejar vacío)
5. Agrega todas las variables de entorno
6. Click en **Deploy**


### 1.5 Verificar el Despliegue del Backend

Una vez desplegado, verifica:

```bash
# Reemplaza con tu URL de Vercel
curl https://tu-backend.vercel.app/api/health

# Debería responder con algo como:
# {"status":"ok","timestamp":"..."}
```

---

## 🎨 Parte 2: Despliegue del Admin Panel

### 2.1 Preparar el Admin Panel

✅ **Ya está configurado!** Los archivos necesarios ya están creados:

- `admin-panel/vercel.json` - Configuración de Vercel para SPA
- `admin-panel/.vercelignore` - Archivos a ignorar

### 2.2 Variables de Entorno del Admin Panel

En Vercel Dashboard > Tu Proyecto Admin Panel > Settings > Environment Variables:

```bash
# API Configuration - URL de tu backend desplegado
VITE_API_BASE_URL=https://tu-backend.vercel.app/api

# Environment
VITE_NODE_ENV=production
```

⚠️ **IMPORTANTE:** Reemplaza `https://tu-backend.vercel.app` con la URL real de tu backend desplegado en el paso anterior.


### 2.3 Desplegar Admin Panel en Vercel

**Opción A: Desde la CLI de Vercel**
```bash
cd admin-panel
vercel --prod
```

**Opción B: Desde el Dashboard de Vercel**
1. Ve a [Vercel Dashboard](https://vercel.com/dashboard)
2. Click en **Add New > Project**
3. Importa tu repositorio (o selecciona el mismo si ya lo importaste)
4. Configura:
   - **Framework Preset:** Vite
   - **Root Directory:** `admin-panel`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
5. Agrega las variables de entorno
6. Click en **Deploy**

### 2.4 Verificar el Despliegue del Admin Panel

1. Abre la URL de tu admin panel: `https://tu-admin-panel.vercel.app`
2. Intenta hacer login con las credenciales de administrador
3. Verifica que pueda conectarse al backend

---

## 🔧 Parte 3: Configuración Post-Despliegue

### 3.1 Actualizar CORS en el Backend

Actualiza el archivo `backend/src/app.js` para permitir tu dominio del admin panel:

```javascript
const corsOptions = {
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://tu-admin-panel.vercel.app', // Agregar esta línea
  ],
  credentials: true,
};
```

Redespliega el backend después de este cambio.


### 3.2 Configurar MongoDB Atlas

1. Ve a [MongoDB Atlas](https://cloud.mongodb.com)
2. Selecciona tu cluster
3. Click en **Network Access**
4. Click en **Add IP Address**
5. Selecciona **Allow Access from Anywhere** (`0.0.0.0/0`)
6. Click en **Confirm**

⚠️ **Nota de Seguridad:** En producción, considera usar MongoDB Atlas con IP whitelisting específico o VPC peering.

### 3.3 Verificar Permisos de GCS

Asegúrate de que tu Service Account tenga los permisos correctos:

1. Ve a [Google Cloud Console](https://console.cloud.google.com)
2. Ve a **IAM & Admin > IAM**
3. Encuentra tu service account
4. Verifica que tenga el rol: **Storage Object Admin** o **Storage Admin**

### 3.4 Ejecutar Migraciones (Opcional)

Si necesitas ejecutar migraciones en producción:

```bash
# Desde tu máquina local con las variables de entorno de producción
cd backend
node scripts/runMigrations.js
node scripts/createIndexes.js
```

O crea un script temporal en Vercel:
1. Agrega un endpoint temporal en tu backend: `/api/admin/migrate`
2. Protégelo con autenticación
3. Llámalo una vez después del despliegue
4. Elimina el endpoint

---

## ✅ Checklist de Verificación

### Backend:
- [ ] Backend desplegado en Vercel
- [ ] Variables de entorno configuradas
- [ ] MongoDB Atlas accesible (Network Access configurado)
- [ ] GCS conectado correctamente
- [ ] Endpoint `/api/health` responde
- [ ] CORS configurado con dominio del admin panel


### Admin Panel:
- [ ] Admin Panel desplegado en Vercel
- [ ] Variable `VITE_API_BASE_URL` apunta al backend correcto
- [ ] Puede hacer login
- [ ] Puede cargar datos desde el backend
- [ ] Puede subir imágenes a GCS
- [ ] Puede subir modelos 3D a GCS

---

## 🐛 Troubleshooting

### Error: "Cannot connect to MongoDB"
- Verifica que `MONGODB_URI` esté correctamente configurada
- Asegúrate de que MongoDB Atlas permita conexiones desde `0.0.0.0/0`
- Verifica que el usuario y contraseña sean correctos

### Error: "GCS authentication failed"
- Verifica que `GCS_PRIVATE_KEY` tenga los saltos de línea `\n`
- Asegúrate de que `GCS_CLIENT_EMAIL` sea correcto
- Verifica que el Service Account tenga permisos en el bucket

### Error: "CORS policy blocked"
- Actualiza `backend/src/app.js` con la URL del admin panel
- Redespliega el backend

### Error: "Cannot upload files"
- Verifica permisos del Service Account en GCS
- Asegúrate de que el bucket exista y sea accesible
- Revisa los logs de Vercel para más detalles

### Admin Panel no carga datos
- Verifica que `VITE_API_BASE_URL` esté correctamente configurada
- Abre DevTools > Network para ver errores de API
- Verifica que el backend esté respondiendo

---

## 📚 Recursos Adicionales

- [Vercel Documentation](https://vercel.com/docs)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [Google Cloud Storage Documentation](https://cloud.google.com/storage/docs)


---

## 🔐 Resumen de Variables de Entorno

### Backend (Vercel)
```bash
PORT=4000
NODE_ENV=production
MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/historiar?retryWrites=true&w=majority
JWT_SECRET=tu_secreto_jwt_super_seguro_minimo_32_caracteres
JWT_EXPIRES_IN=7d
GCS_PROJECT_ID=tu-proyecto-gcp
GCS_BUCKET_NAME=histori_ar
GCS_CLIENT_EMAIL=service-account@proyecto.iam.gserviceaccount.com
GCS_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
API_BASE_URL=https://tu-backend.vercel.app
```

### Admin Panel (Vercel)
```bash
VITE_API_BASE_URL=https://tu-backend.vercel.app/api
VITE_NODE_ENV=production
```

---

## 🚀 Comandos Rápidos

```bash
# Desplegar Backend
cd backend
vercel --prod

# Desplegar Admin Panel
cd admin-panel
vercel --prod

# Ver logs del Backend
vercel logs tu-backend.vercel.app

# Ver logs del Admin Panel
vercel logs tu-admin-panel.vercel.app
```

---

¡Listo! Tu aplicación HistoriAR debería estar completamente desplegada en Vercel. 🎉
