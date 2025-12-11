# Stack Tecnológico - HistoriAR

## Descripción General

Este documento detalla todas las tecnologías, frameworks, librerías y herramientas utilizadas en cada componente del proyecto HistoriAR.

---

## 1. BACKEND API

### 1.1 Runtime y Lenguaje
- **Node.js** `>=18.0.0` - Entorno de ejecución JavaScript
- **JavaScript ES6+** - Lenguaje de programación con módulos ES6

### 1.2 Framework Web
- **Express.js** `^4.19.2` - Framework web minimalista para Node.js
  - Manejo de rutas HTTP
  - Middleware pipeline
  - Gestión de peticiones y respuestas

### 1.3 Base de Datos
- **MongoDB** `6.0+` - Base de datos NoSQL orientada a documentos
- **Mongoose** `^8.6.0` - ODM (Object Data Modeling) para MongoDB
  - Esquemas y validación de datos
  - Middleware de documentos
  - Queries y agregaciones
  - Índices y optimización

### 1.4 Almacenamiento en la Nube
- **AWS S3** - Servicio de almacenamiento de objetos
- **@aws-sdk/client-s3** `^3.946.0` - SDK oficial de AWS para S3
- **@aws-sdk/lib-storage** `^3.946.0` - Librería para uploads multipart
  - Subida de imágenes (JPG, PNG)
  - Subida de modelos 3D (GLB, GLTF)
  - Gestión de URLs públicas
  - Organización por carpetas

### 1.5 Autenticación y Seguridad
- **jsonwebtoken** `^9.0.2` - Generación y validación de tokens JWT
- **bcryptjs** `^2.4.3` - Hash de contraseñas con bcrypt
- **helmet** `^7.1.0` - Middleware de seguridad HTTP headers
- **cors** `^2.8.5` - Middleware para Cross-Origin Resource Sharing
- **express-validator** `^7.2.1` - Validación y sanitización de datos

### 1.6 Manejo de Archivos
- **multer** `^1.4.5-lts.1` - Middleware para multipart/form-data
  - Subida de archivos
  - Validación de tipos
  - Límites de tamaño

### 1.7 Utilidades
- **dotenv** `^16.4.5` - Gestión de variables de entorno
- **uuid** `^13.0.0` - Generación de identificadores únicos
- **morgan** `^1.10.0` - Logger de peticiones HTTP

### 1.8 Testing
- **Vitest** `^1.0.0` - Framework de testing unitario
- **@vitest/ui** `^1.0.0` - Interfaz web para Vitest
- **supertest** `^6.3.3` - Testing de APIs HTTP

### 1.9 Desarrollo
- **nodemon** `^3.1.0` - Auto-reload en desarrollo

### 1.10 Procesamiento 3D (Opcional)
- **3d-tiles-tools** - Herramientas de Cesium para procesamiento de 3D Tiles
  - Conversión de GLB a 3D Tiles
  - Optimización de modelos grandes
  - Streaming progresivo

### 1.11 Despliegue
- **AWS (Amazon Web Services)** - Plataforma de despliegue en la nube
  - EC2 o Elastic Beanstalk para el servidor Node.js
  - Auto-scaling y balanceo de carga
  - Integración nativa con S3 y otros servicios AWS

### 1.12 Arquitectura del Backend

