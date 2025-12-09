# ✅ Checklist de Migración GCS → S3

## Estado: COMPLETADO ✅

---

## Fase 1: Preparación ✅

- [x] Crear bucket S3 en AWS (`historiar-storage`)
- [x] Configurar usuario IAM con permisos S3
- [x] Obtener credenciales AWS (Access Key ID, Secret Access Key)
- [x] Configurar política del bucket para lectura pública
- [x] Desactivar Block Public Access
- [x] Actualizar `.env` con credenciales AWS
- [x] Actualizar `.env.example` con variables AWS

## Fase 2: Instalación de Dependencias ✅

- [x] Instalar `@aws-sdk/client-s3`
- [x] Instalar `@aws-sdk/lib-storage`
- [x] Eliminar `@google-cloud/storage` de package.json
- [x] Ejecutar `npm install`

## Fase 3: Implementación de Código ✅

### Configuración
- [x] Crear `src/config/s3.js`
- [x] Implementar `initializeS3Client()`
- [x] Implementar `verifyS3Connection()`
- [x] Implementar `getS3Client()`
- [x] Implementar `getBucketName()` y `getRegion()`

### Servicio S3
- [x] Crear `src/services/s3Service.js`
- [x] Implementar `uploadImageToS3()`
- [x] Implementar `uploadModelToS3()`
- [x] Implementar `uploadFileToS3()`
- [x] Implementar `deleteFileFromS3()`
- [x] Implementar `deleteMonumentFiles()`
- [x] Implementar `listMonumentFiles()`
- [x] Implementar helpers: `getS3Url()`, `extractKeyFromUrl()`
- [x] Implementar `handleS3Error()` para manejo de errores
- [x] Eliminar todas las referencias a ACL

### Controladores
- [x] Actualizar `controllers/monumentsController.js`
- [x] Actualizar `controllers/historicalDataController.js`
- [x] Reemplazar imports de gcsService por s3Service
- [x] Actualizar llamadas a funciones de servicio

### Rutas
- [x] Actualizar `routes/uploads.routes.js`
- [x] Actualizar `routes/monuments.routes.js`
- [x] Actualizar `routes/institutions.routes.js`
- [x] Actualizar `routes/health.routes.js`

### Servicios
- [x] Actualizar `services/monumentService.js`
- [x] Actualizar `services/tiles3DService.js`
- [x] Renombrar `uploadTilesToGCS` → `uploadTilesToS3`

### Modelos
- [x] Actualizar `models/Monument.js`
  - [x] Renombrar `gcsImageFileName` → `s3ImageFileName`
  - [x] Renombrar `gcsModelFileName` → `s3ModelFileName`
  - [x] Actualizar comentarios de "GCS URL" a "S3 URL"
- [x] Actualizar `models/HistoricalData.js`
  - [x] Renombrar `gcsImageFileName` → `s3ImageFileName`
  - [x] Actualizar comentarios

## Fase 4: Configuración del Servidor ✅

- [x] Actualizar `src/server.js`
- [x] Reemplazar import de gcs por s3
- [x] Cambiar `verifyGCSConnection()` por `verifyS3Connection()`
- [x] Actualizar inicialización de estructura de carpetas

## Fase 5: Scripts y Utilidades ✅

- [x] Actualizar `scripts/verifyConfig.js`
- [x] Crear `scripts/testS3Upload.js`
- [x] Agregar script `test:s3` en package.json
- [x] Renombrar archivos GCS a `.backup`
  - [x] `config/gcs.js` → `config/gcs.js.backup`
  - [x] `services/gcsService.js` → `services/gcsService.js.backup`

## Fase 6: Documentación ✅

- [x] Actualizar `README.md`
- [x] Crear `docs/S3_SETUP.md`
- [x] Crear `docs/MIGRATION_GUIDE.md`
- [x] Crear `docs/MIGRATION_STATUS.md`
- [x] Crear `docs/S3_MIGRATION_COMPLETE.md`
- [x] Crear `docs/MIGRACION_COMPLETA_ES.md`
- [x] Crear `MIGRATION_CHECKLIST.md`

## Fase 7: Pruebas ✅

