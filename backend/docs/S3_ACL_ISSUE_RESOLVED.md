# ✅ Problema de ACL en S3 - RESUELTO

## Resumen

El error 500 al subir imágenes de monumentos e instituciones ha sido **completamente resuelto**.

## Problema Original

```
AccessDenied: User is not authorized to perform: s3:PutObjectAcl
```

## Causa

El código estaba intentando establecer ACLs (`ACL: 'public-read'`) en los archivos subidos a S3, pero:
- El bucket `historiar-storage` tiene "Object Ownership" configurado como "Bucket owner enforced"
- Esta configuración desactiva completamente los ACLs
- El usuario IAM `historiar-dev-local` no tiene permisos para `s3:PutObjectAcl`

## Solución Aplicada

Se eliminaron **todos** los parámetros `ACL: 'public-read'` de las funciones de subida en:

### Archivos Modificados:

1. **`backend/src/services/s3Service.js`**
   - `uploadImageToS3()` - Subida legacy de imágenes
   - `uploadMonumentImageToS3()` - Subida de imágenes de monumentos
   - `uploadModelToS3()` - Subida de modelos 3D
   - `uploadFileToS3()` - Subida genérica de archivos

2. **`backend/src/routes/monuments.routes.js`**
   - Endpoint `/upload-image` - Usa `uploadMonumentImageToS3()`
   - Endpoint `/upload-model` - Usa `uploadModelToS3()`

3. **`backend/src/routes/institutions.routes.js`**
   - Endpoint `/upload-image` - Usa `uploadFileToS3()`

## Estructura de Carpetas en S3

```
historiar-storage/
├── images/
│   ├── monuments/
│   │   └── timestamp_filename.jpg
│   └── institutions/
│       └── institution_id_timestamp.jpg
└── models/
    └── monumentId/
        └── timestamp_model.glb
```

## Verificación

✅ **Test exitoso realizado:**

```bash
node scripts/testImageUpload.js
```

**Resultados:**
- ✅ Subida de imagen a `images/monuments/` - EXITOSA
- ✅ Subida de imagen a `images/institutions/` - EXITOSA
- ✅ URLs públicas accesibles - HTTP 200 OK

## URLs de Ejemplo

Las imágenes subidas son accesibles públicamente:

```
https://historiar-storage.s3.us-east-2.amazonaws.com/images/monuments/test_1765329023309.png
https://historiar-storage.s3.us-east-2.amazonaws.com/images/institutions/institution_test_1765329023309.png
```

## Acceso Público

Los archivos son públicos gracias a la **Bucket Policy** configurada en el bucket, que permite acceso de lectura (`s3:GetObject`) a todos los archivos en las carpetas `images/*` y `models/*`.

## Próximos Pasos

1. ✅ El servidor backend ya está corriendo con el código corregido
2. ✅ Puedes subir imágenes desde el panel admin sin errores
3. ✅ Las imágenes se guardarán en las carpetas correctas:
   - Monumentos: `images/monuments/`
   - Instituciones: `images/institutions/`
4. ✅ Los modelos 3D se guardarán en: `models/{monumentId}/`

## Notas Técnicas

- **No se requieren cambios en AWS Console**
- El código funciona correctamente con "Bucket owner enforced"
- Los archivos son públicos mediante Bucket Policy (no ACLs)
- El usuario IAM solo necesita permisos `s3:PutObject` y `s3:GetObject`

## Estado: ✅ RESUELTO

Fecha: 9 de diciembre de 2025