```
backend/
├── src/
│   ├── config/           # Configuraciones
│   │   ├── db.js        # Conexión MongoDB
│   │   ├── s3.js        # Configuración AWS S3
│   │   └── validateEnv.js
│   ├── controllers/      # Controladores de rutas
│   │   ├── authController.js
│   │   ├── monumentsController.js
│   │   ├── institutionsController.js
│   │   ├── categoriesController.js
│   │   ├── toursController.js
│   │   ├── quizzesController.js
│   │   ├── locationController.js
│   │   └── historicalDataController.js
│   ├── middlewares/      # Middlewares personalizados
│   │   ├── auth.js      # Verificación JWT
│   │   ├── roleCheck.js # Verificación de roles
│   │   └── upload.js    # Configuración Multer
│   ├── models/          # Modelos Mongoose
│   │   ├── User.js
│   │   ├── Monument.js
│   │   ├── Institution.js
│   │   ├── Category.js
│   │   ├── Tour.js
│   │   ├── Quiz.js
│   │   └── QuizAttempt.js
│   ├── routes/          # Definición de rutas
│   │   ├── auth.routes.js
│   │   ├── monuments.routes.js
│   │   ├── institutions.routes.js
│   │   ├── categories.routes.js
│   │   ├── tours.routes.js
│   │   ├── quizzes.routes.js
│   │   └── location.routes.js
│   ├── services/        # Lógica de negocio
│   │   ├── s3Service.js
│   │   ├── tourService.js
│   │   ├── quizService.js
│   │   ├── locationService.js
│   │   └── tiles3DService.js
│   ├── migrations/      # Scripts de migración
│   │   ├── addLocationToInstitutions.js
│   │   ├── migrateQuizStructure.js
│   │   └── migrateGCSStructure.js
│   ├── utils/           # Utilidades
│   │   └── haversine.js # Cálculo de distancias
│   ├── app.js           # Configuración Express
│   └── server.js        # Punto de entrada
├── api/
│   └── index.js         # Punto de entrada Vercel
├── scripts/             # Scripts de utilidad
│   ├── verifyConfig.js
│   ├── runMigrations.js
│   ├── createIndexes.js
│   ├── configureCORS.js
│   └── testS3Upload.js
└── tests/               # Tests automatizados
```

---

## 2. ADMIN PANEL (Panel de Administración Web)

### 2.1 Framework Frontend
- **React** `^19.1.1` - Librería de UI declarativa
  - Componentes funcionales
  - Hooks (useState, useEffect, useContext, etc.)
  - Context API para estado global

### 2.2 Build Tool
- **Vite** `^7.1.7` - Build tool y dev server de nueva generación
  - Hot Module Replacement (HMR)
  - Build optimizado para producción
  - Soporte ES modules nativo

### 2.3 Enrutamiento
- **React Router DOM** `^7.10.1` - Enrutamiento declarativo
  - Navegación entre vistas
  - Rutas protegidas
  - Parámetros de URL

### 2.4 Estilos y UI
- **Tailwind CSS** `^4.1.14` - Framework CSS utility-first
- **@tailwindcss/vite** `^4.1.14` - Plugin de Vite para Tailwind
- **PostCSS** - Procesador de CSS
- **Autoprefixer** - Prefijos CSS automáticos

### 2.5 Componentes UI (shadcn/ui)
Basados en **Radix UI** - Componentes accesibles y sin estilos:

- **@radix-ui/react-avatar** `^1.1.10` - Avatares
- **@radix-ui/react-dialog** `^1.1.15` - Modales y diálogos
- **@radix-ui/react-dropdown-menu** `^2.1.16` - Menús desplegables
- **@radix-ui/react-label** `^2.1.7` - Labels de formularios
- **@radix-ui/react-progress** `^1.1.7` - Barras de progreso
- **@radix-ui/react-select** `^2.2.6` - Selectores
- **@radix-ui/react-slot** `^1.2.3` - Composición de componentes

### 2.6 Iconos
- **Lucide React** `^0.546.0` - Librería de iconos moderna
  - Más de 1000 iconos
  - Optimizados para React
  - Personalizables

### 2.7 Gráficos y Visualización
- **Recharts** `^3.3.0` - Librería de gráficos para React
  - Gráficos de líneas
  - Gráficos de barras
  - Gráficos de área
  - Responsive

### 2.8 Utilidades
- **clsx** `^2.1.1` - Construcción de classNames condicionales
- **tailwind-merge** `^3.3.1` - Merge de clases Tailwind
- **class-variance-authority** `^0.7.1` - Variantes de componentes
- **sonner** `^2.0.7` - Notificaciones toast elegantes
- **next-themes** `^0.4.6` - Gestión de temas (dark/light mode)

### 2.9 Validación
- **prop-types** `^15.8.1` - Validación de props en componentes

