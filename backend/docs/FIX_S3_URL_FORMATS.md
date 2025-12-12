# 🔧 Corrección de Formatos de URLs de S3

## 🎯 Problema Detectado

En los logs del servidor se detectaron advertencias como estas:

```
[S3] Could not extract key from URL: models/monuments/691d5972d62d110a4e5942a3/2025-11-19T05-45-58-381Z_huaca_tecsup.glb
[S3] Could not extract key from URL: 1765329463955_Huaca Tecsup.glb
```

### ¿Qué significa esto?

Algunos documentos en la base de datos tienen URLs de S3 mal formateadas:

**❌ Formato Incorrecto:**
```
models/monuments/691d5972d62d110a4e5942a3/file.glb
1765329463955_Huaca Tecsup.glb
```

**✅ Formato Correcto:**
```
https://historiar-storage.s3.us-east-2.amazonaws.com/models/monuments/691d5972d62d110a4e5942a3/file.glb
```

### ¿Por qué ocurre?

Esto puede suceder por:
1. Migraciones antiguas que guardaron solo la ruta (key) en lugar de la URL completa
2. Código legacy que guardaba solo el nombre del archivo
3. Datos importados de otro sistema

### ¿Qué impacto tiene?

- ⚠️ Las Pre-Signed URLs no se pueden generar correctamente
- ⚠️ Las imágenes/modelos no se cargan en el frontend
- ⚠️ Los logs se llenan de advertencias

---

## 🛠️ Solución Implementada

### 1. Mejora en `s3Service.js`

Se mejoró la función `extractKeyFromUrl()` para manejar múltiples formatos:

```javascript
const extractKeyFromUrl = (url) => {
  if (!url || typeof url !== 'string') {
    return null;
  }

  // Intenta hacer match con URL completa
  const urlPattern = new RegExp(`https://${bucketName}\\.s3\\.${region}\\.amazonaws\\.com/(.+)`);
  const match = url.match(urlPattern);
  
  if (match) {
    return decodeURIComponent(match[1]);
  }
  
  // Si ya es una ruta de key (images/, models/, etc.), retornarla tal cual
  if (url.startsWith('images/') || url.startsWith('models/') || url.startsWith('documents/')) {
    return url;
  }
  
  // Si es solo un nombre de archivo, no podemos determinar la ruta completa
  return null;
};
```

**Ahora maneja:**
- ✅ URLs completas: `https://bucket.s3.region.amazonaws.com/images/file.jpg`
- ✅ Rutas de key: `images/monuments/file.jpg`
- ❌ Solo nombres de archivo: `file.jpg` (no se puede procesar)

### 2. Script de Migración

Se creó `backend/src/migrations/fixS3UrlFormats.js` que:

1. **Busca documentos con URLs mal formateadas** en:
   - Monumentos (`imageUrl`, `model3DUrl`, `model3DTilesUrl`)
   - Instituciones (`imageUrl`)
   - Datos Históricos (`imageUrl`, `multimedia.url`)
   - Versiones de Modelos (`url`, `tilesUrl`)

2. **Convierte rutas parciales a URLs completas:**
   ```javascript
   // Antes
   "images/monuments/file.jpg"
   
   // Después
   "https://historiar-storage.s3.us-east-2.amazonaws.com/images/monuments/file.jpg"
   ```

3. **Reporta qué se corrigió:**
   ```
   ✓ Monument Machu Picchu: imageUrl fixed
   ✓ Monument Huaca Tecsup: model3DUrl fixed
   ✅ Fixed 5 monuments
   ```

---

## 🚀 Cómo Ejecutar la Corrección

### Método 1: Usando Endpoints API (Recomendado)

Este método funciona con el servidor en ejecución y no requiere acceso directo a MongoDB.

#### Paso 1: Verificar el Problema

```bash
# Con el servidor corriendo, verifica si hay URLs mal formateadas
curl http://localhost:4000/api/admin/check-urls
```

Respuesta ejemplo:
```json
{
  "summary": {
    "totalBadImageUrls": 2,
    "totalBadModelUrls": 1,
    "needsFix": true
  },
  "examples": {
    "badImageUrls": [
      {
        "name": "Huaca Tecsup",
        "imageUrl": "images/monuments/file.jpg"
      }
    ],
    "badModelUrls": [
      {
        "name": "Plaza de Armas",
        "model3DUrl": "models/monuments/123/model.glb"
      }
    ]
  }
}
```

#### Paso 2: Ejecutar la Corrección

```bash
# Corregir todas las URLs mal formateadas
curl -X POST http://localhost:4000/api/admin/fix-urls
```

Respuesta ejemplo:
```json
{
  "success": true,
  "message": "URL fix completed",
  "results": {
    "monuments": {
      "fixed": 3,
      "errors": []
    },
    "institutions": {
      "fixed": 0,
      "errors": []
    }
  }
}
```

