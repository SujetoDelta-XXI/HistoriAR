# Tarea 4: Mejora de la API de Búsqueda y Filtrado del Backend

## Resumen de Implementación

Esta tarea implementa funcionalidades avanzadas de búsqueda y filtrado para monumentos, incluyendo búsqueda por texto con puntuación de relevancia, filtros por distrito, categoría e institución, paginación optimizada y endpoints para opciones de filtro. La implementación incluye pruebas exhaustivas para garantizar la funcionalidad y el rendimiento.

## Cambios Realizados

### 4.1 Implementación de Endpoints de Búsqueda Avanzada

**Archivos modificados:**
- `backend/src/services/monumentService.js`
- `backend/src/controllers/monumentsController.js`
- `backend/src/routes/monuments.routes.js`

#### Nuevos Endpoints

1. **GET /api/monuments/search**
   - Búsqueda avanzada con múltiples filtros
   - Parámetros de consulta: `text`, `district`, `category`, `institution`, `page`, `limit`, `populate`
   - Respuesta paginada con puntuación de relevancia

2. **GET /api/monuments/filter-options**
   - Proporciona opciones disponibles para filtros
   - Retorna distritos, categorías e instituciones únicos
   - Datos ordenados alfabéticamente

#### Funcionalidades de Búsqueda

```javascript
// Búsqueda por texto con puntuación de relevancia
if (text && text.trim()) {
  query.$text = { $search: text.trim() };
  // Ordenamiento por relevancia usando textScore
  mongoQuery = mongoQuery.select({ score: { $meta: 'textScore' } });
  mongoQuery = mongoQuery.sort({ score: { $meta: 'textScore' } });
}

// Filtro por distrito (insensible a mayúsculas)
if (district && district.trim()) {
  query['location.district'] = { $regex: district.trim(), $options: 'i' };
}

// Filtro por categoría
if (category && category.trim()) {
  query.category = category.trim();
}

// Filtro por institución
if (institution && institution.trim()) {
  query.institutionId = institution.trim();
}
```

#### Ejemplo de Uso

```bash
# Búsqueda por texto
GET /api/monuments/search?text=Machu

# Filtro por distrito
GET /api/monuments/search?district=Lima

# Múltiples filtros con paginación
GET /api/monuments/search?text=Casa&district=Lima&category=Colonial&page=2&limit=5

# Con población de referencias
GET /api/monuments/search?text=monument&populate=true
```

### 4.2 Paginación y Optimización de Consultas

**Archivo modificado:** `backend/src/models/Monument.js`

#### Índices Compuestos Añadidos

```javascript
// Índices para optimización de consultas
MonumentSchema.index({ status: 1, category: 1 });
MonumentSchema.index({ status: 1, 'location.district': 1 });
MonumentSchema.index({ status: 1, institutionId: 1 });
MonumentSchema.index({ status: 1, name: 1 }); // Para ordenamiento por defecto
```

#### Beneficios de Optimización

- **Consultas más rápidas:** Índices compuestos mejoran el rendimiento
- **Filtrado eficiente:** Combinación de status con otros campos
- **Ordenamiento optimizado:** Índice específico para ordenamiento por nombre
- **Escalabilidad:** Preparado para grandes volúmenes de datos

#### Paginación Integrada

```javascript
// Uso de utilidad de paginación existente
const { skip, limit, page } = bu