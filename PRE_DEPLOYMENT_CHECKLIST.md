# ✅ Checklist Pre-Despliegue - HistoriAR

## 🔍 Auditoría Completa del Proyecto

Fecha: 2024
Estado: En Revisión

---

## 1. Variables de Entorno

### Backend
- [x] Todas las credenciales usan variables de entorno
- [x] `MONGODB_URI` estandarizado (no `MONGO_URI`)
- [x] `ALLOWED_ORIGINS` configurado para CORS
- [x] AWS credentials en variables de entorno
- [x] JWT_SECRET en variable de entorno
- [x] Validación automática implementada
- [x] `.env.example` actualizado

### Admin Panel
- [x] `VITE_API_BASE_URL` configurado
- [x] Sin credenciales hardcodeadas
- [x] `.env.example` presente

---

## 2. Seguridad

### Credenciales
- [ ] ⚠️ JWT_SECRET debe cambiarse en producción (actual: "supersecreto_historiar")
- [ ] ⚠️ Generar nuevas credenciales AWS para producción
- [x] Credenciales AWS actuales funcionan para desarrollo
- [x] No hay credenciales en el código fuente
- [x] `.env` está en `.gitignore`

### CORS
- [x] CORS configurado con `ALLOWED_ORIGINS`
- [ ] ⚠️ Actualizar `ALLOWED_ORIGINS` con URLs de producción

### MongoDB
- [x] Connection string usa variable de entorno
- [ ] ⚠️ Configurar IP whitelisting en MongoDB Atlas para producción

---

## 3. Configuración de Archivos

### Límites de Tamaño
- [x] Modelos 3D: 50MB máximo
- [x] Imágenes: 5MB máximo
- [x] Límites consistentes en todos los endpoints

### Multer
- [x] Configuración correcta en `monuments.routes.js`
- [x] Configuración correcta en `uploads.routes.js`
- [x] Configuración correcta en `utils/uploader.js`

---

## 4. Estructura del Código

### Sin Valores Hardcodeados
- [x] No hay URLs de API hardcodeadas (excepto fallbacks dev)
- [x] No hay credenciales hardcodeadas
- [x] No hay CORS origins hardcodeados en producción
- [x] Localhost solo en desarrollo

### Consistencia
- [x] Uso consistente de `MONGODB_URI`
- [x] Uso consistente de variables de entorno
- [x] Código limpio de referencias a `MONGO_URI`

---

## 5. Documentación

### Guías Creadas
- [x] `AWS_DEPLOYMENT_GUIDE.md` - Guía completa de despliegue
- [x] `ENVIRONMENT_VARIABLES_AUDIT.md` - Auditoría de variables
- [x] `3D_MODEL_OPTIMIZATION_GUIDE.md` - Guía de optimización
- [x] `ENVIRONMENT_VARIABLES_SUMMARY.md` - Resumen ejecutivo

### Scripts de Verificación
- [x] `backend/scripts/checkEnvVars.js` - Detecta hardcoded values
- [x] `backend/src/config/validateEnv.js` - Valida variables requeridas
- [x] `npm run check:env` configurado

---

## 6. Dependencias y Build


### Backend
- [x] `package.json` configurado correctamente
- [x] Scripts de deployment disponibles
- [x] `npm run check:env` funcional
- [x] `npm run deploy:prepare` configurado

### Admin Panel
- [x] `package.json` configurado
- [x] Build script presente (`npm run build`)
- [x] Vite configurado correctamente

---

## 7. Git y Control de Versiones

### .gitignore
- [x] `.env` en `.gitignore`
- [x] `node_modules/` en `.gitignore`
- [x] `dist/` y `build/` en `.gitignore`
- [x] Archivos temporales ignorados

### Seguridad del Repositorio
- [ ] ⚠️ CRÍTICO: Verificar que `.env` no esté en el historial de Git
- [ ] ⚠️ Si `.env` está en Git, hacer limpieza del historial

---

## 8. Configuración de S3

### Bucket
- [x] Bucket creado: `historiar-storage`
- [x] Región configurada: `us-east-2`
- [x] CORS configurado
- [ ] ⚠️ Verificar políticas de acceso para producción

### Estructura de Carpetas
- [x] `images/monuments/`
- [x] `images/institutions/`
- [x] `models/`
- [x] `tiles/`

---

## 9. Base de Datos

### MongoDB Atlas
- [x] Cluster configurado
- [x] Connection string en variable de entorno
- [ ] ⚠️ Configurar IP whitelisting para producción
- [ ] ⚠️ Crear usuario específico para producción

### Índices
- [x] Script de creación de índices disponible
- [ ] ⚠️ Ejecutar `npm run indexes` en producción

---

## 10. Testing

