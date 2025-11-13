# Mejoras en el Sistema de Instituciones

## Resumen de Cambios

Se han implementado mejoras significativas en el sistema de gestión de instituciones para hacerlo más robusto y funcional.

## Cambios Implementados

### 1. Modelo de Datos (Backend)

**Archivo:** `backend/src/models/Institution.js`

- ✅ **Campo `status`**: Agregado con valores `'Disponible'`, `'Oculto'`, `'Borrado'` (default: `'Oculto'`)
- ✅ **Reestructuración de `location`**: 
  - Movido `district` y `address` dentro de `location`
  - Agregados campos `lat` y `lng` para coordenadas GPS
  - Campo `radius` para definir el área de cobertura
- ✅ **Horarios por defecto**: Todos los días del `schedule` ahora tienen `{ closed: true }` por defecto
- ✅ **Método `isComplete()`**: Verifica si la institución tiene imagen y al menos un día con horario configurado

### 2. API y Rutas (Backend)

**Archivo:** `backend/src/routes/institutions.routes.js`

- ✅ **Endpoint de subida de imágenes**: `POST /api/institutions/upload-image`
  - Sube imágenes a GCS en la ruta: `images/institutions/{institutionId}/`
  - Requiere autenticación y rol de admin

**Archivo:** `backend/src/services/institutionService.js`

- ✅ **Filtro `availableOnly`**: Permite obtener solo instituciones con status `'Disponible'`

**Archivo:** `backend/src/controllers/institutionsController.js`

- ✅ **Soporte de query param**: `?availableOnly=true` para filtrar instituciones disponibles

### 3. Interfaz de Usuario (Frontend)

**Archivo:** `admin-panel/src/components/InstitutionsManager.jsx`

#### Funcionalidades Agregadas:

- ✅ **Gestión de Estados**:
  - Filtro por estado (Disponible, Oculto, Borrado)
  - Cambio de estado desde el menú de acciones
  - Validación: solo se puede hacer disponible si tiene imagen y horarios completos

- ✅ **Campos de Ubicación**:
  - Latitud y Longitud en el formulario
  - Auto-completado de distrito y dirección desde institución en monumentos

- ✅ **Gestión de Horarios**:
  - Editor de horarios por día de la semana
  - Checkbox para marcar días como "Cerrado"
  - Inputs de tipo `time` para hora de apertura y cierre
  - Solo visible al editar (no al crear)

- ✅ **Subida de Imágenes**:
  - Integración con componente `ImageUpload`
  - Solo visible al editar (no al crear)
  - Ruta en GCS: `images/institutions/{institutionId}/`

- ✅ **Estadísticas Mejoradas**:
  - Total de instituciones
  - Instituciones disponibles
  - Instituciones ocultas
  - Total de museos

- ✅ **Mensajes Informativos**:
  - Al crear: indica que debe agregar imagen y horarios
  - En el botón "Hacer disponible": muestra requisitos faltantes

### 4. Integración con Monumentos

**Archivo:** `admin-panel/src/components/MonumentsManager.jsx`

- ✅ **Filtro de instituciones**: Solo muestra instituciones con status `'Disponible'` en el selector
- ✅ **Auto-completado**: Al seleccionar una institución, se completan automáticamente:
  - Distrito
  - Dirección

### 5. Migración de Datos

**Archivo:** `backend/src/migrations/updateInstitutionSchema.js`

Script de migración que:
- ✅ Agrega campo `status: 'Oculto'` a instituciones existentes
- ✅ Mueve `district` y `address` a `location.district` y `location.address`
- ✅ Asegura que todos los días del `schedule` tengan valores por defecto

**Ejecutar migración:**
```bash
cd backend
node src/migrations/updateInstitutionSchema.js
```

## Flujo de Trabajo

### Crear Nueva Institución

1. Click en "Nueva Institución"
2. Completar datos básicos:
   - Nombre (requerido)
   - Tipo (Museo, Universidad, Municipalidad, Otro)
   - Distrito, Dirección
   - Latitud, Longitud
   - Contacto (email, teléfono, website)
   - Descripción
3. Guardar (se crea con status `'Oculto'`)
4. Mensaje: "Edita la institución para agregar imagen y horarios"

### Editar Institución

1. Click en "Editar" en el menú de acciones
2. Completar información adicional:
   - **Horarios de Atención**: Configurar días y horarios
   - **Imagen**: Subir imagen de la institución
3. Guardar cambios

### Hacer Disponible

1. Una vez que la institución tenga:
   - ✅ Imagen subida
   - ✅ Al menos un día con horario configurado
2. Click en "Hacer disponible" en el menú de acciones
3. La institución ahora aparecerá en el selector de monumentos

## Validaciones

### Para hacer una institución disponible:

- ✅ Debe tener una imagen subida
- ✅ Debe tener al menos un día con horario configurado (no cerrado)

### Para crear un monumento:

- ✅ Solo se pueden seleccionar instituciones con status `'Disponible'`

## Estructura de Datos

### Modelo Institution

```javascript
{
  name: String,
  type: String, // 'Museo', 'Universidad', 'Municipalidad', 'Otro'
  description: String,
  contactEmail: String,
  phone: String,
  website: String,
  imageUrl: String,
  status: String, // 'Disponible', 'Oculto', 'Borrado'
  location: {
    lat: Number,
    lng: Number,
    address: String,
    district: String,
    radius: Number // metros
  },
  schedule: {
    monday: { open: String, close: String, closed: Boolean },
    tuesday: { open: String, close: String, closed: Boolean },
    // ... resto de días
  }
}
```

## Archivos Modificados

### Backend
- `backend/src/models/Institution.js`
- `backend/src/routes/institutions.routes.js`
- `backend/src/services/institutionService.js`
- `backend/src/controllers/institutionsController.js`
- `backend/src/migrations/updateInstitutionSchema.js` (nuevo)

### Frontend
- `admin-panel/src/components/InstitutionsManager.jsx`
- `admin-panel/src/components/MonumentsManager.jsx`

## Próximos Pasos

1. Ejecutar la migración de datos
2. Probar la creación y edición de instituciones
3. Verificar la subida de imágenes
4. Configurar horarios de atención
5. Probar el cambio de estados
6. Verificar la integración con monumentos
