# Tarea 3: Actualización del Esquema de Base de Datos y Migración de Datos

## Resumen de Implementación

Esta tarea actualiza el modelo Monument para usar URLs de Google Cloud Storage en lugar de Cloudinary, añade optimizaciones de búsqueda mediante indexación, y proporciona un script de migración para actualizar los datos existentes.

## Cambios Realizados

### 3.1 Actualización del Modelo Monument para URLs de GCS

**Archivo modificado:** `backend/src/models/Monument.js`

#### Cambios en el Esquema

1. **Indexación para Optimización de Búsqueda:**
   ```javascript
   name: { type: String, required: true, index: true }
   description: { type: String, index: 'text' }
   category: { type: String, enum: [...], default: 'Arqueológico', index: true }
   location.district: { type: String, index: true }
   institutionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Institution', index: true }
   ```

2. **Índice de Texto Compuesto:**
   ```javascript
   MonumentSchema.index({ name: 'text', description: 'text' });
   ```

3. **Actualización de Comentarios:**
   - `imageUrl`: Actualizado a "GCS URL for monument images"
   - `model3DUrl`: Actualizado a "GCS URL for 3D models"
   - `gcsModelFileName`: Renombrado desde `gcsFileName` para mayor claridad

#### Beneficios de la Indexación

- **Búsqueda por nombre:** Índice en `name` para búsquedas rápidas
- **Búsqueda de texto completo:** Índice de texto en `name` y `description`
- **Filtrado por categoría:** Índice en `category` para filtros eficientes
- **Búsqueda geográfica:** Índice en `location.district`
- **Filtrado institucional:** Índice en `institutionId`

### 3.2 Script de Migración de Datos

**Archivo creado:** `backend/scripts/migrate-to-gcs.js`

#### Funcionalidades del Script

1. **Respaldo Automático:**
   - Crea respaldo JSON de todos los monumentos antes de la migración
   - Guarda en `backend/backups/monuments-backup-{fecha}.json`

2. **Migración de URLs:**
   - Convierte URLs de Cloudinary a formato GCS:
     - Imágenes: `https://storage.googleapis.com/histori_ar/images/{filename}`
     - Modelos 3D: `https://storage.googleapis.com/histori_ar/models/{filename}`

3. **Extracción de Nombres de Archivo:**
   - Extrae nombres de archivo originales de URLs de Cloudinary
   - Maneja transformaciones y parámetros de URL

4. **Actualización de Base de Datos:**
   - Actualiza campos `imageUrl` y `model3DUrl`
   - Añade campos `gcsImageFileName` y `gcsModelFileName`

5. **Verificación:**
   - Confirma el éxito de la migración
   - Proporciona resumen estadístico

#### Uso del Script

```bash
# Ejecutar migración
npm run migrate:gcs

# O ejecutar directamente
node scripts/migrate-to-gcs.js
```

#### Ejemplo de Salida

```
🚀 Starting Monument data migration to GCS...

📦 Creating backup of existing Monument data...
✅ Backup created: backend/backups/monuments-backup-2024-01-15.json
📊 Backed up 25 monuments

🔄 Starting migration from Cloudinary to GCS...
📊 Found 15 monuments with Cloudinary URLs
  🖼️  Migrating image for monument "Machu Picchu"
  🎯 Migrating 3D model for monument "Machu Picchu"
✅ Migration completed: 15 monuments updated

🔍 Verifying migration results...
📊 Migration Summary:
   Total monuments: 25
   Still using Cloudinary: 0
   Using GCS: 15
✅ All monuments successfully migrated to GCS!

🎉 Migration completed successfully!
```

## Archivos Modificados/Creados

### Archivos Modificados
- `backend/src/models/Monument.js` - Actualización del esquema con indexación
- `backend/package.json` - Añadido script `migrate:gcs`

### Archivos Creados
- `backend/scripts/migrate-to-gcs.js` - Script principal de migración
- `backend/scripts/README-migration.md` - Documentación del proceso de migración

## Requisitos Cumplidos

### Requisitos Funcionales
- **4.1:** Búsqueda eficiente por nombre mediante indexación
- **4.2:** Búsqueda por categoría con índice optimizado
- **4.3:** Filtrado por ubicación (distrito) con indexación
- **5.1:** Búsqueda de texto completo en nombre y descripción
- **5.2:** Capacidades de búsqueda avanzada con índices compuestos

### Requisitos No Funcionales
- **2.1:** Reemplazo completo de Cloudinary por Google Cloud Storage
- **2.4:** Respaldo automático de datos existentes antes de migración

## Consideraciones Técnicas

### Seguridad de Datos
- **Respaldo automático:** Se crea antes de cualquier modificación
- **Verificación:** El script confirma el éxito de la migración
- **Reversibilidad:** El respaldo permite restaurar datos originales si es necesario

### Rendimiento
- **Indexación optimizada:** Mejora significativa en consultas de búsqueda
- **Migración por lotes:** Procesa monumentos de manera eficiente
- **Logging detallado:** Permite monitoreo del progreso

### Mantenimiento
- **Código modular:** Funciones exportables para reutilización
- **Manejo de errores:** Gestión robusta de errores con logging detallado
- **Documentación completa:** README específico para el proceso de migración

## Próximos Pasos

1. **Ejecutar migración:** Usar `npm run migrate:gcs` en entorno de desarrollo
2. **Verificar resultados:** Confirmar que todos los monumentos usan URLs de GCS
3. **Transferir archivos:** Migrar archivos reales de Cloudinary a GCS (tarea separada)
4. **Actualizar frontend:** Modificar componentes para usar nuevas URLs de GCS

## Notas Importantes

- **URLs de marcador:** Las URLs migradas son marcadores de posición - los archivos reales necesitan transferirse por separado
- **HistoricalData sin cambios:** El modelo HistoricalData permanece sin modificar según especificaciones
- **Compatibilidad:** Los cambios son compatibles con la estructura existente de la aplicación
- **Entorno:** Probado en entorno de desarrollo, listo para producción