### Método 2: Usando Script de Migración

Este método requiere acceso directo a MongoDB (tu IP debe estar en la whitelist de Atlas).

```bash
cd backend
npm run migrate:fix-urls
```

### Paso 3: Verificar los Resultados

El script mostrará:

```
🚀 Starting S3 URL format migration...

📍 Bucket: historiar-storage
📍 Region: us-east-2

✅ Connected to MongoDB

📦 Fixing Monument URLs...
  ✓ Monument Huaca Tecsup: model3DUrl fixed
  ✓ Monument Plaza de Armas: imageUrl fixed
✅ Fixed 2 monuments

🏛️  Fixing Institution URLs...
✅ Fixed 0 institutions

📜 Fixing Historical Data URLs...
✅ Fixed 0 historical data entries

🎨 Fixing Model Version URLs...
  ✓ Model Version huaca_tecsup.glb: url fixed
✅ Fixed 1 model versions

==================================================
✅ Migration completed successfully!
📊 Total documents fixed: 3
==================================================

👋 Disconnected from MongoDB
```

### Paso 4: Reiniciar el Servidor

```bash
npm run dev
```

Ahora las advertencias deberían desaparecer y las Pre-Signed URLs se generarán correctamente.

---

## 🧪 Verificación

### Probar Pre-Signed URLs

```bash
npm run test:presigned
```

### Probar Endpoints

```bash
# Obtener monumentos
curl http://localhost:4000/api/monuments

# Verificar que las URLs tengan el formato correcto:
{
  "imageUrl": "https://historiar-storage.s3.us-east-2.amazonaws.com/images/monuments/file.jpg?X-Amz-Signature=..."
}
```

### Revisar Logs

Los logs ahora deberían mostrar:

```
[S3] Generated presigned URL for images/monuments/file.jpg, expires in 86400s
✅ Sin advertencias de "Could not extract key"
```

---

## 📊 Casos Especiales

### URLs que NO se pueden corregir automáticamente

Si tienes documentos con solo el nombre del archivo (sin ruta):

```json
{
  "imageUrl": "file.jpg"
}
```

**Solución manual:**
1. Identifica estos documentos en los logs
2. Busca el archivo en S3
3. Actualiza manualmente la URL en MongoDB

```javascript
// Ejemplo de corrección manual
db.monuments.updateOne(
  { _id: ObjectId("...") },
  { $set: { imageUrl: "https://historiar-storage.s3.us-east-2.amazonaws.com/images/monuments/file.jpg" } }
)
```

### Prevenir el Problema en el Futuro

Asegúrate de que todo código que guarde URLs use el formato completo:

```javascript
// ✅ Correcto
const url = await uploadImageToS3(buffer, filename, monumentId);
// url = "https://bucket.s3.region.amazonaws.com/images/monuments/file.jpg"

monument.imageUrl = url; // Guardar URL completa

// ❌ Incorrecto
monument.imageUrl = filename; // Solo el nombre
monument.imageUrl = `images/${filename}`; // Solo la ruta
```

---

## 🔍 Diagnóstico

### Ver documentos con URLs mal formateadas

```javascript
// En MongoDB shell o Compass

// Monumentos con URLs parciales
db.monuments.find({
  $or: [
    { imageUrl: { $regex: /^[^h]/ } },  // No empieza con 'h' (https)
    { model3DUrl: { $regex: /^[^h]/ } }
  ]
})

// Contar cuántos hay
db.monuments.countDocuments({
  imageUrl: { $regex: /^[^h]/ }
})
```

### Script de diagnóstico

```bash
# Crear un script rápido
node -e "
import mongoose from 'mongoose';
await mongoose.connect(process.env.MONGODB_URI);
const Monument = mongoose.model('Monument', new mongoose.Schema({}, { strict: false }));
const bad = await Monument.find({ imageUrl: { \$regex: /^[^h]/ } });
console.log('Documentos con URLs mal formateadas:', bad.length);
await mongoose.disconnect();
"
```

---

## 📚 Referencias

- **Código mejorado**: `backend/src/services/s3Service.js`
- **Script de migración**: `backend/src/migrations/fixS3UrlFormats.js`
- **Documentación de Pre-Signed URLs**: `backend/docs/PRESIGNED_URLS.md`

---

## ✅ Checklist

- [ ] Ejecutar `npm run migrate:fix-urls`
- [ ] Verificar que no haya advertencias en los logs
- [ ] Probar que las imágenes carguen en el frontend
- [ ] Probar que los modelos 3D carguen correctamente
- [ ] Ejecutar `npm run test:presigned` para verificar

---

**Última actualización**: Diciembre 11, 2024  
**Versión**: 1.0  
**Autor**: Carlos Asparrín
