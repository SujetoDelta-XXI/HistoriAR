# Pre-Signed URLs para S3 Privado

## 📋 Descripción

Este documento explica cómo funcionan las Pre-Signed URLs en HistoriAR para acceder a archivos en un bucket S3 privado.

---

## 🎯 Problema Resuelto

**Situación:**
- El bucket S3 está bloqueado (sin acceso público)
- El backend en EC2 puede acceder a S3 mediante IAM Role o VPC Endpoint
- El frontend (admin panel) y la app móvil no pueden acceder directamente a S3

**Solución:**
- El backend genera URLs temporales firmadas (Pre-Signed URLs)
- Estas URLs permiten acceso temporal a archivos privados
- Las URLs expiran después de un tiempo configurado

---

## 🔄 Cómo Funciona

```
┌─────────────────────────────────────────────────────────┐
│                    FLUJO COMPLETO                        │
└─────────────────────────────────────────────────────────┘

1. Frontend solicita monumento:
   GET /api/monuments/123
   
2. Backend consulta MongoDB:
   {
     name: "Machu Picchu",
     imageUrl: "https://bucket.s3.region.amazonaws.com/images/monument.jpg"
   }
   
3. Backend genera Pre-Signed URL:
   - Toma la URL de S3
   - Genera firma temporal con AWS SDK
   - Agrega parámetros de autenticación
   
4. Backend responde con URL firmada:
   {
     name: "Machu Picchu",
     imageUrl: "https://bucket.s3.region.amazonaws.com/images/monument.jpg?
                X-Amz-Algorithm=AWS4-HMAC-SHA256&
                X-Amz-Credential=...&
                X-Amz-Date=20241210T120000Z&
                X-Amz-Expires=86400&
                X-Amz-Signature=abc123..."
   }
   
5. Frontend usa la URL directamente:
   <img src="URL_FIRMADA" />
   
6. S3 valida la firma y permite el acceso
   (solo durante el tiempo configurado)
```

---

## ⚙️ Configuración

### Variables de Entorno

Agrega estas variables a tu archivo `.env`:

```bash
# Pre-Signed URL Expiration Times (in seconds)
PRESIGNED_URL_EXPIRATION_IMAGES=86400      # 24 horas para imágenes
PRESIGNED_URL_EXPIRATION_MODELS=172800     # 48 horas para modelos 3D
PRESIGNED_URL_EXPIRATION_DOCUMENTS=43200   # 12 horas para documentos
PRESIGNED_URL_EXPIRATION_DEFAULT=86400     # 24 horas por defecto
```

### Tiempos de Expiración

| Tipo | Tiempo | Razón |
|------|--------|-------|
| **Imágenes** | 24 horas | Uso típico de un día completo |
| **Modelos 3D** | 48 horas | Archivos grandes, evitar recargas |
| **Documentos** | 12 horas | Menor tiempo para mayor seguridad |
| **Default** | 24 horas | Valor por defecto |

---

## 🔧 Uso en el Código

### Backend

#### 1. Generar Pre-Signed URL para una clave

```javascript
import { generatePresignedUrl } from '../services/s3Service.js';

// Generar URL firmada para una imagen
const imageKey = 'images/monuments/machu-picchu.jpg';
const presignedUrl = await generatePresignedUrl(imageKey);
// URL válida por 24 horas (configurado en .env)

// Generar URL con tiempo personalizado
const presignedUrl = await generatePresignedUrl(imageKey, 3600); // 1 hora
```

#### 2. Convertir URL de S3 a Pre-Signed URL

```javascript
import { convertToPresignedUrl } from '../services/s3Service.js';

const s3Url = 'https://bucket.s3.region.amazonaws.com/images/monument.jpg';
const presignedUrl = await convertToPresignedUrl(s3Url);
```

#### 3. Convertir Objeto Completo (Recomendado)

