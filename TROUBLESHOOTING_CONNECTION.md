# 🔍 Troubleshooting: Admin Panel no conecta con Backend

## Problema Detectado

Tu admin panel tiene configurada esta URL:
```
VITE_API_BASE_URL=https://backend-historiar-qgszsdz9g-carlos-projects-0d07c157.vercel.app/api
```

## ✅ Pasos para Diagnosticar

### 1. Verificar que el Backend esté funcionando

Abre tu navegador y ve a:
```
https://backend-historiar-qgszsdz9g-carlos-projects-0d07c157.vercel.app/api/health
```

**Resultado esperado:**
```json
{
  "status": "ok",
  "timestamp": "2024-..."
}
```

**Si no funciona:**
- La URL puede estar incorrecta
- El backend no se desplegó correctamente
- Hay un error en el backend

### 2. Verificar CORS

Abre DevTools (F12) en tu admin panel y ve a la pestaña Console. Busca errores como:

```
Access to fetch at '...' from origin '...' has been blocked by CORS policy
```

**Si ves este error:**
El backend no tiene configurado el dominio de tu admin panel en CORS.

### 3. Verificar la URL correcta del Backend

En Vercel Dashboard:
1. Ve a tu proyecto del backend
2. Click en la pestaña "Deployments"
3. Click en el deployment más reciente
4. Copia la URL que aparece arriba (debería ser algo como `https://tu-proyecto.vercel.app`)



---

## 🛠️ Soluciones Comunes

### Solución 1: URL del Backend Incorrecta

La URL que tienes parece ser una URL temporal de preview. Necesitas la URL de producción.

**Pasos:**
1. Ve a Vercel Dashboard > Tu Backend Project
2. Busca la URL de producción (sin el hash largo)
3. Actualiza `admin-panel/.env`:

```bash
VITE_API_BASE_URL=https://tu-backend-correcto.vercel.app/api
```

4. Reconstruye el admin panel:
```bash
cd admin-panel
npm run build
vercel --prod
```

### Solución 2: CORS no configurado

Si el backend responde pero el admin panel no puede conectarse, es un problema de CORS.

**Pasos:**

1. Obtén la URL de tu admin panel desplegado (ej: `https://tu-admin-panel.vercel.app`)

2. Edita `backend/src/app.js` y agrega tu dominio:

```javascript
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:4000',
  'https://tu-admin-panel.vercel.app',  // ← Agregar esta línea
];
```

3. Redespliega el backend:
```bash
cd backend
vercel --prod
```

### Solución 3: Variables de entorno no se aplicaron

Las variables de entorno en Vite solo se leen en tiempo de BUILD, no en runtime.

**Pasos:**

1. Verifica que la variable esté en Vercel:
   - Vercel Dashboard > Admin Panel Project > Settings > Environment Variables
   - Debe existir: `VITE_API_BASE_URL=https://...`

2. Redespliega el admin panel para que tome la nueva variable:
```bash
cd admin-panel
vercel --prod
```

### Solución 4: Backend no tiene MongoDB configurado

Si el backend responde con errores 500, puede ser que MongoDB no esté conectado.

**Pasos:**

1. Ve a Vercel Dashboard > Backend Project > Settings > Environment Variables
2. Verifica que exista `MONGODB_URI`
3. Ve a MongoDB Atlas > Network Access
4. Asegúrate de que `0.0.0.0/0` esté permitido
5. Redespliega el backend

