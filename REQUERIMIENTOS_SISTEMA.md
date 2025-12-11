# Requerimientos del Sistema HistoriAR

## Descripción General del Sistema

HistoriAR es un sistema integral de gestión y visualización de monumentos históricos con realidad aumentada, compuesto por tres componentes principales:

1. **Backend API** - API RESTful con Node.js/Express y MongoDB
2. **Admin Panel** - Panel web de administración con React
3. **App Móvil** - Aplicación móvil con Flutter

---

## 1. REQUERIMIENTOS FUNCIONALES

### 1.1 Backend API

#### RF-BE-01: Gestión de Autenticación y Autorización
- **RF-BE-01.1**: El sistema debe permitir el registro de usuarios con email y contraseña
- **RF-BE-01.2**: El sistema debe permitir el inicio de sesión con credenciales válidas
- **RF-BE-01.3**: El sistema debe generar tokens JWT con expiración configurable
- **RF-BE-01.4**: El sistema debe validar tokens JWT en rutas protegidas
- **RF-BE-01.5**: El sistema debe soportar dos roles: `user` (usuario móvil) y `admin` (administrador)
- **RF-BE-01.6**: El sistema debe restringir operaciones CRUD solo a usuarios con rol `admin`

#### RF-BE-02: Gestión de Monumentos
- **RF-BE-02.1**: El sistema debe permitir crear monumentos con nombre, descripción, categoría, ubicación, período histórico y cultura
- **RF-BE-02.2**: El sistema debe permitir actualizar información de monumentos existentes
- **RF-BE-02.3**: El sistema debe permitir eliminar monumentos (soft delete con estado "Borrado")
- **RF-BE-02.4**: El sistema debe permitir listar monumentos con paginación
- **RF-BE-02.5**: El sistema debe permitir filtrar monumentos por categoría, distrito, institución y estado
- **RF-BE-02.6**: El sistema debe permitir búsqueda de texto completo en nombre y descripción
- **RF-BE-02.7**: El sistema debe almacenar coordenadas geográficas (latitud/longitud) para cada monumento
- **RF-BE-02.8**: El sistema debe soportar tres estados: "Disponible", "Oculto", "Borrado"
- **RF-BE-02.9**: El sistema debe asociar monumentos con instituciones
- **RF-BE-02.10**: El sistema debe almacenar URLs de imágenes y modelos 3D en AWS S3

#### RF-BE-03: Gestión de Archivos Multimedia
- **RF-BE-03.1**: El sistema debe permitir subir imágenes de monumentos a AWS S3
- **RF-BE-03.2**: El sistema debe permitir subir modelos 3D en formato GLB/GLTF a AWS S3
- **RF-BE-03.3**: El sistema debe generar URLs públicas para acceso a archivos
- **RF-BE-03.4**: El sistema debe organizar archivos por tipo (images/, models/) y por monumento
- **RF-BE-03.5**: El sistema debe permitir eliminar archivos de S3
- **RF-BE-03.6**: El sistema debe validar tipos de archivo (imágenes: jpg, png; modelos: glb, gltf)
- **RF-BE-03.7**: El sistema debe soportar procesamiento opcional de 3D Tiles para modelos grandes

#### RF-BE-04: Gestión de Instituciones
- **RF-BE-04.1**: El sistema debe permitir crear instituciones con nombre, tipo, descripción y contacto
- **RF-BE-04.2**: El sistema debe soportar tipos: "Museo", "Universidad", "Municipalidad", "Otro"
- **RF-BE-04.3**: El sistema debe almacenar ubicación geográfica de instituciones
- **RF-BE-04.4**: El sistema debe permitir configurar horarios de atención por día de la semana
- **RF-BE-04.5**: El sistema debe permitir definir un radio de cobertura en metros
- **RF-BE-04.6**: El sistema debe validar que instituciones tengan imagen y horarios antes de estar "Disponible"
- **RF-BE-04.7**: El sistema debe permitir actualizar y eliminar instituciones