```javascript
import { convertObjectToPresignedUrls } from '../services/s3Service.js';

// Convertir un monumento
const monument = await Monument.findById(id);
const monumentWithPresignedUrls = await convertObjectToPresignedUrls(monument);

// Convertir array de monumentos
const monuments = await Monument.find();
const monumentsWithPresignedUrls = await convertObjectToPresignedUrls(monuments);
```

#### 4. En Controladores (Automático)

```javascript
export async function getMonument(req, res) {
  const monument = await getMonumentById(req.params.id);
  
  // Convertir URLs automáticamente
  const monumentWithPresignedUrls = await convertObjectToPresignedUrls(monument);
  
  res.json(monumentWithPresignedUrls);
}
```

### Frontend (React)

**No requiere cambios!** El frontend usa las URLs como siempre:

```jsx
// Antes (con S3 público)
<img src={monument.imageUrl} alt={monument.name} />

// Después (con Pre-Signed URLs)
<img src={monument.imageUrl} alt={monument.name} />
// La URL ahora es firmada, pero el código es el mismo
```

### App Móvil (Flutter)

**No requiere cambios!** La app usa las URLs como siempre:

```dart
// Antes (con S3 público)
Image.network(monument.imageUrl)

// Después (con Pre-Signed URLs)
Image.network(monument.imageUrl)
// La URL ahora es firmada, pero el código es el mismo
```

---

## 🧪 Testing

### Probar Pre-Signed URLs

```bash
npm run test:presigned
```

Este script prueba:
- ✅ Generación de URLs para imágenes
- ✅ Generación de URLs para modelos 3D
- ✅ Conversión de URLs de S3
- ✅ Conversión de objetos completos
- ✅ Conversión de arrays
- ✅ Manejo de URLs ya firmadas
- ✅ Manejo de URLs inválidas
- ✅ Manejo de null/undefined

### Probar Manualmente

```bash
# 1. Iniciar el servidor
npm run dev

# 2. Obtener un monumento
curl http://localhost:4000/api/monuments/MONUMENT_ID

# 3. Verificar que las URLs contengan X-Amz-Signature
# Ejemplo de respuesta:
{
  "name": "Machu Picchu",
  "imageUrl": "https://bucket.s3.region.amazonaws.com/images/monument.jpg?X-Amz-Signature=..."
}
```

---

## 🔐 Configuración de AWS

### 1. Bloquear Acceso Público al Bucket

En AWS Console > S3 > Tu Bucket > Permissions:

```
Block all public access: ON
✅ Block public access to buckets and objects granted through new access control lists (ACLs)
✅ Block public access to buckets and objects granted through any access control lists (ACLs)
✅ Block public access to buckets and objects granted through new public bucket or access point policies
✅ Block public and cross-account access to buckets and objects through any public bucket or access point policies
```

### 2. Configurar IAM Role para EC2

Tu instancia EC2 debe tener un IAM Role con estos permisos:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:PutObject",
        "s3:DeleteObject",
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::historiar-storage",
        "arn:aws:s3:::historiar-storage/*"
      ]
    }
  ]
}
```

### 3. Bucket Policy (Opcional)

Si usas credenciales IAM en lugar de IAM Role:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowBackendAccess",
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam::ACCOUNT-ID:user/backend-user"
      },
      "Action": [
        "s3:GetObject",
        "s3:PutObject",
        "s3:DeleteObject"
      ],
      "Resource": "arn:aws:s3:::historiar-storage/*"
    }
  ]
}
```

---

## 📊 Endpoints Afectados

Los siguientes endpoints ahora devuelven Pre-Signed URLs automáticamente:

### Monumentos
- `GET /api/monuments` - Lista de monumentos
- `GET /api/monuments/:id` - Detalle de monumento
- `GET /api/monuments/search` - Búsqueda de monumentos

### Instituciones
- `GET /api/institutions` - Lista de instituciones
- `GET /api/institutions/:id` - Detalle de institución

