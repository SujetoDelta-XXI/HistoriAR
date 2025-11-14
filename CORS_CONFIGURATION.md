# 🔒 Configuración de CORS

## ¿Qué es CORS?

CORS (Cross-Origin Resource Sharing) es un mecanismo de seguridad que controla qué dominios pueden acceder a tu API.

---

## 🎯 Configuración Actual

Tu backend está configurado para aceptar requests desde:

```javascript
const allowedOrigins = [
  'http://localhost:5173',  // Vite dev server
  'http://localhost:3000',  // React dev server
  'http://localhost:4000',  // Backend local
];
```

---

## 🚀 Después del Despliegue

### Opción 1: Editar el código (Recomendado)

1. Despliega tu admin panel en Vercel
2. Anota la URL: `https://tu-admin-panel.vercel.app`
3. Edita `backend/src/app.js`:

```javascript
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:4000',
  'https://tu-admin-panel.vercel.app',  // ← Agregar esta línea
];
```

4. Redespliega el backend:
```bash
cd backend
vercel --prod
```

### Opción 2: Variable de entorno (Más flexible)

1. En Vercel Dashboard > Backend Project > Settings > Environment Variables
2. Agrega:
```bash
ALLOWED_ORIGINS=https://tu-admin-panel.vercel.app,https://otro-dominio.com
```

3. Redespliega el backend

**Ventaja:** Puedes cambiar los dominios sin modificar código.

---

## 🧪 Verificar CORS

### Desde el navegador:

1. Abre DevTools (F12)
2. Ve a la pestaña Console
3. Ejecuta:

```javascript
fetch('https://tu-backend.vercel.app/api/health')
  .then(r => r.json())
  .then(console.log)
  .catch(console.error);
```

**Si funciona:** Verás `{status: "ok", ...}`
**Si falla:** Verás error de CORS

### Desde curl:

```bash
curl -H "Origin: https://tu-admin-panel.vercel.app" \
     -H "Access-Control-Request-Method: GET" \
     -X OPTIONS \
     https://tu-backend.vercel.app/api/health
```

Deberías ver headers como:
```
Access-Control-Allow-Origin: https://tu-admin-panel.vercel.app
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, PATCH, OPTIONS
```

---

## ❌ Errores Comunes

### Error: "CORS policy: No 'Access-Control-Allow-Origin' header"

**Causa:** El dominio del admin panel no está en `allowedOrigins`

**Solución:**
1. Verifica la URL exacta del admin panel
2. Agrégala a `allowedOrigins` en `backend/src/app.js`
3. Redespliega el backend

### Error: "CORS policy: The request client is not a secure context"

**Causa:** Intentas hacer request desde HTTP a HTTPS

**Solución:** Usa HTTPS en ambos lados (Vercel usa HTTPS por defecto)

### Error: "Not allowed by CORS"

**Causa:** El origen no está en la lista permitida

**Solución:** Revisa que la URL esté escrita exactamente igual (sin `/` al final)

---

## 🔓 Permitir Todos los Orígenes (NO RECOMENDADO)

Solo para desarrollo/testing:

```javascript
app.use(cors({
  origin: '*',  // ⚠️ INSEGURO - No usar en producción
}));
```

**Riesgos:**
- Cualquier sitio web puede acceder a tu API
- Expone datos sensibles
- Permite ataques CSRF

---

## ✅ Mejores Prácticas

1. **Lista blanca específica:** Solo dominios que necesitas
2. **HTTPS en producción:** Siempre usa conexiones seguras
3. **Credentials:** Solo si necesitas cookies/auth headers
4. **Métodos específicos:** Solo los que tu API usa
5. **Headers específicos:** Solo los necesarios

---

## 📝 Configuración Actual Completa

```javascript
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);  // Mobile apps, Postman
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,  // Permite cookies y auth headers
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
```

Esta configuración:
- ✅ Permite solo dominios específicos
- ✅ Soporta autenticación con JWT
- ✅ Permite requests desde apps móviles
- ✅ Especifica métodos HTTP permitidos
- ✅ Especifica headers permitidos