#### RF-BE-05: Gestión de Categorías
- **RF-BE-05.1**: El sistema debe permitir crear categorías con nombre, descripción, icono y color
- **RF-BE-05.2**: El sistema debe soportar más de 50 iconos predefinidos
- **RF-BE-05.3**: El sistema debe permitir listar, actualizar y eliminar categorías
- **RF-BE-05.4**: El sistema debe asociar monumentos con categorías

#### RF-BE-06: Sistema de Tours
- **RF-BE-06.1**: El sistema debe permitir crear tours con nombre, descripción y duración estimada
- **RF-BE-06.2**: El sistema debe asociar tours con instituciones
- **RF-BE-06.3**: El sistema debe soportar tipos de tour: "Recomendado", "Cronológico", "Temático", "Arquitectónico", "Familiar", "Experto", "Rápido", "Completo"
- **RF-BE-06.4**: El sistema debe permitir agregar monumentos a tours con orden específico
- **RF-BE-06.5**: El sistema debe permitir agregar descripciones personalizadas por monumento en el tour
- **RF-BE-06.6**: El sistema debe permitir activar/desactivar tours
- **RF-BE-06.7**: El sistema debe permitir filtrar tours por institución y tipo
- **RF-BE-06.8**: El sistema debe calcular duración estimada en minutos

#### RF-BE-07: Sistema de Quizzes
- **RF-BE-07.1**: El sistema debe permitir crear quizzes asociados a monumentos
- **RF-BE-07.2**: El sistema debe permitir crear preguntas con 2-4 opciones de respuesta
- **RF-BE-07.3**: El sistema debe validar que cada pregunta tenga exactamente una respuesta correcta
- **RF-BE-07.4**: El sistema debe validar que cada quiz tenga entre 3 y 5 preguntas
- **RF-BE-07.5**: El sistema debe permitir agregar explicaciones a las respuestas
- **RF-BE-07.6**: El sistema debe permitir registrar intentos de quiz con respuestas del usuario
- **RF-BE-07.7**: El sistema debe calcular puntaje automáticamente
- **RF-BE-07.8**: El sistema debe almacenar historial de intentos por usuario
- **RF-BE-07.9**: El sistema debe permitir activar/desactivar quizzes

#### RF-BE-08: Geolocalización
- **RF-BE-08.1**: El sistema debe detectar la institución más cercana basada en coordenadas GPS
- **RF-BE-08.2**: El sistema debe calcular distancia usando fórmula de Haversine
- **RF-BE-08.3**: El sistema debe listar monumentos cercanos con distancia calculada
- **RF-BE-08.4**: El sistema debe listar tours disponibles por ubicación
- **RF-BE-08.5**: El sistema debe validar que el usuario esté dentro del radio de cobertura de la institución

#### RF-BE-09: Versionado de Modelos 3D
- **RF-BE-09.1**: El sistema debe mantener historial completo de versiones de modelos 3D
- **RF-BE-09.2**: El sistema debe permitir restaurar versiones anteriores
- **RF-BE-09.3**: El sistema debe permitir eliminar versiones antiguas
- **RF-BE-09.4**: El sistema debe organizar versiones por carpetas en S3
- **RF-BE-09.5**: El sistema debe marcar una versión como activa

#### RF-BE-10: Gestión de Usuarios
- **RF-BE-10.1**: El sistema debe permitir listar usuarios con paginación
- **RF-BE-10.2**: El sistema debe permitir actualizar información de usuarios
- **RF-BE-10.3**: El sistema debe permitir cambiar estado de usuarios: "Activo", "Suspendido", "Eliminado"
- **RF-BE-10.4**: El sistema debe permitir filtrar usuarios por rol y distrito
- **RF-BE-10.5**: El sistema debe almacenar avatar, distrito y fecha de registro

#### RF-BE-11: Registro de Visitas (Continuación)
- **RF-BE-11.1**: El sistema debe permitir consultar estadísticas de visitas por monumento
- **RF-BE-11.2**: El sistema debe permitir consultar estadísticas de visitas por usuario

