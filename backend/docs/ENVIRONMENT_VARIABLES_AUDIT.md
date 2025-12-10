# Auditoría de Variables de Entorno

## Resumen de Cambios Realizados

Este documento resume los cambios realizados para eliminar valores hardcodeados y usar variables de entorno en todo el proyecto.

## ✅ Cambios Implementados

### 1. Backend - Configuración de CORS (`backend/src/app.js`)

**Antes:**
```javascript
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:4000',
];
```

**Después:**
```javascript
const defaultOrigins = process.env.NODE_ENV === 'production' 
  ? [] 
  : ['http://localhost:5173', 'http://localhost:3000', 'http://localhost:4000'];

const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim())
  : defaultOrigins;
```

**Beneficio:** En producción, CORS origins se configuran exclusivamente desde variables de entorno.

### 2. Validación de Variables de Entorno

**Nuevo archivo:** `backend/src/config/validateEnv.js`

- Valida que todas las variables requeridas estén presentes
- Verifica la fortaleza del JWT_SECRET en producción
- Muestra advertencias para variables opcionales
- Detiene la aplicación si faltan variables críticas

### 3. Actualización de Archivos .env

**Agregado a `backend/.env.example` y `backend/.env`:**
```bash
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000,http://localhost:4000
```

### 4. Documentación de Despliegue

**Nuevo archivo:** `backend/docs/AWS_DEPLOYMENT_GUIDE.md`

- Guía completa para configurar variables en AWS
- Ejemplos para Secrets Manager, Parameter Store, ECS, Lambda, etc.
- Checklist de seguridad
- Mejores prácticas


## 📋 Variables de Entorno Actuales

### Backend

| Variable | Requerida | Descripción | Valor por Defecto |
|----------|-----------|-------------|-------------------|
| `PORT` | No | Puerto del servidor | `4000` |
| `NODE_ENV` | No | Entorno de ejecución | `development` |
| `MONGODB_URI` | **Sí** | URI de conexión a MongoDB | - |
| `JWT_SECRET` | **Sí** | Secreto para firmar JWT | - |
| `JWT_EXPIRES_IN` | **Sí** | Tiempo de expiración JWT | `7d` |
| `AWS_ACCESS_KEY_ID` | **Sí** | AWS IAM Access Key | - |
| `AWS_SECRET_ACCESS_KEY` | **Sí** | AWS IAM Secret Key | - |
| `AWS_REGION` | **Sí** | Región de AWS | - |
| `S3_BUCKET` | **Sí** | Nombre del bucket S3 | - |
| `ALLOWED_ORIGINS` | No | Orígenes CORS permitidos | localhost (dev) |
| `API_BASE_URL` | No | URL base de la API | `http://localhost:4000` |

### Admin Panel

| Variable | Requerida | Descripción | Valor por Defecto |
|----------|-----------|-------------|-------------------|
| `VITE_API_BASE_URL` | **Sí** | URL de la API backend | `http://localhost:4000/api` |
| `VITE_NODE_ENV` | No | Entorno de ejecución | `development` |

## 🔍 Valores Hardcodeados Identificados (No Críticos)

Los siguientes valores hardcodeados fueron identificados pero NO requieren cambios inmediatos ya que son:
- Datos de ejemplo/seed
- URLs de documentación
- Placeholders en UI

### 1. Seeds y Datos de Ejemplo

**Archivo:** `backend/src/seeds/seedMonuments.js`
- URLs de Google Cloud Storage (datos de ejemplo)
- **Acción:** No requiere cambio, son datos de prueba

**Archivo:** `backend/src/seeds/seedInstitutions.js`
- URLs de sitios web de instituciones reales
- **Acción:** No requiere cambio, son datos de referencia

### 2. Placeholders en UI

**Archivo:** `admin-panel/src/components/InstitutionsManager.jsx`
```javascript
placeholder="https://www.institucion.pe"
```
- **Acción:** No requiere cambio, es un placeholder de UI

### 3. Scripts de Migración

**Archivo:** `backend/src/migrations/migrateGCSStructure.js`
- URLs de Google Cloud Storage (migración histórica)
- **Acción:** No requiere cambio, script de migración legacy

### 4. Tests

**Archivo:** `backend/tests/routes/uploads.test.js`
- URLs mock para testing
- **Acción:** No requiere cambio, son mocks de prueba


## ✅ Estado Actual del Código

### Backend
- ✅ Todas las credenciales usan variables de entorno
- ✅ CORS origins configurables vía `ALLOWED_ORIGINS`
- ✅ Validación automática de variables requeridas
- ✅ Sin valores hardcodeados críticos
- ✅ Documentación completa para AWS deployment

### Admin Panel
- ✅ API URL configurable vía `VITE_API_BASE_URL`
- ✅ Sin credenciales hardcodeadas
- ✅ Listo para build de producción

### App Móvil
- ℹ️ Usa `apiBaseUrl` desde `api_config.dart`
- ℹ️ Requiere configuración manual en el código Dart
- 📝 Considerar usar flutter_dotenv para variables de entorno

## 🚀 Pasos para Despliegue en AWS

1. **Configurar AWS Secrets Manager:**
   ```bash
   aws secretsmanager create-secret \
     --name historiar/production/env \
     --secret-string file://secrets.json
   ```

2. **Configurar variables en el servicio de AWS:**
   - Elastic Beanstalk: Configuration > Software > Environment properties
   - ECS/Fargate: Task Definition > Environment > Secrets
   - Lambda: Function configuration > Environment variables

3. **Actualizar ALLOWED_ORIGINS:**
   ```bash
   ALLOWED_ORIGINS=https://admin.tudominio.com,https://api.tudominio.com
   ```

4. **Verificar deployment:**
   - La aplicación validará automáticamente las variables al iniciar
   - Revisar logs para confirmar que no hay errores de configuración

## 📝 Checklist Pre-Deployment

- [ ] Todas las variables están en AWS Secrets Manager
- [ ] `JWT_SECRET` es fuerte (>32 caracteres, aleatorio)
- [ ] `ALLOWED_ORIGINS` incluye solo dominios de producción
- [ ] Credenciales AWS tienen permisos mínimos necesarios
- [ ] `.env` está en `.gitignore`
- [ ] No hay credenciales en el código fuente
- [ ] Validación de variables está activa (`validateEnv.js`)
- [ ] Tests pasan con variables de entorno de prueba

## 🔒 Seguridad

### Credenciales Actuales en `.env`
⚠️ **IMPORTANTE:** Las credenciales en `backend/.env` son de desarrollo.

**Antes de desplegar a producción:**
1. Generar nuevas credenciales AWS IAM para producción
2. Crear nuevo JWT_SECRET aleatorio
3. Configurar MongoDB Atlas con IP whitelisting
4. Rotar credenciales regularmente

### Mejores Prácticas
- ✅ Usar AWS Secrets Manager para credenciales sensibles
- ✅ Rotar credenciales cada 90 días
- ✅ Usar IAM roles en lugar de access keys cuando sea posible
- ✅ Habilitar MFA en cuentas AWS
- ✅ Auditar accesos regularmente

## 📚 Referencias

- [AWS Secrets Manager](https://docs.aws.amazon.com/secretsmanager/)
- [Twelve-Factor App - Config](https://12factor.net/config)
- [OWASP - Secure Configuration](https://owasp.org/www-project-top-ten/)