### Pruebas Automatizadas
- [x] Ejecutar `npm run verify` - PASÓ ✅
- [x] Ejecutar `npm run test:s3` - PASÓ ✅
- [x] Iniciar servidor sin errores - PASÓ ✅
- [x] Verificar conexión a S3 - PASÓ ✅
- [x] Verificar subida de archivos - PASÓ ✅
- [x] Verificar accesibilidad pública - PASÓ ✅
- [x] Verificar eliminación de archivos - PASÓ ✅

### Verificación de Código
- [x] Sin errores de diagnóstico
- [x] Sin referencias a GCS en código activo
- [x] Sin referencias a ACL
- [x] Sin imports no utilizados
- [x] Todos los campos renombrados correctamente

## Fase 8: Próximos Pasos (Pendiente)

### Pruebas Manuales (Recomendado)
- [ ] Iniciar admin panel
- [ ] Subir imagen a monumento
- [ ] Subir modelo 3D
- [ ] Verificar URLs de S3
- [ ] Eliminar monumento con archivos
- [ ] Probar desde app móvil

### Migración de Datos (Si aplica)
- [ ] Crear script `scripts/migrateGCStoS3.js`
- [ ] Ejecutar migración en modo dry-run
- [ ] Ejecutar migración real
- [ ] Verificar integridad de datos
- [ ] Actualizar URLs en MongoDB

### Despliegue a Producción
- [ ] Configurar variables en Vercel:
  - [ ] `AWS_ACCESS_KEY_ID`
  - [ ] `AWS_SECRET_ACCESS_KEY`
  - [ ] `AWS_REGION`
  - [ ] `S3_BUCKET`
- [ ] Desplegar con `vercel --prod`
- [ ] Verificar funcionalidad en producción
- [ ] Monitorear logs por 24 horas

### Limpieza (Después de producción)
- [ ] Eliminar `config/gcs.js.backup`
- [ ] Eliminar `services/gcsService.js.backup`
- [ ] Eliminar `scripts/setup-gcs.js`
- [ ] Eliminar `scripts/migrate-to-gcs.js`
- [ ] Planificar eliminación de bucket GCS (30 días)

---

## 📊 Resumen de Estado

| Categoría | Estado | Progreso |
|-----------|--------|----------|
| Configuración AWS | ✅ Completo | 100% |
| Instalación de Dependencias | ✅ Completo | 100% |
| Implementación de Código | ✅ Completo | 100% |
| Actualización de Modelos | ✅ Completo | 100% |
| Scripts y Utilidades | ✅ Completo | 100% |
| Documentación | ✅ Completo | 100% |
| Pruebas Automatizadas | ✅ Completo | 100% |
| Pruebas Manuales | ⏳ Pendiente | 0% |
| Migración de Datos | ⏳ Pendiente | 0% |
| Despliegue a Producción | ⏳ Pendiente | 0% |

**Progreso Total: 80% (Backend completo, falta testing manual y producción)**

---

## 🎯 Criterios de Éxito

### Completados ✅
- [x] Servidor inicia sin errores
- [x] Conexión a S3 verificada
- [x] Subida de archivos funciona
- [x] Archivos son públicamente accesibles
- [x] Eliminación de archivos funciona
- [x] Sin errores de ACL
- [x] Sin referencias a GCS en código activo
- [x] Todos los campos renombrados
- [x] Documentación completa

### Pendientes
- [ ] Admin panel funciona correctamente
- [ ] App móvil funciona correctamente
- [ ] Archivos existentes migrados (si aplica)
- [ ] Producción desplegada exitosamente
- [ ] Sin errores en producción por 24 horas

---

## 📝 Notas Importantes

### Versionado de Modelos
Los endpoints de versionado retornan 501 (Not Implemented). Esto es esperado y no afecta la funcionalidad actual.

### Archivos de Respaldo
Los archivos `.backup` se mantienen para rollback si es necesario. Eliminar solo después de verificar producción.

### Bucket Policy
El bucket usa "Bucket owner enforced" ownership, por lo que no se usan ACLs. La política del bucket permite lectura pública.

---

## 🚀 Comando Rápido de Verificación

```bash
# Verificar todo está funcionando
cd backend
npm run verify && npm run test:s3 && npm start
```

Si todos los comandos pasan sin errores, ¡la migración está completa! ✅

---

**Última Actualización**: 7 de Diciembre, 2024  
**Estado**: ✅ MIGRACIÓN COMPLETA - LISTO PARA PRODUCCIÓN