#### RF-BE-12: Registro de Visitas
- **RF-BE-12.1**: El sistema debe registrar visitas a monumentos con timestamp
- **RF-BE-12.2**: El sistema debe asociar visitas con usuarios
- **RF-BE-12.3**: El sistema debe permitir consultar historial de visitas

#### RF-BE-13: Datos Históricos
- **RF-BE-13.1**: El sistema debe permitir crear y gestionar datos históricos asociados a monumentos
- **RF-BE-13.2**: El sistema debe permitir almacenar información histórica detallada

---

### 1.2 Admin Panel (Panel de Administración Web)

#### RF-AP-01: Autenticación de Administradores
- **RF-AP-01.1**: El panel debe permitir login con email y contraseña
- **RF-AP-01.2**: El panel debe validar que el usuario tenga rol `admin`
- **RF-AP-01.3**: El panel debe implementar rate limiting (máximo 5 intentos, bloqueo de 5 minutos)
- **RF-AP-01.4**: El panel debe mostrar contador de intentos restantes
- **RF-AP-01.5**: El panel debe cerrar sesión automáticamente cuando el token expire
- **RF-AP-01.6**: El panel debe validar tokens contra el servidor

#### RF-AP-02: Dashboard Analítico
- **RF-AP-02.1**: El panel debe mostrar métricas de usuarios activos
- **RF-AP-02.2**: El panel debe mostrar estadísticas de visitas
- **RF-AP-02.3**: El panel debe mostrar estadísticas de sesiones AR
- **RF-AP-02.4**: El panel debe mostrar gráficos de tendencias temporales
- **RF-AP-02.5**: El panel debe mostrar alertas y notificaciones importantes

#### RF-AP-03: Gestión de Monumentos
- **RF-AP-03.1**: El panel debe permitir crear monumentos con formulario completo
- **RF-AP-03.2**: El panel debe permitir editar monumentos existentes
- **RF-AP-03.3**: El panel debe permitir eliminar monumentos
- **RF-AP-03.4**: El panel debe permitir subir imágenes con drag & drop
- **RF-AP-03.5**: El panel debe permitir subir modelos 3D con drag & drop
- **RF-AP-03.6**: El panel debe mostrar preview de imágenes
- **RF-AP-03.7**: El panel debe validar formatos de archivo
- **RF-AP-03.8**: El panel debe permitir asignar categoría e institución
- **RF-AP-03.9**: El panel debe permitir ingresar coordenadas geográficas
- **RF-AP-03.10**: El panel debe listar monumentos con paginación y filtros

#### RF-AP-04: Gestión de Instituciones
- **RF-AP-04.1**: El panel debe permitir crear instituciones con formulario completo
- **RF-AP-04.2**: El panel debe permitir configurar horarios por día
- **RF-AP-04.3**: El panel debe permitir subir imagen de institución
- **RF-AP-04.4**: El panel debe permitir ingresar ubicación y radio de cobertura
- **RF-AP-04.5**: El panel debe validar completitud antes de cambiar estado a "Disponible"
- **RF-AP-04.6**: El panel debe listar instituciones con filtros

#### RF-AP-05: Gestión de Categorías
- **RF-AP-05.1**: El panel debe permitir crear categorías con nombre, descripción, icono y color
- **RF-AP-05.2**: El panel debe mostrar selector de iconos con más de 50 opciones
- **RF-AP-05.3**: El panel debe mostrar selector de colores
- **RF-AP-05.4**: El panel debe permitir editar y eliminar categorías
- **RF-AP-05.5**: El panel debe listar categorías con preview visual

#### RF-AP-06: Gestión de Tours
- **RF-AP-06.1**: El panel debe permitir crear tours con formulario
- **RF-AP-06.2**: El panel debe permitir agregar monumentos al tour con orden
- **RF-AP-06.3**: El panel debe permitir reordenar monumentos en el tour
- **RF-AP-06.4**: El panel debe permitir agregar descripciones por monumento
- **RF-AP-06.5**: El panel debe calcular duración estimada
- **RF-AP-06.6**: El panel debe permitir activar/desactivar tours
- **RF-AP-06.7**: El panel debe listar tours con filtros

