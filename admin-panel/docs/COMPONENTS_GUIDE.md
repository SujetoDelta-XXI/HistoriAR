# Guía de Componentes - HistoriAR Admin Panel

Esta guía documenta los componentes principales del panel de administración de HistoriAR, su funcionalidad y uso.

## 📋 Índice

- [Componentes de Autenticación](#componentes-de-autenticación)
- [Componentes de Gestión](#componentes-de-gestión)
- [Componentes de Upload](#componentes-de-upload)
- [Componentes UI Base](#componentes-ui-base)
- [Contextos y Hooks](#contextos-y-hooks)

## 🔐 Componentes de Autenticación

### LoginForm
**Ubicación:** `src/components/LoginForm.jsx`

Formulario de inicio de sesión con características de seguridad avanzadas.

**Características:**
- Validación de credenciales
- Rate limiting (5 intentos máximo)
- Bloqueo temporal de 5 minutos
- Contador visual de intentos
- Feedback en tiempo real

**Props:** Ninguna (usa contexto de autenticación)

**Ejemplo de uso:**
```jsx
import LoginForm from './components/LoginForm';

function App() {
  return !user ? <LoginForm /> : <AdminPanel />;
}
```

## 📊 Componentes de Gestión

### Dashboard
**Ubicación:** `src/components/Dashboard.jsx`

Panel principal con métricas y estadísticas del sistema.

**Características:**
- KPIs principales (usuarios, visitas, sesiones AR)
- Gráficos de tendencias con Recharts
- Alertas importantes
- Ranking de monumentos más visitados
- Distribución por dispositivos y distritos

**Props:** Ninguna

### MonumentsManager
**Ubicación:** `src/components/MonumentsManager.jsx`

Gestión completa de monumentos históricos.

**Características:**
- CRUD completo de monumentos
- Filtros por categoría, estado y búsqueda
- Subida de imágenes y modelos 3D
- Asignación de instituciones y categorías
- Gestión de ubicaciones GPS

**Props:** Ninguna

**Funcionalidades principales:**
- `loadData()` - Carga monumentos, instituciones y categorías
- `handleStatusChange()` - Cambia estado (Disponible/Oculto)
- `handleDelete()` - Elimina monumento con confirmación
- `handleEdit()` - Abre diálogo de edición

### InstitutionsManager
**Ubicación:** `src/components/InstitutionsManager.jsx`

Administración de instituciones asociadas a monumentos.

**Características:**
- Lista de instituciones con filtros
- Creación y edición de instituciones
- Clasificación por tipos
- Información de contacto y ubicación

**Props:** Ninguna

### CategoriesManager
**Ubicación:** `src/components/CategoriesManager.jsx`

Sistema de categorización de monumentos.

**Características:**
- Gestión de categorías temáticas
- Selección de iconos (40+ opciones de Lucide)
- Personalización de colores
- Estadísticas de uso

**Props:** Ninguna

**Iconos disponibles:**
- Arquitectura: Building, Castle, Church, Landmark
- Naturaleza: Mountain, TreePine, Waves, Sun
- Historia: Crown, Shield, Sword, Scroll
- Transporte: Anchor, Plane, Car, Train
- Arte: Camera, Music, Palette
- Y más...

### UsersManager
**Ubicación:** `src/components/UsersManager.jsx`

Administración de usuarios de la aplicación móvil.

**Características:**
- Lista de usuarios con filtros avanzados
- Control de estados (Activo/Suspendido/Eliminado)
- Filtros por rol y distrito
- Estadísticas de actividad
- Sistema de mensajería (en desarrollo)

**Props:** Ninguna

## 📤 Componentes de Upload

### ImageUpload
**Ubicación:** `src/components/ImageUpload.jsx`

Componente especializado para subida de imágenes.

**Características:**
- Drag & drop interface
- Vista previa de imágenes
- Validación de formato (JPEG, PNG, WebP)
- Límite de 10MB
- Integración con Google Cloud Storage
- Barra de progreso

**Props:**
```jsx
ImageUpload.propTypes = {
  onUploadComplete: PropTypes.func,
  onUploadError: PropTypes.func,
  currentImageUrl: PropTypes.string,
  disabled: PropTypes.bool,
};
```

**Ejemplo de uso:**
```jsx
<ImageUpload
  onUploadComplete={(url, filename) => {
    setFormData(prev => ({ ...prev, imageUrl: url }));
  }}
  onUploadError={(error) => {
    console.error('Upload failed:', error);
  }}
  currentImageUrl={monument.imageUrl}
  disabled={isLoading}
/>
```

### ModelUpload
**Ubicación:** `src/components/ModelUpload.jsx`

Componente para subida de modelos 3D.

**Características:**
- Soporte para archivos GLB y GLTF
- Límite de 100MB
- Validación de formato
- Integración con GCS
- Feedback visual de progreso

**Props:**
```jsx
ModelUpload.propTypes = {
  onUploadComplete: PropTypes.func,
  onUploadError: PropTypes.func,
  currentModelUrl: PropTypes.string,
  disabled: PropTypes.bool,
};
```

## 🎨 Componentes UI Base

### Componentes shadcn/ui
**Ubicación:** `src/components/ui/`

Biblioteca de componentes base construida sobre Tailwind CSS.

**Componentes principales:**
- `Button` - Botones con variantes
- `Input` - Campos de entrada
- `Card` - Contenedores de contenido
- `Dialog` - Modales y diálogos
- `Table` - Tablas de datos
- `Badge` - Etiquetas de estado
- `Select` - Selectores dropdown
- `Alert` - Mensajes de alerta
- `Progress` - Barras de progreso

**Ejemplo de uso:**
```jsx
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

<Card>
  <CardHeader>
    <CardTitle>Título</CardTitle>
  </CardHeader>
  <CardContent>
    <Button variant="primary">Acción</Button>
  </CardContent>
</Card>
```

### AppSidebar
**Ubicación:** `src/components/AppSidebar.jsx`

Barra lateral de navegación principal.

**Características:**
- Navegación por secciones
- Indicador de sección activa
- Información del usuario logueado
- Botón de logout
- Diseño responsivo

**Props:**
```jsx
AppSidebar.propTypes = {
  activeView: PropTypes.string.isRequired,
  onViewChange: PropTypes.func.isRequired,
};
```

## 🔧 Contextos y Hooks

### AuthContext
**Ubicación:** `src/contexts/AuthContext.jsx`

Contexto global de autenticación.

**Funcionalidades:**
- Gestión de estado de usuario
- Login/logout
- Validación de tokens
- Verificación de permisos

**API:**
```jsx
const { user, isLoading, login, logout, hasPermission } = useAuth();
```

### useAuth Hook
**Ubicación:** `src/hooks/useAuth.js`

Hook para acceder al contexto de autenticación.

**Uso:**
```jsx
import { useAuth } from '../hooks/useAuth';

function Component() {
  const { user, login, logout } = useAuth();
  
  if (!user) {
    return <LoginForm />;
  }
  
  return <AdminContent />;
}
```

## 🛠️ Servicios

### ApiService
**Ubicación:** `src/services/api.js`

Servicio centralizado para comunicación con el backend.

**Características:**
- Interceptación de errores HTTP
- Manejo automático de autenticación
- Logout automático en tokens expirados
- Configuración por variables de entorno

**Métodos principales:**
```javascript
// Monumentos
apiService.getMonuments(params)
apiService.createMonument(data)
apiService.updateMonument(id, data)
apiService.deleteMonument(id)

// Instituciones
apiService.getInstitutions(params)
apiService.createInstitution(data)
apiService.updateInstitution(id, data)
apiService.deleteInstitution(id)

// Categorías
apiService.getCategories(params)
apiService.createCategory(data)
apiService.updateCategory(id, data)
apiService.deleteCategory(id)

// Usuarios
apiService.getUsers(params)
apiService.updateUser(id, data)
apiService.deleteUser(id)
```

## 📱 Patrones de Uso

### Patrón de Gestión CRUD
```jsx
function EntityManager() {
  const [entities, setEntities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Cargar datos
  useEffect(() => {
    loadData();
  }, []);
  
  const loadData = async () => {
    try {
      setLoading(true);
      const data = await apiService.getEntities();
      setEntities(data.items || data || []);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Filtros
  const filteredEntities = entities.filter(entity => 
    entity.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div>
      <Input 
        placeholder="Buscar..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {/* Tabla o lista de entidades */}
    </div>
  );
}
```

### Patrón de Upload
```jsx
function UploadComponent() {
  const handleUploadComplete = (url, filename) => {
    // Actualizar estado con nueva URL
    setFormData(prev => ({ ...prev, fileUrl: url }));
  };
  
  const handleUploadError = (error) => {
    // Mostrar error al usuario
    setError(error.message);
  };
  
  return (
    <ImageUpload
      onUploadComplete={handleUploadComplete}
      onUploadError={handleUploadError}
      currentImageUrl={currentUrl}
    />
  );
}
```

## 🎯 Mejores Prácticas

### Manejo de Estado
- Usar `useState` para estado local
- Usar contextos para estado global
- Limpiar efectos con cleanup functions

### Manejo de Errores
- Siempre usar try-catch en operaciones async
- Mostrar mensajes de error claros al usuario
- Logging de errores para debugging

### Performance
- Usar `useCallback` para funciones que se pasan como props
- Usar `useMemo` para cálculos costosos
- Implementar loading states

### Accesibilidad
- Usar labels apropiados en formularios
- Implementar navegación por teclado
- Proporcionar feedback visual claro

## 🔄 Ciclo de Vida de Componentes

### Componente de Gestión Típico
1. **Mount:** Cargar datos iniciales
2. **Update:** Responder a cambios de filtros/búsqueda
3. **Actions:** Crear, editar, eliminar entidades
4. **Unmount:** Limpiar subscripciones/timers

### Componente de Upload
1. **Selection:** Usuario selecciona archivo
2. **Validation:** Verificar formato y tamaño
3. **Upload:** Subir a GCS con progreso
4. **Complete:** Actualizar UI con nueva URL

---

**Última actualización:** Diciembre 2024  
**Versión:** 1.0  
**Mantenido por:** Equipo de Desarrollo HistoriAR