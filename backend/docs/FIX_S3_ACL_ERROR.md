# Solución: Error de Permisos ACL en S3

## Problema

Al intentar subir imágenes o modelos 3D, aparece el siguiente error:

```
AccessDenied: User is not authorized to perform: s3:PutObjectAcl
```

## Causa

El bucket de S3 `historiar-storage` tiene configurado "Object Ownership" como **"Bucket owner enforced"**, lo cual **desactiva completamente los ACLs**. Cualquier intento de establecer ACLs (incluso implícitamente) fallará.

## Solución

Tienes 2 opciones:

### Opción 1: Cambiar Object Ownership (Recomendado)

1. Ve a la consola de AWS S3: https://s3.console.aws.amazon.com/
2. Selecciona el bucket `historiar-storage`
3. Ve a la pestaña **"Permissions"** (Permisos)
4. En la sección **"Object Ownership"**, haz clic en **"Edit"**
5. Cambia de **"Bucket owner enforced"** a **"Bucket owner preferred"**
6. Guarda los cambios

Esto permitirá que los ACLs funcionen correctamente.

### Opción 2: Usar Bucket Policy para Acceso Público

Si prefieres mantener "Bucket owner enforced" (más seguro), necesitas:

1. **Desbloquear el acceso público del bucket:**
   - En la pestaña "Permissions"
   - En "Block public access", haz clic en "Edit"
   - Desmarca "Block all public access"
   - Guarda los cambios

2. **Agregar una Bucket Policy para hacer públicos los archivos:**
   - En la pestaña "Permissions"
   - En "Bucket policy", haz clic en "Edit"
   - Agrega la siguiente política:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": [
        "arn:aws:s3:::historiar-storage/images/*",
        "arn:aws:s3:::historiar-storage/models/*"
      ]
    }
  ]
}
```

3. **Actualizar los permisos del usuario IAM:**
   - El usuario `historiar-dev-local` NO necesita el permiso `s3:PutObjectAcl`
   - Solo necesita `s3:PutObject` para subir archivos
   - Los archivos serán públicos automáticamente gracias a la bucket policy

## Verificación

Después de aplicar cualquiera de las soluciones:

1. Reinicia el servidor backend (si está corriendo)
2. Intenta subir una imagen o modelo 3D desde el panel admin
3. Deberías ver el mensaje: `[S3] Upload successful: https://...`

## Estado Actual del Código

✅ El código ya está corregido:
- Se eliminaron todos los parámetros `ACL: 'public-read'` del código
- Las funciones de subida ya no intentan establecer ACLs
- El código está listo para funcionar con cualquiera de las 2 opciones

## Archivos Modificados

- `backend/src/services/s3Service.js` - Todas las funciones de subida
- `backend/src/routes/monuments.routes.js` - Endpoint de subida de imágenes
- `backend/src/routes/institutions.routes.js` - Endpoint de subida de imágenes

## Notas Adicionales

- **Opción 1** es más simple pero menos segura (permite ACLs)
- **Opción 2** es más segura (usa bucket policies en lugar de ACLs)
- Ambas opciones funcionarán correctamente con el código actual