#### RF-AP-07: Gestión de Quizzes
- **RF-AP-07.1**: El panel debe permitir crear quizzes asociados a monumentos
- **RF-AP-07.2**: El panel debe permitir agregar preguntas con opciones
- **RF-AP-07.3**: El panel debe validar que haya exactamente una respuesta correcta
- **RF-AP-07.4**: El panel debe validar que haya entre 3 y 5 preguntas
- **RF-AP-07.5**: El panel debe permitir agregar explicaciones
- **RF-AP-07.6**: El panel debe permitir editar y eliminar quizzes
- **RF-AP-07.7**: El panel debe mostrar estadísticas de intentos

#### RF-AP-08: Gestión de Usuarios
- **RF-AP-08.1**: El panel debe listar usuarios de la app móvil
- **RF-AP-08.2**: El panel debe permitir cambiar estado de usuarios
- **RF-AP-08.3**: El panel debe permitir filtrar por rol y distrito
- **RF-AP-08.4**: El panel debe mostrar estadísticas de actividad por usuario

#### RF-AP-09: Gestión de Experiencias AR
- **RF-AP-09.1**: El panel debe permitir gestionar experiencias de realidad aumentada
- **RF-AP-09.2**: El panel debe permitir asociar experiencias con monumentos

#### RF-AP-10: Gestión de Datos Históricos
- **RF-AP-10.1**: El panel debe permitir crear y editar datos históricos
- **RF-AP-10.2**: El panel debe permitir asociar datos históricos con monumentos

---

### 1.3 App Móvil (Flutter)

#### RF-AM-01: Autenticación de Usuarios
- **RF-AM-01.1**: La app debe permitir login con email y contraseña
- **RF-AM-01.2**: La app debe permitir registro de nuevos usuarios
- **RF-AM-01.3**: La app debe mantener sesión activa con token JWT
- **RF-AM-01.4**: La app debe cerrar sesión automáticamente cuando expire el token

#### RF-AM-02: Pantalla de Exploración
- **RF-AM-02.1**: La app debe mostrar un mapa interactivo centrado en Lima
- **RF-AM-02.2**: La app debe mostrar marcadores de monumentos en el mapa
- **RF-AM-02.3**: La app debe permitir centrar el mapa en la ubicación actual del usuario
- **RF-AM-02.4**: La app debe solicitar permisos de ubicación en tiempo de ejecución
- **RF-AM-02.5**: La app debe mostrar información de monumentos al tocar marcadores
- **RF-AM-02.6**: La app debe permitir navegar a detalles de monumentos

#### RF-AM-03: Cámara AR (Realidad Aumentada)
- **RF-AM-03.1**: La app debe activar la cámara del dispositivo
- **RF-AM-03.2**: La app debe detectar superficies para colocar modelos 3D
- **RF-AM-03.3**: La app debe cargar modelos 3D desde URLs de S3
- **RF-AM-03.4**: La app debe permitir visualizar monumentos en AR
- **RF-AM-03.5**: La app debe permitir interactuar con modelos 3D (rotar, escalar)

#### RF-AM-04: Mis Tours
- **RF-AM-04.1**: La app debe listar tours disponibles
- **RF-AM-04.2**: La app debe mostrar tours recomendados según ubicación
- **RF-AM-04.3**: La app debe mostrar detalles de tours (monumentos, duración)
- **RF-AM-04.4**: La app debe permitir iniciar un tour
- **RF-AM-04.5**: La app debe guiar al usuario por los monumentos del tour en orden
- **RF-AM-04.6**: La app debe marcar progreso del tour

