# HistoriAR Backend API

Backend API para la aplicación HistoriAR - Sistema de gestión de monumentos históricos con realidad aumentada.

## 🚀 Características

- **API RESTful** completa para gestión de monumentos, instituciones, categorías y usuarios
- **Autenticación JWT** con roles y permisos
- **Integración con Google Cloud Storage** para archivos multimedia
- **Base de datos MongoDB** con Mongoose ODM
- **Validación de datos** con express-validator
- **Subida de archivos** con soporte para imágenes y modelos 3D
- **Sistema de búsqueda** avanzado con filtros
- **Middleware de seguridad** robusto

## 📋 Requisitos Previos

- Node.js 18+ 
- MongoDB 6.0+
- Cuenta de Google Cloud Platform con Storage habilitado
- npm o yarn

## 🛠️ Instalación

1. **Clonar el repositorio**
```bash
git clone <repository-url>
cd backend
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
cp .env.example .env
```

Editar `.env` con tus configuraciones:
```env
# Base de datos
MONGODB_URI=mongodb://localhost:27017/historiar

# JWT
JWT_SECRET=tu_jwt_secret_muy_seguro

# Google Cloud Storage
GOOGLE_CLOUD_PROJECT_ID=tu-proyecto-gcp
GOOGLE_CLOUD_BUCKET_NAME=tu-bucket-gcs
GOOGLE_APPLICATION_CREDENTIALS=path/to/service-account.json

# Servidor
PORT=4000
NODE_ENV=development
```

4. **Configurar Google Cloud Storage**
- Crear un bucket en GCS
- Configurar permisos públicos (ver `docs/GCS_SETUP.md`)
- Descargar credenciales de service account

5. **Inicializar base de datos**
```bash
npm run seed
```

## 🚀 Uso

### Desarrollo
```bash
npm run dev
```

### Producción
```bash
npm start
```

### Testing
```bash
npm test
```

## 📚 API Endpoints

### Autenticación
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/register` - Registrar usuario
- `GET /api/auth/validate` - Validar token

### Monumentos
- `GET /api/monuments` - Listar monumentos
- `GET /api/monuments/:id` - Obtener monumento
- `POST /api/monuments` - Crear monumento (admin)
- `PUT /api/monuments/:id` - Actualizar monumento (admin)
- `DELETE /api/monuments/:id` - Eliminar monumento (admin)
- `GET /api/monuments/search` - Búsqueda avanzada

### Instituciones
- `GET /api/institutions` - Listar instituciones
- `POST /api/institutions` - Crear institución (admin)
- `PUT /api/institutions/:id` - Actualizar institución (admin)
- `DELETE /api/institutions/:id` - Eliminar institución (admin)

### Categorías
- `GET /api/categories` - Listar categorías
- `POST /api/categories` - Crear categoría (admin)
- `PUT /api/categories/:id` - Actualizar categoría (admin)
- `DELETE /api/categories/:id` - Eliminar categoría (admin)

### Usuarios
- `GET /api/users` - Listar usuarios (admin)
- `PUT /api/users/:id` - Actualizar usuario (admin)
- `DELETE /api/users/:id` - Eliminar usuario (admin)

### Uploads
- `POST /api/uploads/image` - Subir imagen (admin)
- `POST /api/uploads/model` - Subir modelo 3D (admin)
- `DELETE /api/uploads/file/:filename` - Eliminar archivo (admin)

## 🔒 Seguridad

### Autenticación y Autorización
- **JWT Tokens** con expiración configurable
- **Roles de usuario**: `user`, `admin`
- **Middleware de verificación** en rutas protegidas
- **Validación de tokens** en tiempo real

### Protección de Rutas
- Rutas públicas: Lectura de monumentos, categorías, instituciones
- Rutas protegidas: Gestión administrativa (solo admin)
- Validación automática de permisos por rol

### Validación de Datos
- Validación de entrada con express-validator
- Sanitización de datos
- Límites de tamaño para archivos

## 📁 Estructura del Proyecto

```
backend/
├── src/
│   ├── config/          # Configuraciones (DB, GCS)
│   ├── controllers/     # Controladores de rutas
│   ├── middlewares/     # Middlewares personalizados
│   ├── models/          # Modelos de MongoDB
│   ├── routes/          # Definición de rutas
│   ├── services/        # Lógica de negocio
│   ├── seeds/           # Scripts de inicialización
│   └── utils/           # Utilidades
├── tests/               # Tests automatizados
├── docs/                # Documentación
└── scripts/             # Scripts de utilidad
```

## 🧪 Testing

```bash
# Ejecutar todos los tests
npm test

# Tests con coverage
npm run test:coverage

# Tests en modo watch
npm run test:watch
```

## 📖 Documentación Adicional

- [Configuración de GCS](docs/GCS_SETUP.md)
- [Implementación de Tareas](docs/)
- [Guía de Migración](scripts/README-migration.md)

## 🤝 Contribución

1. Fork el proyecto
2. Crear rama de feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -am 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crear Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.