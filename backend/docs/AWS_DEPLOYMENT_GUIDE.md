# Guía de Despliegue en AWS

## Variables de Entorno Requeridas

Esta guía lista todas las variables de entorno que deben configurarse en AWS Secrets Manager o AWS Systems Manager Parameter Store para el despliegue en producción.

### 1. Configuración del Servidor

```bash
# Puerto del servidor (opcional, AWS puede asignarlo automáticamente)
PORT=4000

# Entorno de ejecución
NODE_ENV=production
```

### 2. Configuración de Base de Datos

```bash
# URI de conexión a MongoDB Atlas
# Formato: mongodb+srv://USUARIO:PASSWORD@CLUSTER.mongodb.net/DATABASE?retryWrites=true&w=majority
MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/historiar?retryWrites=true&w=majority
```

### 3. Configuración de JWT

```bash
# Secreto para firmar tokens JWT (usar un valor aleatorio fuerte en producción)
JWT_SECRET=tu_secreto_jwt_super_seguro_aqui_cambiar_en_produccion

# Tiempo de expiración de tokens
JWT_EXPIRES_IN=7d
```

### 4. Configuración de AWS S3

```bash
# Credenciales de AWS IAM
AWS_ACCESS_KEY_ID=tu_access_key_id_aqui
AWS_SECRET_ACCESS_KEY=tu_secret_access_key_aqui

# Región de AWS donde está el bucket S3
AWS_REGION=us-east-1

# Nombre del bucket S3
S3_BUCKET=nombre-de-tu-bucket
```

### 5. Configuración de CORS

```bash
# Lista de orígenes permitidos separados por comas
# Incluir todas las URLs de frontend (admin panel, app móvil API, etc.)
ALLOWED_ORIGINS=https://admin.tudominio.com,https://api.tudominio.com
```


### 6. Configuración de API Base URL (Opcional)

```bash
# URL base de la API (útil para logs y referencias internas)
API_BASE_URL=https://api.tudominio.com
```

## Configuración en AWS Secrets Manager

### Opción 1: Usar AWS Secrets Manager (Recomendado)

1. **Crear un secreto en AWS Secrets Manager:**
   ```bash
   aws secretsmanager create-secret \
     --name historiar/production/env \
     --description "Variables de entorno para HistoriAR" \
     --secret-string file://secrets.json
   ```

2. **Formato del archivo secrets.json:**
   ```json
   {
     "PORT": "4000",
     "NODE_ENV": "production",
     "MONGODB_URI": "mongodb+srv://...",
     "JWT_SECRET": "tu_secreto_jwt",
     "JWT_EXPIRES_IN": "7d",
     "AWS_ACCESS_KEY_ID": "AKIA...",
     "AWS_SECRET_ACCESS_KEY": "...",
     "AWS_REGION": "us-east-1",
     "S3_BUCKET": "historiar-storage",
     "ALLOWED_ORIGINS": "https://admin.tudominio.com,https://api.tudominio.com"
   }
   ```

3. **Acceder a los secretos desde la aplicación:**
   - Usar AWS SDK para Node.js
   - Cargar secretos al inicio de la aplicación
   - Ver ejemplo en `backend/src/config/secrets.js` (crear si no existe)

### Opción 2: Usar AWS Systems Manager Parameter Store

1. **Crear parámetros:**
   ```bash
   aws ssm put-parameter \
     --name "/historiar/production/MONGODB_URI" \
     --value "mongodb+srv://..." \
     --type "SecureString"
   
   aws ssm put-parameter \
     --name "/historiar/production/JWT_SECRET" \
     --value "tu_secreto_jwt" \
     --type "SecureString"
   ```


## Configuración en AWS Elastic Beanstalk

Si usas Elastic Beanstalk, puedes configurar las variables de entorno en la consola:

1. Ir a **Configuration** > **Software**
2. Agregar cada variable de entorno en la sección **Environment properties**
3. Guardar y aplicar cambios

## Configuración en AWS Lambda (Serverless)