### 2.10 Linting y Calidad de Código
- **ESLint** `^9.36.0` - Linter de JavaScript
- **@eslint/js** `^9.36.0` - Configuración base ESLint
- **eslint-plugin-react-hooks** `^5.2.0` - Reglas para React Hooks
- **eslint-plugin-react-refresh** `^0.4.22` - Reglas para React Refresh

### 2.11 TypeScript (Tipos)
- **@types/react** `^19.1.16` - Tipos TypeScript para React
- **@types/react-dom** `^19.1.9` - Tipos TypeScript para React DOM

### 2.12 Compilador
- **@vitejs/plugin-react-swc** `^4.1.0` - Plugin Vite con SWC
  - Compilación ultra-rápida
  - Reemplazo de Babel

### 2.13 Despliegue
- **AWS S3 + CloudFront** - Hosting de aplicación web estática
  - S3 para almacenamiento de archivos estáticos
  - CloudFront como CDN global
  - HTTPS automático con certificados SSL
  - Distribución de baja latencia

### 2.14 Arquitectura del Admin Panel

```
admin-panel/
├── src/
│   ├── components/          # Componentes React
│   │   ├── ui/             # Componentes base (shadcn/ui)
│   │   │   ├── button.jsx
│   │   │   ├── input.jsx
│   │   │   ├── dialog.jsx
│   │   │   ├── select.jsx
│   │   │   ├── toast.jsx
│   │   │   └── ...
│   │   ├── MonumentsManager.jsx
│   │   ├── InstitutionsManager.jsx
│   │   ├── CategoriesManager.jsx
│   │   ├── ToursManager.jsx
│   │   ├── QuizzesManager.jsx
│   │   ├── UsersManager.jsx
│   │   ├── ImageUpload.jsx
│   │   ├── ModelUpload.jsx
│   │   ├── AppSidebar.jsx
│   │   └── Dashboard.jsx
│   ├── contexts/           # Contextos React
│   │   └── AuthContext.jsx
│   ├── hooks/              # Hooks personalizados
│   │   └── useAuth.js
│   ├── services/           # Servicios API
│   │   └── api.js
│   ├── utils/              # Utilidades
│   │   └── cn.js          # Merge de clases
│   ├── assets/             # Recursos estáticos
│   ├── App.jsx             # Componente principal
│   └── main.jsx            # Punto de entrada
├── public/                 # Archivos públicos
├── index.html              # HTML base
├── vite.config.js          # Configuración Vite
├── tailwind.config.js      # Configuración Tailwind
├── postcss.config.js       # Configuración PostCSS
└── eslint.config.js        # Configuración ESLint
```

---

## 3. APP MÓVIL (Flutter)

### 3.1 Framework
- **Flutter** `>=3.9.2 <4.0.0` - Framework UI multiplataforma
  - Dart como lenguaje
  - Widgets nativos
  - Hot reload
  - Compilación nativa (ARM)

### 3.2 Lenguaje
- **Dart** `>=3.9.2` - Lenguaje de programación optimizado para UI

### 3.3 Networking
- **http** `^1.6.0` - Cliente HTTP para Dart
  - Peticiones REST al backend
  - Manejo de respuestas JSON
  - Headers y autenticación

### 3.4 Mapas y Geolocalización
- **flutter_map** `^8.2.2` - Widget de mapas para Flutter
  - Mapas interactivos
  - Marcadores personalizables
  - Capas y overlays
  - Basado en OpenStreetMap
- **latlong2** `^0.9.1` - Manejo de coordenadas geográficas
  - Conversión de coordenadas
  - Cálculos de distancia
- **geolocator** `^14.0.2` - Acceso a servicios de ubicación
  - GPS del dispositivo
  - Permisos de ubicación
  - Ubicación en tiempo real
  - Soporte Android e iOS

### 3.5 Realidad Aumentada
- **ar_flutter_plugin_plus** `^1.0.0` - Plugin de AR para Flutter
  - ARCore (Android)
  - ARKit (iOS)
  - Detección de superficies
  - Renderizado de modelos 3D
  - Interacción con objetos AR

### 3.6 Almacenamiento Local
- **SharedPreferences** (Android) - Almacenamiento clave-valor persistente
  - Preferencias de usuario (quizzes, notificaciones, privacidad)
  - Configuraciones de la app
  - Datos de sesión
  - Caché de datos temporales
