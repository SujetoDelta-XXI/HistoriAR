# Documento de Requerimientos

## Introducción

Esta especificación cubre la mejora integral de la plataforma HistoriAR existente con nuevas funcionalidades incluyendo sistema de recorridos guiados, streaming de 3D Tiles para experiencias AR, funcionalidad de quizzes mejorada, detección de proximidad basada en geolocalización, dashboard de analytics, y organización mejorada de archivos en Google Cloud Storage. El sistema se basa en el backend existente de Node.js con MongoDB, panel de administración React, e implementará una nueva aplicación móvil Flutter para reemplazar el prototipo React actual. La plataforma permitirá a los usuarios realizar recorridos guiados de instituciones, ver modelos 3D en AR usando tecnología de streaming, completar quizzes educativos, y proporcionará a los administradores analytics detallados y capacidades de gestión de contenido.

## Glosario

- **Panel_Admin**: Interfaz administrativa web basada en React para gestionar contenido de HistoriAR
- **App_Movil**: Aplicación móvil Flutter para usuarios finales con integración ARCore/ARKit
- **API_Backend**: Servidor Node.js Express que proporciona endpoints REST API con MongoDB Atlas
- **GCS**: Servicio Google Cloud Storage para almacenamiento organizado de archivos con soporte 3D Tiles
- **Sistema_Recorridos**: Funcionalidad de recorridos guiados con rutas basadas en instituciones y múltiples tipos de tours
- **Experiencias_AR**: Interfaz administrativa dedicada para gestionar modelos 3D separadamente de monumentos
- **Visor_AR**: Componente de realidad aumentada usando streaming 3D Tiles con carga progresiva
- **Servicio_GPS**: Servicio de geolocalización para detección de proximidad de 20 metros y límites institucionales
- **Sistema_Quiz**: Funcionalidad de quiz educativo mejorada con modales emergentes y preferencias de usuario
- **Dashboard_Analytics**: Sistema integral de reportes y métricas para seguimiento de comportamiento de usuarios
- **3D_Tiles**: Formato Cesium 3D Tiles para streaming progresivo y optimización de modelos 3D
- **Geofencing**: Detección basada en ubicación para límites institucionales y proximidad de monumentos
- **Organizacion_Archivos**: Almacenamiento GCS estructurado con carpetas específicas por monumento para modelos e imágenes
- **Prototipo_Figma**: Interfaz base de referencia ubicada en carpeta mobile-app para implementación Flutter

## Requerimientos

### Requerimiento 1

**Historia de Usuario:** Como administrador, quiero crear recorridos guiados para instituciones, para que los usuarios móviles puedan seguir rutas estructuradas a través de monumentos.

#### Criterios de Aceptación

1. CUANDO un administrador accede a la interfaz de Gestión de Recorridos, EL Panel_Admin DEBERÁ mostrar todas las instituciones con sus recorridos disponibles
2. CUANDO se crea un nuevo recorrido, EL Panel_Admin DEBERÁ permitir selección de institución, tipo de recorrido, y lista ordenada de monumentos
3. CUANDO se seleccionan monumentos para un recorrido, EL Panel_Admin DEBERÁ mostrar solo monumentos pertenecientes a la institución seleccionada
4. EL Panel_Admin DEBERÁ soportar tipos de recorrido incluyendo Recomendado, Cronológico, Temático, Arquitectónico, Familiar, Experto, Rápido, y Completo
5. CUANDO se guarda un recorrido, EL API_Backend DEBERÁ validar que todos los monumentos pertenezcan a la institución especificada

### Requerimiento 2

**Historia de Usuario:** Como usuario móvil, quiero ver recorridos disponibles cuando entro a una institución, para poder elegir una experiencia guiada.

#### Criterios de Aceptación

1. CUANDO un usuario entra al límite de una institución, LA App_Movil DEBERÁ detectar la ubicación usando Servicio_GPS
2. CUANDO se detecta la institución, LA App_Movil DEBERÁ mostrar un modal con recorridos disponibles para esa institución
3. EL modal de selección de recorridos DEBERÁ mostrar nombre del recorrido, tipo, duración, número de monumentos, y descripción para cada recorrido
4. CUANDO el usuario selecciona "Explorar libremente", LA App_Movil DEBERÁ cerrar el modal y mostrar un botón flotante de recorrido
5. CUANDO el usuario selecciona un recorrido específico, LA App_Movil DEBERÁ activar modo recorrido y resaltar monumentos del recorrido en azul

### Requerimiento 3

**Historia de Usuario:** Como usuario móvil, quiero ver modelos 3D en AR usando streaming rápido, para poder ver monumentos sin largos tiempos de carga.

#### Criterios de Aceptación

