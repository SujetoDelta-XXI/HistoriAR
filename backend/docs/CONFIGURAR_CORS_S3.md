# Guía para Configurar CORS en S3

## Problema
Estás viendo este error en tu consola del navegador:
```
Access to image at 'https://historiar-storage.s3.us-east-2.amazonaws.com/...' 
from origin 'http://localhost:5173' has been blocked by CORS policy: 
No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

Esto significa que tu bucket de S3 no está configurado para permitir solicitudes desde tu frontend.

## Solución: Configurar CORS en AWS S3

### Método 1: Usando la Consola de AWS (Más Fácil)

1. **Inicia sesión en AWS Console**
   - Ve a https://console.aws.amazon.com/
   - Inicia sesión con tu cuenta

2. **Navega a S3**
   - Busca "S3" en la barra de búsqueda superior
   - Haz clic en "S3" para abrir el servicio

3. **Selecciona tu bucket**
   - Busca y haz clic en el bucket `historiar-storage`

4. **Ve a Permisos**
   - Haz clic en la pestaña **"Permisos"** (Permissions)

5. **Edita la configuración CORS**
   - Desplázate hacia abajo hasta encontrar **"Intercambio de recursos de origen cruzado (CORS)"**
   - Haz clic en el botón **"Editar"**

6. **Pega esta configuración**
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

7. **Guarda los cambios**
   - Haz clic en **"Guardar cambios"**
   - Deberías ver un mensaje de éxito

8. **Verifica**
   - Recarga tu aplicación frontend (http://localhost:5173)
   - Las imágenes deberían cargarse sin errores de CORS

### Método 2: Usando AWS CLI

Si prefieres usar la línea de comandos:

```bash
# 1. Crea un archivo con la configuración CORS
cat > cors-config.json << 'EOF'
{
  "CORSRules": [
    {
      "AllowedHeaders": ["*"],
      "AllowedMethods": ["GET", "PUT", "POST", "DELETE", "HEAD"],
      "AllowedOrigins": ["*"],
      "ExposeHeaders": ["ETag", "Content-Length", "Content-Type"],
      "MaxAgeSeconds": 3000
    }
  ]
}
EOF

# 2. Aplica la configuración
aws s3api put-bucket-cors \
  --bucket historiar-storage \
  --cors-configuration file://cors-config.json

# 3. Verifica la configuración
aws s3api get-bucket-cors --bucket historiar-storage
```

### Método 3: Usando el Script Node.js

Si tu usuario IAM tiene los permisos necesarios:

```bash
# Desde la carpeta backend
node scripts/configureCORS.js
```

**Nota**: Si ves un error de permisos, necesitas agregar la política IAM (ver abajo).

## Configuración para Producción

⚠️ **IMPORTANTE**: La configuración actual permite solicitudes desde cualquier origen (`"AllowedOrigins": ["*"]`). 

Para producción, debes restringir los orígenes permitidos:

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE", "HEAD"],
    "AllowedOrigins": [
      "https://admin.tudominio.com",
      "https://api.tudominio.com",
      "https://tuapp.com"
    ],
    "ExposeHeaders": ["ETag", "Content-Length", "Content-Type"],
    "MaxAgeSeconds": 3000
  }
]
```

## Solución de Problemas

### Error: "No tienes permisos para modificar la configuración CORS"

Tu usuario IAM necesita permisos adicionales. Agrega esta política a tu usuario:

1. Ve a **IAM Console** → **Usuarios** → `historiar-dev-local`
2. Haz clic en **"Agregar permisos"** → **"Adjuntar políticas directamente"**
3. Haz clic en **"Crear política"**
4. Pega esta política JSON:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowCORSConfiguration",
      "Effect": "Allow",
      "Action": [
        "s3:PutBucketCORS",
        "s3:GetBucketCORS"
      ],
      "Resource": "arn:aws:s3:::historiar-storage"
    }
  ]
}
```

5. Nombra la política: `HistoriAR-CORS-Config`
6. Adjunta la política a tu usuario

### Las imágenes aún no cargan después de configurar CORS

1. **Limpia la caché del navegador**
   - Presiona `Ctrl + Shift + R` (Windows/Linux) o `Cmd + Shift + R` (Mac)

2. **Verifica que las imágenes sean públicas**
   - Ve a tu bucket en S3
   - Haz clic en una imagen
   - Verifica que tenga permisos de lectura pública

3. **Verifica la política del bucket**
   - Ve a **Permisos** → **Política del bucket**
   - Asegúrate de tener esta política:

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

4. **Verifica el acceso público**
   - Ve a **Permisos** → **Bloquear acceso público**
   - Asegúrate de que **"Bloquear todo el acceso público"** esté **DESACTIVADO**

### Error: "NoSuchBucket"

- Verifica que el nombre del bucket sea correcto: `historiar-storage`
- Verifica que estés en la región correcta: `us-east-2`

## Verificación Final

Después de configurar CORS, verifica que funcione:

1. Abre tu aplicación frontend: http://localhost:5173
2. Abre las herramientas de desarrollo (F12)
3. Ve a la pestaña **"Network"** (Red)
4. Recarga la página
5. Busca las solicitudes a S3
6. Verifica que las respuestas incluyan estos headers:
   - `Access-Control-Allow-Origin: *`
   - `Access-Control-Allow-Methods: GET, PUT, POST, DELETE, HEAD`

## Explicación de la Configuración CORS

```json
{
  "AllowedHeaders": ["*"],        // Permite todos los headers en las solicitudes
  "AllowedMethods": [             // Métodos HTTP permitidos
    "GET",                        // Leer archivos
    "PUT",                        // Subir archivos
    "POST",                       // Crear recursos
    "DELETE",                     // Eliminar archivos
    "HEAD"                        // Obtener metadata
  ],
  "AllowedOrigins": ["*"],        // Orígenes permitidos (* = todos)
  "ExposeHeaders": [              // Headers que el navegador puede leer
    "ETag",                       // Identificador de versión del archivo
    "Content-Length",             // Tamaño del archivo
    "Content-Type"                // Tipo de contenido
  ],
  "MaxAgeSeconds": 3000           // Tiempo de caché de la respuesta CORS (50 min)
}
```

## Recursos Adicionales

- [Documentación oficial de AWS sobre CORS](https://docs.aws.amazon.com/AmazonS3/latest/userguide/cors.html)
- [Guía de configuración de S3](./S3_SETUP.md)
- [Política IAM para CORS](./IAM_CORS_POLICY.json)

## Soporte

Si sigues teniendo problemas:
1. Verifica los logs del navegador (F12 → Console)
2. Verifica los logs del backend
3. Revisa la configuración en AWS Console
4. Contacta al equipo de desarrollo