- **UserDefaults** (iOS) - Almacenamiento clave-valor persistente
  - Preferencias de usuario (quizzes, notificaciones, privacidad)
  - Configuraciones de la app
  - Datos de sesión
  - Caché de datos temporales
- **shared_preferences** (Flutter package recomendado) - Wrapper multiplataforma
  - API unificada para Android e iOS
  - Persistencia de preferencias entre sesiones
  - Sincronización automática
  - Almacenamiento de configuraciones locales

**Nota:** Las preferencias de usuario se almacenan localmente en el dispositivo, no en el backend. Esto mejora la privacidad y reduce la latencia de acceso a configuraciones.

### 3.7 UI/UX
- **cupertino_icons** `^1.0.8` - Iconos estilo iOS
- **Material Design 3** - Sistema de diseño (incluido en Flutter)
  - Componentes Material
  - Temas personalizables
  - Animaciones fluidas

### 3.8 Recursos
- **flutter_launcher_icons** `^0.14.4` - Generación de iconos de app
  - Iconos para Android
  - Iconos para iOS
  - Múltiples resoluciones

### 3.9 Testing
- **flutter_test** - Framework de testing (incluido en Flutter SDK)
  - Unit tests
  - Widget tests
  - Integration tests

### 3.10 Linting
- **flutter_lints** `^5.0.0` - Reglas de linting recomendadas
  - Buenas prácticas
  - Detección de errores
  - Consistencia de código

### 3.11 Plataformas Soportadas
- **Android** `8.0+` (API 26+)
  - ARCore para realidad aumentada
  - Google Play Services
- **iOS** `12.0+`
  - ARKit para realidad aumentada
  - App Store

### 3.12 Arquitectura de la App Móvil

```
app_movil/
├── lib/
│   ├── screens/              # Pantallas de la app
│   │   ├── login_screen.dart
│   │   ├── main_scaffold.dart
│   │   ├── explore_screen.dart
│   │   ├── ar_camera_screen.dart
│   │   ├── my_tour_screen.dart
│   │   ├── quiz_screen.dart
│   │   ├── profile_screen.dart
│   │   └── configuration_screen.dart
│   ├── models/               # Modelos de datos
│   │   ├── monument.dart
│   │   ├── institution.dart
│   │   ├── tour.dart
│   │   └── quiz.dart
│   ├── services/             # Servicios
│   │   ├── api_service.dart
│   │   ├── auth_service.dart
│   │   ├── location_service.dart
│   │   ├── ar_service.dart
│   │   └── preferences_service.dart  # Gestión de preferencias locales
│   ├── widgets/              # Widgets reutilizables
│   │   ├── monument_card.dart
│   │   ├── tour_card.dart
│   │   └── quiz_question.dart
│   ├── utils/                # Utilidades
│   │   └── constants.dart
│   └── main.dart             # Punto de entrada
├── android/                  # Configuración Android
│   ├── app/
│   │   └── src/main/
│   │       └── AndroidManifest.xml
│   └── build.gradle
├── ios/                      # Configuración iOS
│   ├── Runner/
│   │   └── Info.plist
│   └── Podfile
├── assets/                   # Recursos estáticos
├── pubspec.yaml              # Dependencias
└── analysis_options.yaml     # Configuración linting
```

---

## 4. INFRAESTRUCTURA Y SERVICIOS AWS

### 4.1 Base de Datos
- **MongoDB Atlas** (Producción)
  - Cluster en la nube
  - Backups automáticos
  - Réplicas para alta disponibilidad
  - Monitoreo y alertas
  - Integración con AWS VPC (opcional)
- **MongoDB Local** (Desarrollo)
  - MongoDB Community Server 6.0+

### 4.2 Almacenamiento
- **AWS S3** - Simple Storage Service
  - Bucket: `historiar-storage`
  - Región: Configurable (ej: us-east-1)
  - Estructura organizada por tipo y monumento
  - CORS configurado para acceso web
  - Versionado de objetos habilitado
  - Lifecycle policies para optimización de costos
  - Encriptación en reposo (AES-256)

