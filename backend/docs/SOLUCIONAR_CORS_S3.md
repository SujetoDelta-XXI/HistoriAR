# Solución Completa para Errores CORS en S3

## El Problema

Estás viendo este error:
```
Access to image at 'https://historiar-storage.s3.us-east-2.amazonaws.com/...' 
from origin 'http://localhost:5173' has been blocked by CORS policy
```

## Solución en 3 Pasos

### Paso 1: Habilitar ACLs en el Bucket

1. Ve a [AWS S3 Console](https://s3.console.aws.amazon.com/)
2. Haz clic en tu bucket `historiar-storage`
3. Ve a la pestaña **"Permisos"**
4. En la sección **"Propiedad de objetos"** (Object Ownership), haz clic en **"Editar"**
5. Selecciona **"ACL habilitadas"** (ACLs enabled)
6. Marca la casilla que dice: "Reconozco que las ACL se restaurarán"
7. Haz clic en **"Guardar cambios"**

### Paso 2: Desbloquear Acceso Público

1. En la misma pestaña **"Permisos"**
2. En la sección **"Bloquear acceso público (configuración del bucket)"**
3. Haz clic en **"Editar"**
4. **DESMARCA** todas las casillas:
   - ☐ Bloquear todo el acceso público
   - ☐ Bloquear el acceso público a buckets y objetos concedido a través de nuevas listas de control de acceso (ACL)
   - ☐ Bloquear el acceso público a buckets y objetos concedido a través de cualquier lista de control de acceso (ACL)
   - ☐ Bloquear el acceso público a buckets y objetos concedido a través de nuevas políticas de bucket o de punto de acceso públicas
   - ☐ Bloquear el acceso público y entre cuentas a buckets y objetos a través de cualquier política de bucket o de punto de acceso pública
5. Escribe "confirmar" en el campo de confirmación
6. Haz clic en **"Guardar cambios"**

### Paso 3: Configurar CORS

1. En la misma pestaña **"Permisos"**
2. Desplázate hasta **"Intercambio de recursos de origen cruzado (CORS)"**
3. Haz clic en **"Editar"**
4. Pega esta configuración:

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE", "HEAD"],
    "AllowedOrigins": ["*"],
    "ExposeHeaders": ["ETag", "Content-Length", "Content-Type"],
    "MaxAgeSeconds": 3000
  }
]
```

5. Haz clic en **"Guardar cambios"**

### Paso 4: Configurar Política del Bucket

1. En la misma pestaña **"Permisos"**
2. En la sección **"Política del bucket"**, haz clic en **"Editar"**
3. Pega esta política:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::historiar-storage/*"
    }
  ]
}
```

4. Haz clic en **"Guardar cambios"**

## Verificación

### 1. Reinicia tu Backend

```bash
# Detén el servidor backend (Ctrl+C)
# Luego reinicia
cd backend
npm start
```

### 2. Sube una Nueva Imagen

- Ve a tu admin panel: http://localhost:5173
- Sube una nueva imagen a cualquier monumento
- La nueva imagen debería cargarse sin errores CORS

### 3. Para Imágenes Antiguas

Las imágenes que subiste ANTES de estos cambios NO tendrán el ACL público. Tienes dos opciones:

**Opción A: Volver a subirlas**
- Elimina las imágenes antiguas
- Súbelas de nuevo

**Opción B: Cambiar ACL manualmente**
1. Ve a tu bucket en S3
2. Navega a la carpeta `images/`
3. Selecciona las imágenes
4. Haz clic en **"Acciones"** → **"Hacer público mediante ACL"**

## Verificar que Funciona

1. Abre tu admin panel: http://localhost:5173
2. Abre las herramientas de desarrollo (F12)
3. Ve a la pestaña **"Network"** (Red)
4. Recarga la página
5. Busca las solicitudes a S3 (filtro: `s3.amazonaws.com`)
6. Haz clic en una solicitud de imagen
7. Ve a la pestaña **"Headers"**
8. Verifica que veas estos headers en la respuesta:
   ```
   access-control-allow-origin: *
   access-control-allow-methods: GET, PUT, POST, DELETE, HEAD
   ```

## Si Aún No Funciona

### Problema: Error "AccessControlListNotSupported"

Si ves este error en los logs del backend:
```
AccessControlListNotSupported: The bucket does not allow ACLs
```

**Solución**: Vuelve al Paso 1 y asegúrate de habilitar ACLs.

### Problema: Imágenes Antiguas No Cargan

Las imágenes subidas antes de estos cambios no tienen ACL público.

**Solución Rápida**: Crea un script para actualizar ACLs:

```bash
cd backend
npm run fix:acls
```

### Problema: CORS Configurado pero Sigue Fallando

1. **Limpia la caché del navegador**:
   - Chrome/Edge: `Ctrl + Shift + Delete`
   - Firefox: `Ctrl + Shift + Delete`
   - Safari: `Cmd + Option + E`

2. **Verifica la URL**:
   - Debe ser: `https://historiar-storage.s3.us-east-2.amazonaws.com/...`
   - NO debe ser: `https://s3.us-east-2.amazonaws.com/historiar-storage/...`

3. **Verifica el Content-Type**:
   - Las imágenes deben tener `Content-Type: image/jpeg` o `image/png`

## Resumen de Cambios en el Código

He actualizado `backend/src/services/s3Service.js` para agregar `ACL: 'public-read'` a todas las subidas:

```javascript
const command = new PutObjectCommand({
  Bucket: bucketName,
  Key: key,
  Body: fileBuffer,
  ContentType: contentType,
  ACL: 'public-read', // ← NUEVO
});
```

Esto asegura que todos los archivos nuevos sean públicamente accesibles.

## Configuración para Producción

⚠️ **IMPORTANTE**: Para producción, cambia la configuración CORS:

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE", "HEAD"],
    "AllowedOrigins": [
      "https://admin.tudominio.com",
      "https://api.tudominio.com"
    ],
    "ExposeHeaders": ["ETag", "Content-Length", "Content-Type"],
    "MaxAgeSeconds": 3000
  }
]
```

Reemplaza `"AllowedOrigins": ["*"]` con tus dominios específicos.

## Checklist Final

- [ ] ACLs habilitadas en el bucket
- [ ] Acceso público desbloqueado
- [ ] CORS configurado
- [ ] Política del bucket configurada
- [ ] Backend reiniciado
- [ ] Nueva imagen subida y carga correctamente
- [ ] Headers CORS verificados en Network tab

## Soporte

Si sigues teniendo problemas después de seguir todos estos pasos:

1. Verifica los logs del backend: `npm start`
2. Verifica la consola del navegador (F12)
3. Toma una captura de pantalla del error completo
4. Verifica que tu usuario IAM tenga estos permisos:
   - `s3:PutObject`
   - `s3:PutObjectAcl`
   - `s3:GetObject`