### Tours
- `GET /api/tours` - Lista de tours (incluye monumentos)
- `GET /api/tours/:id` - Detalle de tour

### Datos Históricos
- `GET /api/historical-data` - Lista de datos históricos
- `GET /api/historical-data/:id` - Detalle de dato histórico

---

## 🔄 Ciclo de Vida de las URLs

### Generación

Las URLs se generan **cada vez que el frontend/móvil solicita datos**:

```
10:00 AM - Usuario solicita monumento
          ↓
          Backend genera URL (expira 11:00 AM del día siguiente)
          ↓
10:30 AM - Usuario sigue viendo el monumento
          ↓
          URL sigue válida
          ↓
11:00 AM - Usuario navega a otro monumento
          ↓
          Backend genera NUEVA URL para el nuevo monumento
```

### Expiración

```
Día 1, 10:00 AM - URL generada (expira Día 2, 10:00 AM)
Día 1, 15:00 PM - URL sigue válida
Día 2, 09:00 AM - URL sigue válida
Día 2, 10:01 AM - URL expira (error 403)
Día 2, 10:02 AM - Usuario refresca → Nueva URL generada
```

### Regeneración

Las URLs se regeneran automáticamente cuando:
- ✅ El usuario navega a otra pantalla y vuelve
- ✅ El usuario refresca la página/app
- ✅ El usuario cierra y abre la app
- ✅ El frontend hace una nueva petición al backend

---

## ⚠️ Consideraciones

### Ventajas

- ✅ **Seguridad**: S3 permanece completamente privado
- ✅ **Control**: El backend controla quién accede y por cuánto tiempo
- ✅ **Transparente**: Frontend y móvil no necesitan cambios
- ✅ **Flexible**: Tiempos de expiración configurables
- ✅ **Compatible**: Funciona con cualquier cliente HTTP

### Limitaciones

- ⚠️ **URLs temporales**: Expiran después del tiempo configurado
- ⚠️ **No cacheable**: Las URLs cambian en cada petición
- ⚠️ **Overhead mínimo**: Generar URLs toma <1ms por URL

### Mejores Prácticas

1. **Usa tiempos largos**: 24-48 horas cubre el 99% de los casos
2. **No guardes las URLs**: Siempre solicita datos frescos al backend
3. **Maneja errores 403**: Si una URL expira, refresca los datos
4. **Monitorea logs**: Revisa cuándo se generan URLs para detectar patrones

---

## 🐛 Troubleshooting

### Error: "Access Denied" al generar URL

**Causa**: El IAM Role/User no tiene permisos de `s3:GetObject`

**Solución**:
1. Verifica el IAM Role de tu EC2
2. Agrega el permiso `s3:GetObject`
3. Reinicia la aplicación

### Error: "Invalid S3 URL"

**Causa**: La URL en la base de datos no es una URL válida de S3

**Solución**:
1. Verifica que las URLs en MongoDB tengan el formato correcto
2. Ejecuta una migración para corregir URLs si es necesario

### Las imágenes no cargan (403)

**Causa**: Las URLs expiraron

**Solución**:
1. Aumenta el tiempo de expiración en `.env`
2. Implementa auto-refresh en el frontend (opcional)
3. Refresca los datos manualmente

### URLs muy largas

**Causa**: Las Pre-Signed URLs incluyen parámetros de autenticación

**Solución**:
- Esto es normal y esperado
- Las URLs pueden tener 200-300 caracteres
- No afecta el rendimiento

---

## 📚 Referencias

- [AWS S3 Pre-Signed URLs Documentation](https://docs.aws.amazon.com/AmazonS3/latest/userguide/ShareObjectPreSignedURL.html)
- [AWS SDK for JavaScript v3](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/)
- [S3 Security Best Practices](https://docs.aws.amazon.com/AmazonS3/latest/userguide/security-best-practices.html)

---

**Última actualización**: Diciembre 10, 2024  
**Versión**: 1.0  
**Autor**: Carlos Asparrín