### 4.3 Autenticación
- **JWT (JSON Web Tokens)**
  - Tokens firmados con HS256
  - Expiración configurable
  - Payload con userId y role
  - Refresh tokens para sesiones largas

### 4.4 Servicios AWS Utilizados

#### Compute
- **AWS EC2** o **AWS Elastic Beanstalk**
  - Instancias para el backend Node.js
  - Auto-scaling basado en carga
  - Load Balancer (ALB/ELB)
  - Health checks automáticos

#### Storage & CDN
- **AWS S3**
  - Almacenamiento de imágenes y modelos 3D
  - Hosting de archivos estáticos del admin panel
- **AWS CloudFront**
  - CDN global para distribución de contenido
  - Caché de archivos estáticos
  - Reducción de latencia
  - Certificados SSL/TLS gratuitos

#### Networking
- **AWS VPC** (Virtual Private Cloud)
  - Red privada aislada
  - Subnets públicas y privadas
  - Security Groups para control de acceso
  - NAT Gateway para salida a internet

#### Security
- **AWS IAM** (Identity and Access Management)
  - Usuarios y roles para acceso a servicios
  - Políticas de permisos granulares
  - Access Keys para SDK
- **AWS Secrets Manager** (Opcional)
  - Gestión segura de credenciales
  - Rotación automática de secretos

#### Monitoring & Logging
- **AWS CloudWatch**
  - Logs de aplicación
  - Métricas de rendimiento
  - Alarmas y notificaciones
  - Dashboards personalizados

### 4.5 Arquitectura de Despliegue AWS

#### Backend API
- **AWS EC2** o **Elastic Beanstalk**
  - Instancias t3.medium o superior
  - Node.js 18+ runtime
  - PM2 para gestión de procesos
  - Auto-scaling group (mín: 2, máx: 10)
  - Application Load Balancer
  - Health checks en `/health`

#### Admin Panel
- **AWS S3 + CloudFront**
  - Build de producción en S3 bucket
  - CloudFront distribution
  - Invalidación de caché automática
  - Redirección HTTPS
  - Custom domain con Route 53

#### App Móvil
- **Google Play Store** (Android)
  - APK/AAB
  - Distribución global
  - Actualizaciones automáticas
- **Apple App Store** (iOS)
  - IPA
  - TestFlight para beta testing
  - Distribución global

### 4.6 Control de Versiones
- **Git** - Sistema de control de versiones
- **GitHub** / **GitLab** / **AWS CodeCommit** - Hosting de repositorio

### 4.7 CI/CD Pipeline

#### Opción 1: AWS CodePipeline
- **AWS CodeCommit** - Repositorio Git
- **AWS CodeBuild** - Build y testing
- **AWS CodeDeploy** - Despliegue automático
- Pipeline completo integrado

#### Opción 2: GitHub Actions + AWS
- GitHub Actions para CI
- Deploy automático a EC2/Elastic Beanstalk
- Secrets en GitHub Secrets
- Notificaciones de deploy

#### Opción 3: GitLab CI/CD + AWS
- GitLab CI/CD pipelines
- Deploy a AWS con credenciales IAM
- Environments (dev, staging, prod)

### 4.8 Configuración de Entornos

#### Desarrollo
- MongoDB local
- S3 bucket de desarrollo
- Variables de entorno locales

#### Staging
- MongoDB Atlas (cluster compartido)
- S3 bucket de staging
- EC2 instancia pequeña
- Dominio de staging

#### Producción
- MongoDB Atlas (cluster dedicado)
- S3 bucket de producción
- EC2 con auto-scaling
- CloudFront + dominio principal
- Backups automáticos
- Monitoreo 24/7

---

## 5. HERRAMIENTAS DE DESARROLLO

### 5.1 IDEs y Editores
- **Visual Studio Code** (Recomendado)
  - Extensiones: ESLint, Prettier, Flutter, Dart
- **Android Studio** (Para desarrollo Flutter Android)
- **Xcode** (Para desarrollo Flutter iOS)

### 5.2 Gestión de Paquetes
- **npm** / **yarn** - Backend y Admin Panel
- **pub** - App Móvil (Flutter)

