# 🔧 Solución: URLs de S3 Mal Formateadas

## 📋 Problema Detectado

En los logs del servidor aparecen advertencias como estas:

```
[S3] Could not extract key from URL: models/monuments/691d5972d62d110a4e5942a3/2025-11-19T05-45-58-381Z_huaca_tecsup.glb
[S3] Could not extract key from URL: 1765329463955_Huaca Tecsup.glb
```

### ¿Qué significa?

Algunos documentos en MongoDB tienen URLs de S3 incompletas:

**❌ Formato Incorrecto:**
```
models/monuments/691d5972d62d110a4e5942a3/file.glb
1765329463955_Huaca Tecsup.glb
```

**✅ Formato Correcto:**
```
https://historiar-storage.s3.us-east-2.amazonaws.com/models/monuments/691d5972d62d110a4e5942a3/file.glb
```

### Impacto

- ⚠️ Las Pre-Signed URLs no se generan correctamente
- ⚠️ Las imágenes/modelos no cargan en el frontend
- ⚠️ Los logs se llenan de advertencias

---

## ✅ Solución Implementada

### 1. Mejoras en el Código

**Archivo modificado:** `backend/src/services/s3Service.js`

La función `extractKeyFromUrl()` ahora maneja múltiples formatos:
- ✅ URLs completas: `https://bucket.s3.region.amazonaws.com/images/file.jpg`
- ✅ Rutas de key: `images/monuments/file.jpg`
- ❌ Solo nombres: `file.jpg` (no se puede procesar)

### 2. Nuevos Endpoints de Administración

**Archivo creado:** `backend/src/routes/admin.routes.js`

Dos nuevos endpoints para diagnosticar y corregir URLs:

#### `GET /api/admin/check-urls`
Verifica cuántas URLs están mal formateadas.

#### `POST /api/admin/fix-urls`
Corrige automáticamente todas las URLs mal formateadas.

### 3. Script de Migración

**Archivo creado:** `backend/src/migrations/fixS3UrlFormats.js`

Script standalone para corregir URLs (requiere acceso directo a MongoDB).

---

## 🚀 Cómo Usar

### Opción 1: Endpoints API (Recomendado)

Con el servidor corriendo en `http://localhost:4000`:

#### 1. Verificar el problema

```bash
curl http://localhost:4000/api/admin/check-urls
```

Esto te mostrará:
- Cuántas URLs están mal formateadas
- Ejemplos de documentos afectados

#### 2. Corregir las URLs

```bash
curl -X POST http://localhost:4000/api/admin/fix-urls
```

Esto corregirá automáticamente todas las URLs y te mostrará:
- Cuántos documentos se corrigieron
- Si hubo errores

#### 3. Verificar que funcionó

Revisa los logs del servidor - las advertencias deberían desaparecer:

```bash
# Antes
[S3] Could not extract key from URL: models/monuments/...

# Después
[S3] Generated presigned URL for models/monuments/..., expires in 172800s
✅ Sin advertencias
```

### Opción 2: Script de Migración

Si tienes acceso directo a MongoDB:

```bash
cd backend
npm run migrate:fix-urls
```

---

## 📊 Resultados Esperados

### Antes de la Corrección

```json
{
  "name": "Huaca Tecsup",
  "imageUrl": "images/monuments/file.jpg",
  "model3DUrl": "models/monuments/123/model.glb"
}
```

### Después de la Corrección

```json
{
  "name": "Huaca Tecsup",
  "imageUrl": "https://historiar-storage.s3.us-east-2.amazonaws.com/images/monuments/file.jpg",
  "model3DUrl": "https://historiar-storage.s3.us-east-2.amazonaws.com/models/monuments/123/model.glb"
}
```

### En el Frontend

Las imágenes y modelos 3D ahora cargarán correctamente con Pre-Signed URLs:

```json
{
  "name": "Huaca Tecsup",
  "imageUrl": "https://historiar-storage.s3.us-east-2.amazonaws.com/images/monuments/file.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Signature=..."
}
```

---

## 🧪 Verificación

### 1. Probar Endpoints

```bash
# Obtener monumentos
curl http://localhost:4000/api/monuments

# Verificar que las URLs tengan X-Amz-Signature
# Esto indica que son Pre-Signed URLs válidas
```

### 2. Revisar Logs

Los logs deberían mostrar:

```
✅ [S3] Generated presigned URL for images/monuments/file.jpg, expires in 86400s
✅ [S3] Generated presigned URL for models/monuments/model.glb, expires in 172800s
```

Sin advertencias de "Could not extract key".

### 3. Probar en el Frontend

- Las imágenes de monumentos deben cargar
- Los modelos 3D deben visualizarse
- No debe haber errores 403 (Forbidden)

---

## 📁 Archivos Modificados/Creados

### Modificados
1. ✅ `backend/src/services/s3Service.js` - Mejoras en `extractKeyFromUrl()`
2. ✅ `backend/src/app.js` - Agregadas rutas de admin
3. ✅ `backend/package.json` - Agregado script `migrate:fix-urls`

### Creados
1. ✅ `backend/src/routes/admin.routes.js` - Endpoints de administración
2. ✅ `backend/src/migrations/fixS3UrlFormats.js` - Script de migración
3. ✅ `backend/scripts/testUrlFix.js` - Script de diagnóstico
4. ✅ `backend/docs/FIX_S3_URL_FORMATS.md` - Documentación detallada
5. ✅ `SOLUCION_URLS_S3.md` - Este documento (resumen)

---

## 🎯 Próximos Pasos

1. **Ejecutar la corrección:**
   ```bash
   curl -X POST http://localhost:4000/api/admin/fix-urls
   ```

2. **Verificar que funcionó:**
   ```bash
   curl http://localhost:4000/api/admin/check-urls
   ```
   Debería mostrar `"needsFix": false`

3. **Probar en el frontend:**
   - Abrir el admin panel
   - Verificar que las imágenes carguen
   - Verificar que los modelos 3D funcionen

4. **Monitorear logs:**
   - No deberían aparecer más advertencias de "Could not extract key"
   - Todas las Pre-Signed URLs deberían generarse correctamente

---

## 💡 Prevención Futura

Para evitar este problema en el futuro, asegúrate de que todo código que guarde URLs use el formato completo:

```javascript
// ✅ Correcto
const url = await uploadImageToS3(buffer, filename, monumentId);
// url = "https://bucket.s3.region.amazonaws.com/images/monuments/file.jpg"
monument.imageUrl = url;

// ❌ Incorrecto
monument.imageUrl = filename; // Solo el nombre
monument.imageUrl = `images/${filename}`; // Solo la ruta
```

---

## 📚 Documentación Adicional

- **Guía completa:** `backend/docs/FIX_S3_URL_FORMATS.md`
- **Pre-Signed URLs:** `backend/docs/PRESIGNED_URLS.md`
- **Implementación:** `PRESIGNED_URLS_IMPLEMENTATION.md`

---

**Fecha:** Diciembre 11, 2024  
**Versión:** 1.0  
**Estado:** ✅ Listo para usar