### Scripts Disponibles
- [x] `npm test` configurado (Vitest)
- [x] Tests unitarios presentes
- [ ] ⚠️ Ejecutar tests antes del deployment

---

## 11. Optimizaciones

### Modelos 3D
- [x] Límite de 50MB configurado
- [x] Guía de optimización creada
- [ ] ⚠️ Revisar modelos existentes y optimizar si es necesario

### Imágenes
- [x] Límite de 5MB configurado
- [x] Validación de tipos implementada

---

## 12. Monitoreo y Logs

### Logging
- [x] Morgan configurado para logs HTTP
- [x] Console logs para debugging
- [ ] ⚠️ Configurar servicio de logging en producción (CloudWatch, etc.)

### Error Handling
- [x] Middleware de errores implementado
- [x] Validación de entrada en endpoints
- [x] Manejo de errores de S3

---

## 13. Performance

### Caching
- [ ] ⚠️ Considerar implementar caching (Redis)
- [ ] ⚠️ Configurar cache headers para assets estáticos

### Database
- [x] Índices definidos en modelos
- [ ] ⚠️ Verificar queries lentas en producción

---

## 14. Documentación

### Para Desarrolladores
- [x] README.md actualizado
- [x] Guías de deployment creadas
- [x] Variables de entorno documentadas

### Para Operaciones
- [x] Guía de AWS deployment
- [x] Checklist de seguridad
- [x] Troubleshooting guides

---

## ⚠️ ACCIONES CRÍTICAS ANTES DEL DEPLOYMENT

### 1. Seguridad (URGENTE)
```bash
# Generar nuevo JWT_SECRET
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Crear nuevas credenciales AWS IAM para producción
# - Ir a AWS IAM Console
# - Crear nuevo usuario con permisos mínimos
# - Generar access keys
```

### 2. Configurar Variables de Producción
```bash
# En AWS Secrets Manager o servicio de deployment
MONGODB_URI=mongodb+srv://prod_user:STRONG_PASSWORD@cluster.mongodb.net/historiar
JWT_SECRET=<NUEVO_SECRET_GENERADO>
AWS_ACCESS_KEY_ID=<NUEVAS_CREDENCIALES>
AWS_SECRET_ACCESS_KEY=<NUEVAS_CREDENCIALES>
ALLOWED_ORIGINS=https://admin.tudominio.com,https://api.tudominio.com
```

### 3. Verificar Git
```bash
# Verificar que .env no esté en el repositorio
git log --all --full-history -- "*/.env"

# Si aparece, limpiar historial:
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch backend/.env" \
  --prune-empty --tag-name-filter cat -- --all
```

### 4. Ejecutar Tests
```bash
cd backend
npm test
npm run check:env
npm run verify
```

### 5. Build Admin Panel
```bash
cd admin-panel
npm run build
# Verificar que dist/ se genera correctamente
```

---

## 📊 Resumen del Estado

### ✅ Listo para Deployment
- Variables de entorno configuradas
- Código sin valores hardcodeados
- Validación automática implementada
- Documentación completa
- Scripts de verificación funcionando

### ⚠️ Requiere Atención
- Generar credenciales de producción
- Actualizar JWT_SECRET
- Configurar ALLOWED_ORIGINS para producción
- Verificar historial de Git
- Ejecutar tests
- Configurar IP whitelisting en MongoDB

### 🔒 Seguridad
- **CRÍTICO**: Cambiar JWT_SECRET antes de producción
- **CRÍTICO**: Generar nuevas credenciales AWS
- **CRÍTICO**: Verificar que .env no esté en Git
- **IMPORTANTE**: Configurar CORS para producción
- **IMPORTANTE**: IP whitelisting en MongoDB

---

## 🚀 Pasos para Deployment

1. **Preparación Local**
   ```bash
   npm run check:env
   npm test
   npm run deploy:prepare
   ```

2. **Configurar AWS Secrets Manager**
   - Seguir guía en `backend/docs/AWS_DEPLOYMENT_GUIDE.md`

3. **Deploy Backend**
   - Configurar servicio (ECS/Lambda/Elastic Beanstalk)
   - Configurar variables de entorno
   - Deploy

4. **Deploy Admin Panel**
   - Build: `npm run build`
   - Deploy a Vercel/Netlify
   - Configurar variables de entorno

5. **Verificación Post-Deployment**
   - Verificar logs
   - Probar endpoints
   - Verificar CORS
   - Probar uploads a S3

---

## 📞 Contacto y Soporte

Para problemas durante el deployment, consultar:
- `backend/docs/AWS_DEPLOYMENT_GUIDE.md`
- `backend/docs/ENVIRONMENT_VARIABLES_AUDIT.md`
- `ENVIRONMENT_VARIABLES_SUMMARY.md`
