# Diferencias: Desarrollo Local vs Vercel

## 🏠 Desarrollo Local

### Backend (`npm run dev`)
```javascript
// backend/src/server.js
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

- Servidor Express tradicional que escucha en un puerto
- Conexión a MongoDB se establece una vez al iniciar
- El servidor permanece activo continuamente
- Usa `nodemon` para reiniciar automáticamente

### Cómo funciona:
1. Ejecutas `npm run dev`
2. Se conecta a MongoDB
3. El servidor escucha en `http://localhost:4000`
4. Permanece activo hasta que lo detengas

---

## ☁️ Vercel (Serverless)

### Backend (Serverless Functions)
```javascript
// backend/api/index.js
export default app;  // No app.listen()
```

- **Serverless functions** - No hay servidor permanente
- Cada request inicia una nueva instancia (cold start)
- La conexión a MongoDB se reutiliza cuando es posible
- No puedes usar `app.listen()`

### Cómo funciona:
1. Usuario hace un request a `https://tu-backend.vercel.app/api/users`
2. Vercel inicia una función serverless
3. Se conecta a MongoDB (o reutiliza conexión existente)
4. Procesa el request
5. Devuelve la respuesta
6. La función se "duerme" después de un tiempo


---

## 🔄 Cambios Realizados para Vercel

### 1. Estructura de Archivos

**Antes:**
```
backend/
├── src/
│   ├── server.js  ← Punto de entrada con app.listen()
│   └── app.js
```

**Después (compatible con ambos):**
```
backend/
├── api/
│   └── index.js   ← Punto de entrada para Vercel (serverless)
├── src/
│   ├── server.js  ← Para desarrollo local (con app.listen())
│   └── app.js     ← Express app (sin app.listen())
```

### 2. Conexión a MongoDB

**Antes (server.js):**
```javascript
// Se conecta una vez al iniciar
await connectDB(MONGO_URI);
app.listen(PORT);
```

**Después (app.js):**
```javascript
// Se conecta en cada request (con cache)
let isConnected = false;

const initializeDB = async () => {
  if (isConnected) return;  // Reutiliza conexión
  await connectDB(MONGO_URI);
  isConnected = true;
};

initializeDB();
```

### 3. Configuración de Vercel

**vercel.json:**
```json
{
  "version": 2,
  "builds": [
    {
      "src": "api/index.js",  ← Apunta a la función serverless
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "api/index.js"  ← Todas las rutas van aquí
    }
  ]
}
```


---

## 📊 Comparación

| Aspecto | Local | Vercel |
|---------|-------|--------|
| **Tipo** | Servidor tradicional | Serverless functions |
| **Inicio** | `app.listen(PORT)` | `export default app` |
| **Conexión DB** | Una vez al iniciar | Por request (con cache) |
| **Escalabilidad** | Manual | Automática |
| **Costo** | Servidor 24/7 | Pay-per-request |
| **Cold Start** | No | Sí (primera request lenta) |
| **Logs** | Console local | Vercel Dashboard |

---

## ⚡ Ventajas de Serverless

1. **Escalabilidad automática** - Vercel escala según demanda
2. **Costo eficiente** - Solo pagas por requests
3. **Sin mantenimiento** - No necesitas gestionar servidores
4. **Deploy automático** - Git push = deploy
5. **CDN global** - Baja latencia en todo el mundo

## ⚠️ Limitaciones de Serverless

1. **Cold starts** - Primera request puede ser lenta (~1-2 segundos)
2. **Timeout** - Máximo 10 segundos por request (plan gratuito)
3. **Memoria limitada** - 1024 MB (plan gratuito)
4. **No WebSockets** - No soporta conexiones persistentes
5. **No cron jobs** - Necesitas servicios externos para tareas programadas

---

## 🎯 Mejor Práctica: Dual Mode

Tu código ahora soporta **ambos modos**:

### Desarrollo Local:
```bash
cd backend
npm run dev
# Usa src/server.js con app.listen()
```

### Producción (Vercel):
```bash
vercel --prod
# Usa api/index.js sin app.listen()
```

Esto te permite:
- Desarrollar localmente con hot-reload
- Desplegar en Vercel sin cambios
- Mantener un solo código base