### 5.3 Testing y Debugging
- **Postman** / **Insomnia** - Testing de APIs
- **MongoDB Compass** - GUI para MongoDB
- **AWS Console** - Gestión de S3
- **Chrome DevTools** - Debugging web
- **Flutter DevTools** - Debugging Flutter

### 5.4 Monitoreo
- **AWS CloudWatch** - Monitoreo completo
  - Logs de aplicación (backend, errores)
  - Métricas de EC2, S3, CloudFront
  - Alarmas y notificaciones por email/SMS
  - Dashboards personalizados
  - Retención de logs configurable
- **MongoDB Atlas Monitoring** - Métricas de base de datos
  - Performance metrics (CPU, memoria, I/O)
  - Query analytics y slow queries
  - Alertas de rendimiento
  - Gráficos de conexiones y operaciones
- **AWS X-Ray** (Opcional) - Tracing distribuido
  - Análisis de rendimiento end-to-end
  - Detección de cuellos de botella
  - Mapas de servicios
- **AWS CloudTrail** - Auditoría de acciones
  - Registro de llamadas a API de AWS
  - Seguridad y compliance

---

## 6. ALGORITMOS Y TÉCNICAS ESPECIALES

### 6.1 Geolocalización
- **Fórmula de Haversine** - Cálculo de distancias entre coordenadas
  - Implementación en `backend/src/utils/haversine.js`
  - Precisión en kilómetros
  - Considera curvatura de la Tierra

### 6.2 Procesamiento 3D
- **3D Tiles** (Opcional) - Streaming progresivo de modelos 3D
  - Conversión de GLB a tileset
  - Niveles de detalle (LOD)
  - Optimización para web y móvil

### 6.3 Búsqueda
- **MongoDB Text Search** - Búsqueda de texto completo
  - Índices de texto en nombre y descripción
  - Búsqueda fuzzy
  - Ranking de relevancia

### 6.4 Seguridad
- **bcrypt** - Hash de contraseñas
  - Salt rounds: 10
  - Resistente a rainbow tables
- **JWT** - Tokens seguros
  - Firma HMAC SHA256
  - Expiración temporal

---

## 7. REQUISITOS DEL SISTEMA

### Para Desarrollo Backend
- Node.js 18+
- MongoDB 6.0+
- npm o yarn
- Cuenta AWS con S3

### Para Desarrollo Admin Panel
- Node.js 18+
- npm o yarn
- Navegador moderno

### Para Desarrollo App Móvil
- Flutter SDK 3.9.2+
- Dart SDK 3.9.2+
- Android Studio (para Android)
- Xcode (para iOS, solo macOS)
- Dispositivo físico o emulador con soporte AR

---

## 8. DIAGRAMA DE ARQUITECTURA GENERAL

```
┌─────────────────────────────────────────────────────────────┐
│                        USUARIOS                              │
├──────────────┬──────────────────────┬──────────────────────┤
│ Administrador│   Usuario Móvil      │   Usuario Móvil      │
│  (Web)       │   (Android)          │   (iOS)              │
└──────┬───────┴──────────┬───────────┴──────────┬───────────┘
       │                  │                      │
       │                  │                      │
┌──────▼──────┐    ┌──────▼──────────────────────▼──────┐
│ Admin Panel │    │        App Móvil Flutter           │
│  (React)    │    │  - Mapas (flutter_map)             │
│  - Vite     │    │  - AR (ar_flutter_plugin_plus)     │
│  - Tailwind │    │  - Geolocalización (geolocator)    │
└──────┬──────┘    └──────┬─────────────────────────────┘
       │                  │
       │                  │
       └────────┬─────────┘
                │
         ┌──────▼──────┐
         │   Backend   │
         │  (Express)  │
         │  - JWT Auth │
         │  - REST API │
         └──┬────┬────┬┘
            │    │    │
    ┌───────▼┐ ┌─▼────▼──────┐
    │MongoDB │ │   AWS S3    │
    │ Atlas  │ │  - Imágenes │
    │        │ │  - Modelos  │
    └────────┘ └─────────────┘
```