#### RF-AM-05: Quizzes
- **RF-AM-05.1**: La app debe mostrar quizzes disponibles por monumento
- **RF-AM-05.2**: La app debe presentar preguntas una por una
- **RF-AM-05.3**: La app debe permitir seleccionar respuestas
- **RF-AM-05.4**: La app debe mostrar retroalimentación inmediata
- **RF-AM-05.5**: La app debe mostrar explicaciones de respuestas
- **RF-AM-05.6**: La app debe calcular y mostrar puntaje final
- **RF-AM-05.7**: La app debe guardar historial de intentos

#### RF-AM-06: Perfil de Usuario
- **RF-AM-06.1**: La app debe mostrar información del usuario
- **RF-AM-06.2**: La app debe permitir editar perfil (nombre, avatar, distrito)
- **RF-AM-06.3**: La app debe mostrar historial de visitas
- **RF-AM-06.4**: La app debe mostrar estadísticas de quizzes completados
- **RF-AM-06.5**: La app debe permitir cerrar sesión

#### RF-AM-07: Configuración y Preferencias
- **RF-AM-07.1**: La app debe permitir configurar preferencias de notificaciones
- **RF-AM-07.2**: La app debe permitir configurar preferencias de privacidad
- **RF-AM-07.3**: La app debe mostrar información de la app (versión, términos)
- **RF-AM-07.4**: La app debe guardar preferencias de usuario localmente (SharedPreferences/UserDefaults)
- **RF-AM-07.5**: La app debe permitir configurar preferencias de quizzes (dificultad, categorías favoritas)
- **RF-AM-07.6**: La app debe persistir preferencias entre sesiones

---

## 2. REQUERIMIENTOS NO FUNCIONALES

### RNF-01: Rendimiento

#### RNF-01.1: Tiempo de Respuesta
- Las consultas de lectura del backend deben responder en menos de 500ms
- Las operaciones de escritura deben completarse en menos de 1 segundo
- La carga inicial del admin panel debe completarse en menos de 3 segundos
- La app móvil debe cargar la pantalla principal en menos de 2 segundos

#### RNF-01.2: Capacidad
- El backend debe soportar al menos 1000 usuarios concurrentes
- El sistema debe soportar al menos 500 monumentos
- El sistema debe soportar archivos de hasta 50MB para modelos 3D
- El sistema debe soportar imágenes de hasta 5MB

#### RNF-01.3: Optimización
- El backend debe implementar índices en MongoDB para queries frecuentes
- El admin panel debe implementar paginación para listas grandes
- La app móvil debe implementar caché de imágenes
- Los modelos 3D deben estar optimizados para dispositivos móviles

### RNF-02: Seguridad

#### RNF-02.1: Autenticación y Autorización
- Todas las contraseñas deben almacenarse con hash bcrypt
- Los tokens JWT deben tener expiración configurable
- Las rutas administrativas deben estar protegidas por middleware de autenticación
- El admin panel debe implementar rate limiting contra ataques de fuerza bruta

#### RNF-02.2: Protección de Datos
- Las comunicaciones deben usar HTTPS en producción
- Los datos sensibles no deben exponerse en logs
- Las variables de entorno deben estar protegidas
- Los archivos en S3 deben tener permisos configurados correctamente

#### RNF-02.3: Validación
- Todas las entradas de usuario deben ser validadas
- Los archivos subidos deben validarse por tipo y tamaño
- Las coordenadas geográficas deben validarse en rangos válidos
- Los emails deben validarse con formato correcto

### RNF-03: Disponibilidad

#### RNF-03.1: Uptime
- El sistema debe tener disponibilidad del 99.5% en producción
- El backend debe implementar manejo de errores robusto
- El sistema debe recuperarse automáticamente de errores transitorios

#### RNF-03.2: Tolerancia a Fallos
- El sistema debe continuar funcionando si S3 está temporalmente no disponible
- La app móvil debe funcionar offline con datos en caché
- El sistema debe implementar reintentos automáticos para operaciones fallidas

### RNF-04: Escalabilidad

