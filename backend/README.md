# HistoriAR Backend API

Backend API para la aplicación HistoriAR - Sistema de gestión de monumentos históricos con realidad aumentada.

## 🚀 Características

- **API RESTful** completa para gestión de monumentos, instituciones, categorías y usuarios
- **Autenticación JWT** con roles y permisos
- **Integración con AWS S3** para archivos multimedia
- **Base de datos MongoDB** con Mongoose ODM
- **Validación de datos** con express-validator
- **Subida de archivos** con soporte para imágenes y modelos 3D
- **Sistema de búsqueda** avanzado con filtros
- **Middleware de seguridad** robusto

## 📋 Requisitos Previos

- Node.js 18+ 
- MongoDB 6.0+
- Cuenta de AWS con S3 habilitado
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
MONGO_URI=mongodb://localhost:27017/historiar

# JWT
JWT_SECRET=tu_jwt_secret_muy_seguro

# AWS S3 Configuration
AWS_ACCESS_KEY_ID=your_aws_access_key_id
AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key
AWS_REGION=us-east-1
S3_BUCKET=historiar-storage

# Servidor
PORT=4000
NODE_ENV=development
```

4. **Configurar AWS S3**
- Crear un bucket en S3
- Configurar permisos públicos (ver `docs/S3_SETUP.md`)
- Crear usuario IAM con permisos de S3
- Obtener Access Key ID y Secret Access Key

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

- [Configuración de AWS S3](docs/S3_SETUP.md)
- [Guía de Migración GCS a S3](docs/MIGRATION_GUIDE.md)
- [Implementación de 3D Tiles](docs/3D_TILES_SETUP.md)

## 🤝 Contribución

1. Fork el proyecto
2. Crear rama de feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -am 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crear Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

#
# 🚀 Deployment y Migraciones

### Preparación para Deployment

Antes de desplegar a producción, ejecuta el script de preparación completo:

```bash
npm run deploy:prepare
```

Este comando ejecuta automáticamente:
1. Verificación de configuración (`npm run verify`)
2. Migraciones de base de datos (`npm run migrate`)
3. Creación de índices (`npm run indexes`)

### Scripts de Deployment Individuales

#### 1. Verificar Configuración

Verifica que todas las variables de entorno estén configuradas correctamente:

```bash
npm run verify
```

Este script verifica:
- Variables de entorno requeridas
- Conexión a MongoDB
- Acceso a AWS S3
- Configuración de S3 bucket

#### 2. Ejecutar Migraciones

Ejecuta todas las migraciones en orden:

```bash
npm run migrate
```

O ejecuta migraciones individuales:

```bash
# Agregar location a instituciones
npm run migrate:institutions

# Migrar estructura de quizzes
npm run migrate:quizzes

