# Pruebas de Instituciones - Guía de Verificación

## Cambios Implementados

### 1. ✅ Ruta de Imágenes Corregida
- **Antes**: `images/monuments/{monumentId}/`
- **Ahora**: `images/institutions/{institutionId}/`
- **Componente**: `ImageUpload` ahora acepta prop `entityType`
- **Uso**: `<ImageUpload entityType="institutions" monumentId={institutionId} />`

### 2. ✅ Validación de Horarios Mejorada
- **Backend**: Método `isComplete()` valida que días abiertos tengan `open` y `close`
- **Frontend**: Validación antes de guardar que previene horarios incompletos
- **Mensaje**: Alerta específica indicando qué días tienen problemas

### 3. ✅ Orden de Rutas Corregido
- **Problema**: El endpoint `/upload-image` estaba DESPUÉS de `/:id`, causando que Express lo interpretara como un ID
- **Solución**: Movido `/upload-image` ANTES de las rutas con parámetros dinámicos
- **Archivo**: `backend/src/routes/institutions.routes.js`

## Cómo Probar

### Paso 1: Reiniciar Servidores
```bash
# Detener procesos actuales
# Ctrl+C en ambas terminales

# Backend
cd backend
npm run dev

# Frontend (en otra terminal)
cd admin-panel
npm run dev
```

### Paso 2: Probar Validación de Horarios

1. Ir a "Gestión de Instituciones"
2. Editar una institución existente
3. En la sección de horarios:
   - Desmarcar "Cerrado" en un día (ej: Lunes)
   - NO llenar los campos de hora de apertura y cierre
   - Intentar guardar
4. **Resultado esperado**: Debe mostrar alerta:
   ```
   ⚠️ Error de validación:
   
   Los siguientes días están marcados como abiertos pero no tienen horarios completos:
   Lunes
   
   Por favor, completa los horarios o marca los días como cerrados.
   ```

### Paso 3: Probar Subida de Imágenes

1. Editar una institución
2. Configurar al menos un día con horarios completos:
   - Desmarcar "Cerrado"
   - Abre: 09:00
   - Cierra: 18:00
3. Guardar cambios
4. Subir una imagen
5. **Verificar en GCS**: La imagen debe estar en `images/institutions/{institutionId}/`

### Paso 4: Probar "Hacer Disponible"

1. Con una institución que tenga:
   - ✅ Imagen subida
   - ✅ Al menos un día con horarios completos
2. Click en menú de acciones → "Hacer disponible"
3. **Resultado esperado**: Status cambia a "Disponible"

4. Con una institución que NO tenga imagen o horarios:
   - El botón "Hacer disponible" debe estar deshabilitado
   - Debe mostrar: "(requiere imagen y horarios)"

### Paso 5: Probar Integración con Monumentos

1. Ir a "Gestión de Monumentos"
2. Click en "Nuevo Monumento"
3. En el selector de "Institución":
   - Solo deben aparecer instituciones con status "Disponible"
   - NO deben aparecer instituciones ocultas
4. Seleccionar una institución
5. **Verificar**: Distrito y Dirección se auto-completan

## Validaciones Implementadas

### Backend (`Institution.js`)
```javascript
InstitutionSchema.methods.isComplete = function() {
  // Verificar imagen
  if (!this.imageUrl) return false;
  
  // Verificar horarios: al menos un día abierto con open y close
  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  const hasSchedule = days.some(day => 
    this.schedule[day] && 
    !this.schedule[day].closed && 
    this.schedule[day].open && 
    this.schedule[day].close
  );
  
  return hasSchedule;
};
```

### Frontend (`InstitutionsManager.jsx`)
```javascript
// Validación antes de guardar
const invalidDays = days.filter(day => {
  const schedule = formData.schedule[day];
  return schedule && !schedule.closed && (!schedule.open || !schedule.close);
});

if (invalidDays.length > 0) {
  alert('Error: días con horarios incompletos');
  return;
}
```

## Endpoints Actualizados

### Subida de Imágenes de Instituciones
```
POST /api/institutions/upload-image
Headers: Authorization: Bearer {token}
Body (FormData):
  - image: File
  - monumentId: {institutionId}

Response:
{
  "imageUrl": "https://storage.googleapis.com/.../images/institutions/{id}/...",
  "fileName": "...",
  "size": 12345
}
```

### Listar Instituciones (con filtro)
```
GET /api/institutions?availableOnly=true

Response:
{
  "page": 1,
  "total": 3,
  "items": [
    {
      "_id": "...",
      "name": "...",
      "status": "Disponible",
      "imageUrl": "...",
      "schedule": {...}
    }
  ]
}
```

## Casos de Prueba

| Caso | Imagen | Horarios | Puede ser Disponible | Aparece en Monumentos |
|------|--------|----------|---------------------|----------------------|
| 1    | ✅     | ✅       | ✅ SI               | ✅ SI                |
| 2    | ❌     | ✅       | ❌ NO               | ❌ NO                |
| 3    | ✅     | ❌       | ❌ NO               | ❌ NO                |
| 4    | ❌     | ❌       | ❌ NO               | ❌ NO                |
| 5    | ✅     | Parcial* | ❌ NO               | ❌ NO                |

*Parcial = Días marcados como abiertos pero sin horarios completos

## Archivos Modificados

- ✅ `admin-panel/src/components/ImageUpload.jsx` - Prop `entityType` agregado
- ✅ `admin-panel/src/components/InstitutionsManager.jsx` - Validación de horarios
- ✅ `backend/src/routes/institutions.routes.js` - Endpoint de imágenes
- ✅ `backend/src/models/Institution.js` - Método `isComplete()`

## Próximos Pasos

1. ✅ Reiniciar servidores para aplicar cambios
2. ✅ Probar validación de horarios
3. ✅ Probar subida de imágenes
4. ✅ Verificar ruta en GCS
5. ✅ Probar cambio de estado
6. ✅ Verificar integración con monumentos