---

**Documento generado:** Diciembre 10, 2024  
**Versión del sistema:** 2.0  
**Autor:** Carlos Asparrín


---

## 10. DIAGRAMA DE ARQUITECTURA GENERAL EN AWS

```
┌─────────────────────────────────────────────────────────────────┐
│                          USUARIOS                                │
├──────────────┬──────────────────────┬────────────────────────────┤
│ Administrador│   Usuario Móvil      │   Usuario Móvil            │
│  (Web)       │   (Android)          │   (iOS)                    │
└──────┬───────┴──────────┬───────────┴──────────┬─────────────────┘
       │                  │                      │
       │                  │                      │
       │         ┌────────▼──────────────────────▼────────┐
       │         │     App Móvil Flutter                  │
       │         │  - Mapas (flutter_map)                 │
       │         │  - AR (ar_flutter_plugin_plus)         │
       │         │  - Geolocalización (geolocator)        │
       │         │  - Preferencias locales (SharedPrefs)  │
       │         └────────┬───────────────────────────────┘
       │                  │
┌──────▼──────────────────▼──────────────────────────────────────┐
│                    AWS CLOUD INFRASTRUCTURE                     │
│                                                                 │
│  ┌──────────────────┐         ┌─────────────────────────────┐ │
│  │  CloudFront CDN  │         │   Application Load Balancer │ │
│  │  (Admin Panel)   │         │         (Backend)           │ │
│  └────────┬─────────┘         └──────────┬──────────────────┘ │
│           │                              │                     │
│  ┌────────▼─────────┐         ┌──────────▼──────────────────┐ │
│  │   S3 Bucket      │         │   EC2 Auto Scaling Group    │ │
│  │ (Static Files)   │         │   - Node.js + Express       │ │
│  └──────────────────┘         │   - JWT Auth                │ │
│                               │   - REST API                │ │
│                               └──────────┬──────────────────┘ │
│                                          │                     │
│  ┌───────────────────────────────────────┼──────────────────┐ │
│  │                                       │                  │ │
│  │  ┌────────────────┐         ┌────────▼────────────────┐ │ │
│  │  │  MongoDB Atlas │         │      AWS S3 Bucket      │ │ │
│  │  │   (Database)   │         │  - Imágenes monumentos  │ │ │
│  │  │  - Usuarios    │         │  - Modelos 3D (GLB)     │ │ │
│  │  │  - Monumentos  │         │  - 3D Tiles (opcional)  │ │ │
│  │  │  - Tours       │         │  - CORS configurado     │ │ │
│  │  │  - Quizzes     │         │  - Versionado habilitado│ │ │
│  │  └────────────────┘         └─────────────────────────┘ │ │
│  │                                                          │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │              Servicios de Soporte AWS                    │ │
│  │  - CloudWatch (Logs y Métricas)                          │ │
│  │  - IAM (Gestión de accesos)                              │ │
│  │  - Route 53 (DNS)                                        │ │
│  │  - Certificate Manager (SSL/TLS)                         │ │
│  │  - VPC (Red privada)                                     │ │
│  │  - Security Groups (Firewall)                            │ │
│  └──────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

### Flujo de Datos:

1. **Admin Panel (Web)**:
   - Usuario accede → CloudFront CDN → S3 (archivos estáticos React)
   - Llamadas API → ALB → EC2 (Backend) → MongoDB Atlas / S3

2. **App Móvil (Android/iOS)**:
   - App → ALB → EC2 (Backend API)
   - Backend → MongoDB Atlas (datos) / S3 (archivos multimedia)
   - Preferencias → Almacenamiento local del dispositivo

3. **Subida de Archivos**:
   - Admin Panel → Backend EC2 → AWS S3 (upload)
   - S3 → CloudFront (distribución global con caché)

4. **Monitoreo y Logs**:
   - Todos los servicios → CloudWatch
   - Métricas, alarmas y dashboards centralizados

---

**Documento generado:** Diciembre 10, 2024  
**Versión del sistema:** 2.0  
**Autor:** Carlos Asparrín  
**Infraestructura:** AWS (Amazon Web Services)