# Migrar estructura de archivos en S3
npm run migrate:s3-structure
```

**Importante:** Las migraciones de S3 NO eliminan archivos antiguos automáticamente. Verifica que todo funcione antes de eliminar archivos manualmente.

#### 3. Crear Índices

Crea todos los índices necesarios en MongoDB:

```bash
npm run indexes
```

Este script crea índices para:
- Tour (institutionId, isActive, type)
- QuizAttempt (userId, quizId, completedAt)
- UserPreferences (userId)
- ModelVersion (monumentId, uploadedAt, isActive)
- Quiz (monumentId)
- Institution (location)
- Monument (status, categoryId, institutionId)

### Orden Recomendado de Deployment

1. **Staging Environment:**
   ```bash
   # 1. Verificar configuración
   npm run verify
   
   # 2. Ejecutar migraciones
   npm run migrate
   
   # 3. Crear índices
   npm run indexes
   
   # 4. Iniciar servidor
   npm start
   
   # 5. Verificar logs y probar endpoints
   ```

2. **Production Environment:**
   ```bash
   # Usar el comando completo de preparación
   npm run deploy:prepare
   
   # Si todo está OK, iniciar servidor
   npm start
   ```

### Rollback de Migraciones

Las migraciones NO son reversibles automáticamente. Si necesitas hacer rollback:

1. **Instituciones:** Elimina el campo `location` manualmente en MongoDB
2. **Quizzes:** Restaura backup de la colección
3. **S3:** Los archivos antiguos se mantienen, solo actualiza las URLs en Monument

**Recomendación:** Siempre haz backup de la base de datos antes de ejecutar migraciones en producción.

## 📊 Nuevas Funcionalidades (v2.0)

### Sistema de Tours
- CRUD completo de recorridos turísticos
- Monumentos ordenados con descripciones
- Filtros por institución y tipo
- API: `/api/tours`

### Geolocalización
- Detección de institución por coordenadas GPS
- Monumentos cercanos con cálculo de distancia (Haversine)
- Tours disponibles por ubicación
- API: `/api/location`

### Versionado de Modelos 3D
- Historial completo de versiones
- Restaurar versiones anteriores
- Eliminar versiones antiguas
- Organización por carpetas en GCS
- API: `/api/monuments/:id/model-versions`

### Quiz Attempts
- Registro de intentos con scoring automático
- Historial de intentos por usuario
- Estadísticas de quizzes
- API: `/api/quizzes/:id/submit`

### User Preferences
- Preferencias de usuario para quizzes
- API: `/api/users/:id/preferences`

## 🔧 Variables de Entorno Actualizadas

```env
# Base de datos
MONGO_URI=mongodb://localhost:27017/historiar

# JWT
JWT_SECRET=tu_jwt_secret_muy_seguro

# AWS S3 Configuration
AWS_ACCESS_KEY_ID=your_aws_access_key_id
AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key
AWS_REGION=us-east-1
S3_BUCKET=historiar-storage

# Servidor
PORT=4000
NODE_ENV=development
```

## 📝 Estructura de Archivos en S3

### Estructura Organizada por Monumento
```
historiar-storage/
├── models/
│   ├── Monumento_A/
│   │   ├── Monumento_A_2024-11-09T10-30-00.glb
│   │   └── Monumento_A_2024-11-08T15-20-00.glb
│   └── Monumento_B/
│       └── Monumento_B_2024-11-09T11-00-00.glb
└── images/
    ├── Monumento_A/
    │   └── Monumento_A_2024-11-09T10-30-00.jpg
    └── Monumento_B/
        └── Monumento_B_2024-11-09T11-00-00.jpg
```

## 🧪 Testing

```bash
# Ejecutar todos los tests
npm test

# Ejecutar tests en modo watch
npm run test:watch

# Ejecutar tests con UI
npm run test:ui
```

## 📚 Documentación de API

Para documentación completa de los endpoints, consulta:
- `docs/API_TOURS.md` - Endpoints de tours
- `docs/API_LOCATION.md` - Endpoints de geolocalización
- `docs/API_VERSIONING.md` - Endpoints de versionado

## 🐛 Troubleshooting

### Error: "MONGO_URI not set"
Asegúrate de tener el archivo `.env` configurado con `MONGO_URI`.

### Error: "S3 bucket not accessible"
Verifica que:
1. `AWS_ACCESS_KEY_ID` y `AWS_SECRET_ACCESS_KEY` sean correctos
2. El bucket existe en AWS S3
3. Las credenciales tienen permisos de lectura/escritura (PutObject, GetObject, DeleteObject, ListBucket)
4. La región `AWS_REGION` sea correcta

### Error en migraciones
Si una migración falla:
1. Revisa los logs para identificar el error
2. Corrige el problema
3. Ejecuta la migración individual nuevamente
4. NO ejecutes `npm run migrate` completo si algunas migraciones ya se ejecutaron

### Índices duplicados
Si obtienes errores de índices duplicados:
```bash
# Conecta a MongoDB y elimina índices manualmente
mongo
use historiar
db.tours.dropIndexes()
db.quizattempts.dropIndexes()
# etc...