#### RNF-04.1: Escalabilidad Horizontal
- El backend debe ser stateless para permitir múltiples instancias
- El sistema debe soportar despliegue en Vercel como serverless functions
- MongoDB debe soportar réplicas para lectura

#### RNF-04.2: Escalabilidad de Almacenamiento
- AWS S3 debe manejar crecimiento ilimitado de archivos
- MongoDB debe soportar sharding para grandes volúmenes de datos

### RNF-05: Mantenibilidad

#### RNF-05.1: Código
- El código debe seguir convenciones de estilo consistentes
- El código debe estar modularizado y organizado por capas
- El código debe incluir comentarios en secciones complejas
- El código debe seguir principios SOLID

#### RNF-05.2: Documentación
- Cada endpoint del API debe estar documentado
- Los modelos de datos deben estar documentados
- Los scripts de migración deben incluir instrucciones
- El README debe incluir guías de instalación y uso

#### RNF-05.3: Testing
- El backend debe incluir tests unitarios para servicios críticos
- El backend debe incluir tests de integración para endpoints
- El código debe tener cobertura de tests superior al 70%

### RNF-06: Usabilidad

#### RNF-06.1: Interfaz de Usuario
- El admin panel debe ser responsivo (desktop, tablet)
- La app móvil debe seguir guías de diseño Material Design
- Los formularios deben incluir validación en tiempo real
- Los mensajes de error deben ser claros y accionables

#### RNF-06.2: Experiencia de Usuario
- Las operaciones deben proporcionar feedback visual inmediato
- Los estados de carga deben mostrarse con indicadores
- Las acciones destructivas deben requerir confirmación
- La navegación debe ser intuitiva y consistente

### RNF-07: Compatibilidad

#### RNF-07.1: Navegadores (Admin Panel)
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

#### RNF-07.2: Dispositivos Móviles (App)
- Android 8.0+ (API 26+)
- iOS 12.0+
- Soporte para ARCore (Android) y ARKit (iOS)

#### RNF-07.3: Resoluciones
- Admin Panel: 1280x720 mínimo
- App Móvil: 360x640 mínimo

### RNF-08: Portabilidad

#### RNF-08.1: Despliegue
- El backend debe desplegarse en AWS (EC2 o Elastic Beanstalk)
- El admin panel debe desplegarse en AWS S3 + CloudFront
- La app móvil debe poder compilarse para Android e iOS

#### RNF-08.2: Configuración
- Todas las configuraciones deben manejarse por variables de entorno
- El sistema debe soportar múltiples entornos (development, staging, production)
- Las credenciales AWS deben gestionarse mediante IAM roles o Secrets Manager

### RNF-09: Cumplimiento y Estándares

#### RNF-09.1: APIs
- El backend debe seguir principios REST
- Los endpoints deben usar verbos HTTP correctos
- Las respuestas deben usar códigos de estado HTTP apropiados
- Las respuestas deben seguir formato JSON consistente

#### RNF-09.2: Datos
- Las fechas deben almacenarse en formato ISO 8601
- Las coordenadas deben usar formato decimal (WGS84)
- Los archivos deben seguir convenciones de nomenclatura

### RNF-10: Monitoreo y Logging

#### RNF-10.1: Logs
- El sistema debe registrar errores con stack traces
- El sistema debe registrar operaciones críticas (login, CRUD)
- Los logs deben incluir timestamps y contexto
- Los logs no deben incluir información sensible

#### RNF-10.2: Métricas
- El sistema debe registrar tiempos de respuesta
- El sistema debe registrar tasas de error
- El sistema debe registrar uso de recursos

### RNF-11: Backup y Recuperación

#### RNF-11.1: Respaldos
- MongoDB debe tener respaldos automáticos diarios
- Los archivos de S3 deben tener versionado habilitado
- Los respaldos deben retenerse por al menos 30 días

#### RNF-11.2: Recuperación
- El sistema debe poder restaurarse desde backup en menos de 4 horas
- Las migraciones de base de datos deben ser reversibles cuando sea posible

