# HistoriAR Admin Panel

Panel de administración web para la gestión de contenido de la aplicación HistoriAR - Sistema de monumentos históricos con realidad aumentada.

## 🚀 Características

- **Interfaz moderna** construida con React 18 + Vite
- **Autenticación segura** con JWT y rate limiting
- **Gestión completa** de monumentos, instituciones, categorías y usuarios
- **Subida de archivos** con drag & drop para imágenes y modelos 3D
- **Dashboard analítico** con métricas y estadísticas
- **Diseño responsivo** con Tailwind CSS
- **Componentes UI** personalizados con shadcn/ui
- **Validación en tiempo real** de formularios

## 📋 Requisitos Previos

- Node.js 18+
- npm o yarn
- Backend de HistoriAR ejecutándose

## 🛠️ Instalación

1. **Clonar el repositorio**
```bash
git clone <repository-url>
cd admin-panel
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
cp .env.example .env
```

Editar `.env`:
```env
# API Configuration
VITE_API_BASE_URL=http://localhost:4000/api

# Development
VITE_NODE_ENV=development
```

4. **Iniciar en desarrollo**
```bash
npm run dev
```

## 🚀 Uso

### Desarrollo
```bash
npm run dev
```
Abre [http://localhost:5173](http://localhost:5173)

### Construcción para Producción
```bash
npm run build
```

### Vista previa de producción
```bash
npm run preview
```

## 🔐 Acceso al Sistema

### Credenciales de Administrador
Para acceder al panel, necesitas una cuenta con rol `admin`. Las credenciales deben ser proporcionadas por el administrador del sistema.

### Características de Seguridad
- **Rate Limiting**: Máximo 5 intentos de login, bloqueo de 5 minutos
- **Validación de tokens**: Verificación automática contra el servidor
- **Logout automático**: Sesiones expiradas se detectan y limpian
- **Protección de rutas**: Solo usuarios admin pueden acceder

## 📊 Funcionalidades

### Dashboard Principal
- Métricas de usuarios activos y visitas
- Estadísticas de sesiones AR
- Gráficos de tendencias temporales
- Alertas y notificaciones importantes

### Gestión de Monumentos
- CRUD completo de monumentos
- Subida de imágenes y modelos 3D
- Asignación de categorías e instituciones
- Gestión de ubicaciones y coordenadas

### Gestión de Instituciones
- Administración de instituciones asociadas
- Información de contacto y ubicación
- Clasificación por tipos

### Gestión de Categorías
- Sistema de categorización flexible
- Iconos personalizables (50+ opciones)
- Colores temáticos
- Descripción y metadatos

### Gestión de Usuarios
- Lista de usuarios de la app móvil
- Control de estados (activo/suspendido)
- Filtros por rol y distrito
- Estadísticas de actividad

## 🎨 Tecnologías Utilizadas

### Frontend
- **React 18** - Biblioteca de UI
- **Vite** - Build tool y dev server
- **Tailwind CSS** - Framework de estilos
- **shadcn/ui** - Componentes UI
- **Lucide React** - Iconos
- **Recharts** - Gráficos y visualizaciones

### Herramientas de Desarrollo
- **ESLint** - Linting de código
- **PostCSS** - Procesamiento de CSS
- **Autoprefixer** - Prefijos CSS automáticos

## 📁 Estructura del Proyecto

```
admin-panel/
├── src/
│   ├── components/      # Componentes React
│   │   ├── ui/         # Componentes base (shadcn/ui)
│   │   ├── *Manager.jsx # Gestores de entidades
│   │   └── ...
│   ├── contexts/       # Contextos de React
│   ├── hooks/          # Hooks personalizados
│   ├── services/       # Servicios API
│   ├── utils/          # Utilidades
│   └── assets/         # Recursos estáticos
├── docs/               # Documentación
└── public/             # Archivos públicos
```

## 🔒 Seguridad Implementada

### Autenticación
- Validación JWT con el backend
- Verificación de rol admin obligatoria
- Tokens con expiración automática

### Rate Limiting
- Máximo 5 intentos de login fallidos
- Bloqueo temporal de 5 minutos
- Persistencia en localStorage
- Contador visual de intentos

### Protección de Datos
- Interceptación de errores 401/403
- Logout automático en tokens inválidos
- Limpieza de datos sensibles
- Validación de permisos por vista

## 🧪 Testing

```bash
# Ejecutar tests (cuando estén implementados)
npm test

# Linting
npm run lint
```

## 📖 Documentación Adicional

- [Implementación de Tareas](docs/TASK_5_IMPLEMENTATION.md)
- [Mejoras de Seguridad](docs/SECURITY_IMPROVEMENTS.md)
- [Guía de Componentes](docs/COMPONENTS_GUIDE.md)

## 🤝 Contribución

1. Fork el proyecto
2. Crear rama de feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -am 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crear Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.