1. CUANDO un usuario está dentro de 20 metros de un monumento con modelo 3D, LA App_Movil DEBERÁ habilitar visualización AR
2. CUANDO se activa AR, EL Visor_AR DEBERÁ hacer streaming del modelo 3D usando formato 3D_Tiles desde GCS
3. EL Visor_AR DEBERÁ mostrar modelo básico (LOD0) dentro de 1 segundo de activación
4. EL Visor_AR DEBERÁ cargar progresivamente niveles de mayor detalle basado en proximidad del usuario y ángulo de vista
5. CUANDO el usuario se aleja del modelo, EL Visor_AR DEBERÁ descargar tiles de detalle innecesarios para conservar memoria

### Requerimiento 4

**Historia de Usuario:** Como administrador, quiero gestionar modelos 3D separadamente de la creación de monumentos, para poder organizar contenido AR eficientemente.

#### Criterios de Aceptación

1. CUANDO se crean monumentos, EL Panel_Admin NO DEBERÁ incluir carga de modelo 3D en el formulario de monumento
2. EL Panel_Admin DEBERÁ proporcionar una interfaz dedicada "Experiencias AR" para gestión de modelos 3D
3. CUANDO se accede a Experiencias AR, EL Panel_Admin DEBERÁ mostrar monumentos en dos secciones: sin modelos 3D primero, luego con modelos 3D
4. CUANDO se carga un modelo 3D, EL API_Backend DEBERÁ crear estructura de carpeta dedicada "models/{monumentId}/" en GCS
5. CUANDO se cargan imágenes de monumento, EL API_Backend DEBERÁ crear estructura de carpeta dedicada "images/{monumentId}/" en GCS
6. CUANDO se carga un modelo 3D, EL API_Backend DEBERÁ procesar el archivo GLB/GLTF a formato 3D_Tiles automáticamente
7. EL API_Backend DEBERÁ almacenar 3D_Tiles en la carpeta específica del monumento con metadata tileset.json apropiado

### Requerimiento 5

**Historia de Usuario:** Como usuario móvil, quiero realizar quizzes educativos sobre monumentos, para poder probar mis conocimientos.

#### Criterios de Aceptación

1. CUANDO un usuario sale de la vista AR de un monumento, LA App_Movil DEBERÁ mostrar un modal de solicitud de quiz
2. EL modal de solicitud de quiz DEBERÁ ofrecer opciones: "Sí", "No", y "No volver a preguntar"
3. CUANDO se selecciona "No volver a preguntar", LA App_Movil DEBERÁ guardar preferencia del usuario y no mostrar solicitudes de quiz nuevamente
4. EL quiz DEBERÁ contener 3-5 preguntas de opción múltiple con 2-4 opciones cada una
5. CUANDO se completa el quiz, LA App_Movil DEBERÁ mostrar resultados con respuestas correctas y explicaciones

### Requerimiento 6

**Historia de Usuario:** Como usuario móvil, quiero activación AR basada en proximidad, para que las experiencias AR sean apropiadas para la ubicación.

#### Criterios de Aceptación

1. LA App_Movil DEBERÁ monitorear continuamente la ubicación del usuario usando Servicio_GPS con alta precisión
2. CUANDO se calcula distancia a monumentos, LA App_Movil DEBERÁ usar fórmula Haversine para medición precisa
3. LA App_Movil DEBERÁ habilitar visualización AR solo cuando el usuario esté dentro de 20 metros de un monumento
4. LA App_Movil DEBERÁ mostrar marcadores de monumentos con diferentes colores: naranja (normal), verde (visitado), azul (en recorrido activo), gris (fuera de rango)
5. CUANDO el usuario se mueve más allá de 20 metros durante sesión AR, EL Visor_AR DEBERÁ mostrar advertencia de proximidad y pausar AR

### Requerimiento 7

**Historia de Usuario:** Como administrador, quiero ver analytics integrales sobre comportamiento de usuarios, para poder entender el uso de la plataforma.

#### Criterios de Aceptación

1. EL API_Backend DEBERÁ rastrear actividades de usuarios incluyendo vistas de monumentos, sesiones AR, completaciones de recorridos, e intentos de quiz
2. EL Dashboard_Analytics DEBERÁ mostrar métricas para total de usuarios, vistas de monumentos, completaciones de recorridos, y sesiones AR
3. EL Dashboard_Analytics DEBERÁ mostrar monumentos principales, recorridos más populares, y tasas de completación de quiz
4. EL Dashboard_Analytics DEBERÁ proporcionar filtrado por rango de fechas, institución, y tipo de recorrido
5. EL Dashboard_Analytics DEBERÁ mostrar métricas de engagement de usuarios incluyendo tiempo promedio de sesión y visitas de retorno

### Requerimiento 8

**Historia de Usuario:** Como administrador de sistema, quiero manejo apropiado de errores para GPS, AR, y fallas de streaming, para que los usuarios reciban retroalimentación clara.

#### Criterios de Aceptación