---

## 3. RESTRICCIONES Y DEPENDENCIAS

### 3.1 Tecnológicas
- Node.js 18+
- MongoDB 6.0+
- React 18+
- Flutter 3.0+
- AWS S3 para almacenamiento
- AWS para despliegue del backend y admin panel

### 3.2 Externas
- Dependencia de servicios de AWS (S3)
- Dependencia de MongoDB Atlas o servidor MongoDB
- Dependencia de servicios de geolocalización del dispositivo
- Dependencia de ARCore/ARKit para funcionalidad AR

### 3.3 Regulatorias
- Cumplimiento con políticas de privacidad de datos
- Cumplimiento con términos de servicio de AWS
- Cumplimiento con políticas de app stores (Google Play, App Store)

---

## 4. CASOS DE USO PRINCIPALES

### CU-01: Administrador crea un monumento
1. Admin inicia sesión en el panel
2. Admin navega a "Monumentos"
3. Admin hace clic en "Crear Monumento"
4. Admin completa formulario con datos del monumento
5. Admin sube imagen y modelo 3D
6. Admin asigna categoría e institución
7. Sistema valida datos y archivos
8. Sistema sube archivos a S3
9. Sistema crea registro en MongoDB
10. Sistema muestra confirmación

### CU-02: Usuario móvil explora monumentos cercanos
1. Usuario abre la app
2. Usuario navega a "Explorar"
3. App solicita permisos de ubicación
4. Usuario otorga permisos
5. App obtiene ubicación actual
6. App consulta monumentos cercanos al backend
7. Backend calcula distancias con Haversine
8. App muestra monumentos en mapa con marcadores
9. Usuario toca marcador
10. App muestra detalles del monumento

### CU-03: Usuario móvil visualiza monumento en AR
1. Usuario selecciona un monumento
2. Usuario toca botón "Ver en AR"
3. App activa cámara
4. App descarga modelo 3D desde S3
5. App detecta superficie plana
6. Usuario toca para colocar modelo
7. App renderiza modelo 3D en AR
8. Usuario interactúa con modelo (rotar, escalar)

### CU-04: Usuario móvil completa un quiz
1. Usuario selecciona un monumento
2. Usuario toca "Tomar Quiz"
3. App carga quiz desde backend
4. App muestra primera pregunta
5. Usuario selecciona respuesta
6. App muestra retroalimentación
7. App muestra siguiente pregunta
8. Usuario completa todas las preguntas
9. App calcula puntaje
10. App envía intento al backend
11. App muestra resultados y estadísticas

---

## 5. PRIORIZACIÓN

### Prioridad Alta (Crítico)
- RF-BE-01: Autenticación y autorización
- RF-BE-02: Gestión de monumentos
- RF-BE-03: Gestión de archivos multimedia
- RF-AP-01: Autenticación de administradores
- RF-AP-03: Gestión de monumentos
- RF-AM-01: Autenticación de usuarios
- RF-AM-02: Pantalla de exploración
- RNF-02: Seguridad

### Prioridad Media (Importante)
- RF-BE-04: Gestión de instituciones
- RF-BE-05: Gestión de categorías
- RF-BE-06: Sistema de tours
- RF-BE-07: Sistema de quizzes
- RF-AP-04 a RF-AP-07: Gestión de entidades
- RF-AM-03: Cámara AR
- RF-AM-04: Mis tours
- RF-AM-05: Quizzes
- RNF-01: Rendimiento
- RNF-06: Usabilidad

### Prioridad Baja (Deseable)
- RF-BE-09: Versionado de modelos 3D
- RF-BE-11: Estadísticas de visitas
- RF-AP-02: Dashboard analítico
- RF-AM-06: Perfil de usuario
- RF-AM-07: Configuración y preferencias locales
- RNF-10: Monitoreo y logging

---

**Documento generado:** Diciembre 10, 2024  
**Versión del sistema:** 2.0  
**Estado:** Producción