Si usas Lambda con Serverless Framework o SAM:

1. **En serverless.yml:**
   ```yaml
   provider:
     name: aws
     runtime: nodejs18.x
     environment:
       NODE_ENV: production
       MONGODB_URI: ${ssm:/historiar/production/MONGODB_URI}
       JWT_SECRET: ${ssm:/historiar/production/JWT_SECRET~true}
       AWS_REGION: ${self:provider.region}
       S3_BUCKET: ${self:custom.s3Bucket}
       ALLOWED_ORIGINS: ${env:ALLOWED_ORIGINS}
   ```

2. **En AWS SAM template.yaml:**
   ```yaml
   Environment:
     Variables:
       NODE_ENV: production
       MONGODB_URI: !Sub '{{resolve:secretsmanager:historiar/production/env:SecretString:MONGODB_URI}}'
       JWT_SECRET: !Sub '{{resolve:secretsmanager:historiar/production/env:SecretString:JWT_SECRET}}'
   ```

## Configuración en AWS ECS/Fargate

En la definición de tarea (task definition):

```json
{
  "containerDefinitions": [
    {
      "name": "historiar-backend",
      "secrets": [
        {
          "name": "MONGODB_URI",
          "valueFrom": "arn:aws:secretsmanager:region:account:secret:historiar/production/env:MONGODB_URI::"
        },
        {
          "name": "JWT_SECRET",
          "valueFrom": "arn:aws:secretsmanager:region:account:secret:historiar/production/env:JWT_SECRET::"
        }
      ],
      "environment": [
        {
          "name": "NODE_ENV",
          "value": "production"
        },
        {
          "name": "AWS_REGION",
          "value": "us-east-1"
        }
      ]
    }
  ]
}
```


## Checklist de Seguridad

Antes de desplegar en producción, verifica:

- [ ] Todas las credenciales están en AWS Secrets Manager o Parameter Store
- [ ] No hay valores hardcodeados en el código
- [ ] `JWT_SECRET` es un valor aleatorio fuerte (mínimo 32 caracteres)
- [ ] `ALLOWED_ORIGINS` incluye solo dominios de confianza
- [ ] Las credenciales de AWS IAM tienen permisos mínimos necesarios
- [ ] El bucket S3 tiene políticas de acceso correctas
- [ ] MongoDB Atlas tiene IP whitelisting configurado (si aplica)
- [ ] Variables de entorno están configuradas en el servicio de AWS
- [ ] `.env` y `.env.local` están en `.gitignore`
- [ ] No hay logs que expongan información sensible

## Valores que NO Deben Estar Hardcodeados

❌ **Evitar:**
- URLs de API (usar variables de entorno)
- Credenciales de AWS
- Secretos JWT
- Strings de conexión a base de datos
- Orígenes CORS específicos
- Nombres de buckets S3
- Regiones de AWS

✅ **Correcto:**
- Usar `process.env.VARIABLE_NAME`
- Tener valores por defecto solo para desarrollo local
- Documentar todas las variables requeridas
- Validar que las variables existan al inicio

## Ejemplo de Validación de Variables de Entorno

Agregar al inicio de `backend/src/app.js` o `backend/src/server.js`:

```javascript
// Validate required environment variables
const requiredEnvVars = [
  'MONGODB_URI',
  'JWT_SECRET',
  'AWS_ACCESS_KEY_ID',
  'AWS_SECRET_ACCESS_KEY',
  'AWS_REGION',
  'S3_BUCKET'
];

const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingEnvVars.length > 0) {
  console.error('❌ Missing required environment variables:', missingEnvVars.join(', '));
  process.exit(1);
}
```

## Recursos Adicionales

- [AWS Secrets Manager Documentation](https://docs.aws.amazon.com/secretsmanager/)
- [AWS Systems Manager Parameter Store](https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-parameter-store.html)
- [Best Practices for Managing Secrets](https://docs.aws.amazon.com/secretsmanager/latest/userguide/best-practices.html)
