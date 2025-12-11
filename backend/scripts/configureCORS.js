import { S3Client, PutBucketCorsCommand, GetBucketCorsCommand } from '@aws-sdk/client-s3';
import { config } from 'dotenv';

config();

const configureCORS = async () => {
  console.log('🔧 Configurando CORS para S3...\n');

  const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  });

  const bucketName = process.env.S3_BUCKET;

  // Configuración CORS
  const corsConfiguration = {
    CORSRules: [
      {
        AllowedHeaders: ['*'],
        AllowedMethods: ['GET', 'PUT', 'POST', 'DELETE', 'HEAD'],
        AllowedOrigins: ['*'], // En producción, cambia esto por tus dominios específicos
        ExposeHeaders: ['ETag', 'Content-Length', 'Content-Type'],
        MaxAgeSeconds: 3000,
      },
    ],
  };

  try {
    // Aplicar configuración CORS
    const putCommand = new PutBucketCorsCommand({
      Bucket: bucketName,
      CORSConfiguration: corsConfiguration,
    });

    await s3Client.send(putCommand);
    console.log(`✅ CORS configurado exitosamente para el bucket: ${bucketName}\n`);

    // Verificar configuración
    const getCommand = new GetBucketCorsCommand({
      Bucket: bucketName,
    });

    const response = await s3Client.send(getCommand);
    console.log('📋 Configuración CORS actual:');
    console.log(JSON.stringify(response.CORSRules, null, 2));
    console.log('\n✅ Configuración completada. Ahora tu frontend debería poder acceder a las imágenes.');
    console.log('\n⚠️  NOTA: En producción, cambia AllowedOrigins de "*" a tus dominios específicos.');
    
  } catch (error) {
    console.error('❌ Error al configurar CORS:', error.message);
    
    if (error.name === 'NoSuchBucket') {
      console.error(`El bucket "${bucketName}" no existe.`);
    } else if (error.name === 'AccessDenied') {
      console.error('No tienes permisos para modificar la configuración CORS del bucket.');
      console.error('Asegúrate de que tu usuario IAM tenga el permiso "s3:PutBucketCors".');
    }
    
    process.exit(1);
  }
};

configureCORS();