# Luego ejecuta
npm run indexes
```

## 📄 Licencia

MIT

## 👥 Autor

Carlos Asparrín


## 🎨 3D Tiles Processing (Opcional)

### ¿Qué son los 3D Tiles?

3D Tiles es un estándar de Cesium para streaming progresivo de modelos 3D. Beneficios:
- Carga progresiva (solo detalles visibles)
- Mejor rendimiento para modelos grandes (>10MB)
- Múltiples niveles de detalle (LOD)
- Streaming eficiente

### Instalación de Cesium Tools

**Opción 1: Global con npm**
```bash
npm install -g 3d-tiles-tools
```

**Opción 2: Docker**
```bash
docker pull cesium/3d-tiles-tools
```

**Opción 3: Local (desarrollo)**
```bash
npm install 3d-tiles-tools --save-dev
```

### Verificar Instalación

```bash
3d-tiles-tools --version
```

### Uso

El procesamiento de tiles se ejecuta **automáticamente** al subir un modelo 3D:

- ✅ Si Cesium Tools está instalado: genera tiles automáticamente
- ✅ Si NO está instalado: continúa sin tiles (solo GLB)
- ✅ El sistema funciona perfectamente sin tiles

### Cuándo Usar 3D Tiles

✅ **Usar:**
- Modelos grandes (>10MB)
- Modelos muy detallados
- Necesitas streaming progresivo

❌ **NO usar:**
- Modelos pequeños (<5MB)
- No tienes Cesium Tools
- Desarrollo rápido sin configuración

### Documentación Completa

Ver `docs/3D_TILES_SETUP.md` para:
- Guía de instalación detallada
- Configuración avanzada
- Troubleshooting
- Comparación GLB vs 3D Tiles
- Alternativas (Cesium Ion)

---

## 📈 Roadmap

### Completado ✅
- [x] Sistema de Tours
- [x] Geolocalización con Haversine
- [x] Versionado de Modelos 3D
- [x] Quiz Attempts
- [x] User Preferences
- [x] Scripts de Deployment
- [x] 3D Tiles Processing (opcional)

### En Progreso 🚧
- [ ] Testing completo
- [ ] Documentación de API detallada
- [ ] Deployment a staging

### Futuro 🔮
- [ ] Mobile App (spec separado)
- [ ] Analytics Dashboard
- [ ] Notificaciones Push
- [ ] Gamificación

---

## 🤝 Contribución

Para contribuir al proyecto:

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

### Guías de Contribución

- Seguir el estilo de código existente
- Agregar tests para nuevas funcionalidades
- Actualizar documentación
- Usar commits descriptivos

---

## 📞 Soporte

Para soporte y preguntas:
- 📧 Email: [email del proyecto]
- 📝 Issues: [GitHub Issues]
- 📚 Docs: Ver carpeta `docs/`

---

## 🙏 Agradecimientos

- Cesium por 3D Tiles specification
- Amazon Web Services por S3
- MongoDB por la base de datos
- Comunidad open source

---

**Versión:** 2.0  
**Última actualización:** Noviembre 9, 2025  
**Estado:** Producción Ready ✅


---

## ☁️ Despliegue en Vercel

Este proyecto está configurado para desplegarse en Vercel como serverless functions.

### Archivos de Configuración

- `api/index.js` - Punto de entrada serverless
- `vercel.json` - Configuración de Vercel
- `.vercelignore` - Archivos excluidos del deploy

### Despliegue Rápido

```bash
# Instalar Vercel CLI
npm install -g vercel

# Desplegar
vercel --prod
```

### Variables de Entorno Requeridas

Configura estas variables en Vercel Dashboard:

```bash
MONGO_URI=mongodb+srv://...
JWT_SECRET=...
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
AWS_REGION=us-east-1
S3_BUCKET=historiar-storage
```

### Documentación Completa

Ver `VERCEL_DEPLOYMENT_GUIDE.md` para instrucciones detalladas.

---

## 🔄 Desarrollo Local vs Producción

Este proyecto soporta ambos modos:

**Local:** Usa `src/server.js` con `app.listen()`
```bash
npm run dev
```

**Vercel:** Usa `api/index.js` sin `app.listen()`
```bash
vercel --prod
```

Ver `VERCEL_VS_LOCAL.md` para más detalles sobre las diferencias.
