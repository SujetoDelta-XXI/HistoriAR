# Propuesta: Sistema de Información Histórica de Monumentos

## Resumen
Sistema para gestionar múltiples entradas de información histórica por monumento, cada una con su propia imagen y texto descriptivo.

## Arquitectura

### 1. Modelo de Datos

#### HistoricalData (actualizado)
```javascript
{
  monumentId: ObjectId,        // Referencia al monumento
  title: String,               // Título de la información (ej: "Descubrimiento", "Cultura Inca")
  description: String,         // Texto descriptivo
  imageUrl: String,            // URL de la imagen principal
  gcsImageFileName: String,    // Nombre del archivo en GCS para eliminación
  discoveryInfo: String,       // Información de descubrimiento
  oldImages: [String],         // Imágenes adicionales (galería)
  activities: [String],        // Actividades relacionadas
  sources: [String],           // Fuentes de información
  createdBy: ObjectId,         // Usuario que creó la entrada
  order: Number,               // Orden de visualización
  createdAt: Date,
  updatedAt: Date
}
```

### 2. Estructura de Archivos GCS

```
images/
  └── monuments/
      └── {monumentId}/
          ├── {timestamp}_image1.jpg
          ├── {timestamp}_image2.jpg
          └── ...
```

### 3. Endpoints Backend

#### Obtener todas las entradas de información de un monumento
```
GET /api/monuments/:monumentId/historical-data
Response: [{ id, title, description, imageUrl, order, createdAt }]
```

#### Crear nueva entrada de información
```
POST /api/monuments/:monumentId/historical-data
Body: { title, description }
File: image (multipart/form-data)
Response: { id, title, description, imageUrl, ... }
```

#### Actualizar entrada de información
```
PUT /api/monuments/:monumentId/historical-data/:id
Body: { title, description }
File: image (opcional, multipart/form-data)
Response: { id, title, description, imageUrl, ... }
```

#### Eliminar entrada de información
```
DELETE /api/monuments/:monumentId/historical-data/:id
Response: { message: "Historical data deleted successfully" }
```

#### Reordenar entradas
```
PUT /api/monuments/:monumentId/historical-data/reorder
Body: [{ id, order }]
Response: { message: "Order updated successfully" }
```

### 4. Interfaz de Usuario: "Información Monumentos"

#### Vista Principal (Monument List)
```
┌─────────────────────────────────────────────────────────┐
│ Información de Monumentos                               │
├─────────────────────────────────────────────────────────┤
│ 🔍 Buscar monumentos...                                 │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  📷 Machu Picchu                    [3 entradas] →      │
│  📷 Sacsayhuamán                    [1 entrada]  →      │
│  📷 Qorikancha                      [0 entradas] →      │
│  📷 Chan Chan                       [5 entradas] →      │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

#### Vista de Gestión (Historical Data Manager)
```
┌─────────────────────────────────────────────────────────┐
│ ← Volver | Machu Picchu - Información Histórica        │
├─────────────────────────────────────────────────────────┤
│ [+ Agregar Nueva Información]                           │
├─────────────────────────────────────────────────────────┤
│                                                          │
│ ┌─────────────────────────────────────────────────┐    │
│ │ 📷 [Imagen]  Descubrimiento                     │    │
│ │              Hiram Bingham descubrió...         │    │
│ │              [Editar] [Eliminar] [↑] [↓]        │    │
│ └─────────────────────────────────────────────────┘    │
│                                                          │
│ ┌─────────────────────────────────────────────────┐    │
│ │ 📷 [Imagen]  Cultura Inca                       │    │
│ │              Construido durante el imperio...   │    │
│ │              [Editar] [Eliminar] [↑] [↓]        │    │
│ └─────────────────────────────────────────────────┘    │
│                                                          │
│ ┌─────────────────────────────────────────────────┐    │
│ │ 📷 [Imagen]  Arquitectura                       │    │
│ │              Las terrazas agrícolas...          │    │
│ │              [Editar] [Eliminar] [↑] [↓]        │    │
│ └─────────────────────────────────────────────────┘    │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

#### Formulario de Creación/Edición
```
┌─────────────────────────────────────────────────────────┐
│ Agregar Información Histórica                           │
├─────────────────────────────────────────────────────────┤
│                                                          │
│ Título *                                                │
│ ┌─────────────────────────────────────────────────┐    │
│ │ Descubrimiento                                  │    │
│ └─────────────────────────────────────────────────┘    │
│                                                          │
│ Descripción *                                           │
│ ┌─────────────────────────────────────────────────┐    │
│ │ Hiram Bingham descubrió Machu Picchu en 1911...│    │
│ │                                                 │    │
│ │                                                 │    │
│ └─────────────────────────────────────────────────┘    │
│                                                          │
│ Imagen *                                                │
│ ┌─────────────────────────────────────────────────┐    │
│ │  📤 Arrastra una imagen o haz clic para subir  │    │
│ │     Formatos: JPG, PNG • Máximo: 5MB           │    │
│ └─────────────────────────────────────────────────┘    │
│                                                          │
│ [Cancelar]                    [Guardar Información]     │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

### 5. Componentes React

#### HistoricalDataManager.jsx
- Vista principal con lista de monumentos
- Búsqueda y filtrado
- Navegación a vista de gestión

#### HistoricalDataEditor.jsx
- Lista de entradas de información histórica
- Botones de acción (crear, editar, eliminar, reordenar)
- Drag & drop para reordenar

#### HistoricalDataForm.jsx
- Formulario para crear/editar entrada
- Upload de imagen con preview
- Validación de campos

#### ImageUpload.jsx (reutilizable)
- Ya existe, se puede reutilizar
- Drag & drop de imágenes
- Preview y validación

### 6. Flujo de Usuario

1. **Ver monumentos**: Usuario ve lista de todos los monumentos con contador de entradas
2. **Seleccionar monumento**: Click en un monumento para ver sus entradas de información
3. **Crear entrada**: Click en "Agregar Nueva Información"
   - Llenar título y descripción
   - Subir imagen
   - Guardar
4. **Editar entrada**: Click en "Editar" de una entrada existente
   - Modificar título/descripción
   - Cambiar imagen (opcional)
   - Guardar
5. **Eliminar entrada**: Click en "Eliminar" con confirmación
6. **Reordenar**: Usar flechas ↑↓ o drag & drop para cambiar orden

### 7. Endpoint para App Móvil

```
GET /api/mobile/monuments/:id/complete
Response: {
  monument: {
    id, name, description, imageUrl, model3DUrl, location, culture, period
  },
  historicalData: [
    { id, title, description, imageUrl, order },
    { id, title, description, imageUrl, order },
    ...
  ]
}
```

## Beneficios

1. **Flexibilidad**: Sin límite de entradas de información por monumento
2. **Organización**: Cada entrada tiene su propia imagen y texto
3. **Escalabilidad**: Fácil agregar más campos en el futuro
4. **Consistencia**: Misma estructura de archivos que los modelos 3D
5. **UX**: Interfaz intuitiva similar a ARExperiencesManager

## Notas Técnicas

- Las imágenes se almacenan en `images/monuments/{monumentId}/`
- Cada entrada de HistoricalData tiene su propia imagen
- El campo `order` permite ordenar las entradas para la app móvil
- El campo `createdBy` permite auditoría de quién creó cada entrada
- Las imágenes antiguas se mantienen en `oldImages` para compatibilidad