1. CUANDO se niegan permisos GPS, LA App_Movil DEBERÁ mostrar solicitud clara de permisos con explicación de uso
2. CUANDO ARCore/ARKit no está disponible, LA App_Movil DEBERÁ mostrar mensaje de compatibilidad de dispositivo
3. CUANDO falla streaming de 3D_Tiles, EL Visor_AR DEBERÁ mostrar error de carga y ofrecer opción de reintentar
4. CUANDO el usuario está fuera del rango de 20 metros, LA App_Movil DEBERÁ mostrar indicador de distancia y mensaje "acércate más"
5. EL API_Backend DEBERÁ registrar todos los errores GPS, AR, y streaming con contexto de usuario para debugging

### Requerimiento 9

**Historia de Usuario:** Como usuario móvil, quiero que la app funcione eficientemente con mi plan de datos, para que las experiencias AR no consuman datos móviles excesivos.

#### Criterios de Aceptación

1. EL streaming de 3D_Tiles DEBERÁ priorizar carga basada en ángulo de vista del usuario y distancia
2. LA App_Movil DEBERÁ cachear tiles frecuentemente accedidos localmente para reducir descargas repetidas
3. LA App_Movil DEBERÁ proporcionar advertencias de uso de datos cuando haga streaming sobre redes móviles
4. EL Visor_AR DEBERÁ ajustar automáticamente calidad basada en velocidad de red y tipo de conexión
5. LA App_Movil DEBERÁ permitir a usuarios configurar preferencias de uso de datos en configuraciones

### Requerimiento 10

**Historia de Usuario:** Como administrador, quiero gestionar contenido de quiz para cada monumento, para poder proporcionar valor educativo.

#### Criterios de Aceptación

1. EL Panel_Admin DEBERÁ proporcionar interfaz de gestión de quiz vinculada a monumentos
2. CUANDO se crean preguntas de quiz, EL Panel_Admin DEBERÁ enforcar 3-5 preguntas por quiz con 2-4 opciones cada una
3. EL Panel_Admin DEBERÁ requerir exactamente una respuesta correcta por pregunta con explicación opcional
4. EL Panel_Admin DEBERÁ validar contenido de quiz antes de guardar y mostrar funcionalidad de vista previa
5. EL API_Backend DEBERÁ almacenar intentos de quiz con respuestas de usuarios para analytics y mejora

### Requerimiento 11

**Historia de Usuario:** Como administrador de sistema, quiero almacenamiento organizado de archivos en Google Cloud Storage, para que los assets de monumentos estén apropiadamente estructurados y sean manejables.

#### Criterios de Aceptación

1. EL API_Backend DEBERÁ crear carpetas específicas por monumento en GCS siguiendo el patrón "models/{monumentId}/" para modelos 3D
2. EL API_Backend DEBERÁ crear carpetas específicas por monumento en GCS siguiendo el patrón "images/{monumentId}/" para imágenes de monumentos
3. CUANDO se elimina un monumento, EL API_Backend DEBERÁ remover todos los archivos asociados de ambas carpetas models e images
4. EL API_Backend DEBERÁ mantener referencias de archivos en el modelo Monument apuntando a la estructura de carpetas organizada
5. LA estructura de carpetas GCS DEBERÁ soportar múltiples archivos por monumento para diferentes formatos de modelo y variaciones de imagen

### Requerimiento 12

**Historia de Usuario:** Como usuario móvil, quiero una aplicación Flutter nativa, para poder tener rendimiento óptimo e integración nativa de dispositivo.

#### Criterios de Aceptación

1. LA App_Movil DEBERÁ ser desarrollada usando framework Flutter con lenguaje de programación Dart
2. LA App_Movil DEBERÁ integrarse con ARCore para Android y ARKit para iOS para funcionalidad AR
3. LA App_Movil DEBERÁ implementar servicios GPS nativos para seguimiento preciso de ubicación
4. LA App_Movil DEBERÁ proporcionar navegación fluida entre vista de mapa, vista AR, gestión de recorridos, y perfil de usuario
5. LA App_Movil DEBERÁ usar como base de diseño las interfaces del Prototipo_Figma ubicado en carpeta mobile-app
6. LA App_Movil DEBERÁ cachear preferencias de usuario y datos de recorrido localmente para funcionalidad offline

### Requerimiento 13

**Historia de Usuario:** Como administrador, quiero analytics integrales sobre uso de plataforma, para poder tomar decisiones basadas en datos sobre contenido y características.

#### Criterios de Aceptación

1. EL Dashboard_Analytics DEBERÁ rastrear y mostrar métricas de engagement de usuarios incluyendo duración de sesión, vistas de monumentos, y completaciones de recorridos
2. EL Dashboard_Analytics DEBERÁ proporcionar analytics específicos por institución mostrando monumentos más populares y tipos de recorrido
3. EL Dashboard_Analytics DEBERÁ mostrar analytics de rendimiento de quiz incluyendo puntuaciones promedio y preguntas más difíciles
4. EL Dashboard_Analytics DEBERÁ mostrar patrones de uso geográfico y horarios pico de uso
5. EL API_Backend DEBERÁ implementar seguimiento de actividad de usuario para todas las interacciones principales sin almacenar información personalmente identificable