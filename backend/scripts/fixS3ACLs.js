import { S3Client, ListObjectsV2Command, PutObjectAclCommand } from '@aws-sdk/client-s3';
import { config } from 'dotenv';

config();

const fixACLs = async () => {
  console.log('🔧 Actualizando ACLs de archivos en S3...\n');

  const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  });

  const bucketName = process.env.S3_BUCKET;
  const prefixes = ['images/', 'models/'];
  let totalFiles = 0;
  let successCount = 0;
  let errorCount = 0;

  try {
    for (const prefix of prefixes) {
      console.log(`📁 Procesando carpeta: ${prefix}`);
      
      // Listar todos los archivos
      const listCommand = new ListObjectsV2Command({
        Bucket: bucketName,
        Prefix: prefix,
      });

      const response = await s3Client.send(listCommand);

      if (!response.Contents || response.Contents.length === 0) {
        console.log(`   ℹ️  No hay archivos en ${prefix}\n`);
        continue;
      }

      console.log(`   📊 Encontrados ${response.Contents.length} archivos\n`);
      totalFiles += response.Contents.length;

      // Actualizar ACL de cada archivo
      for (const object of response.Contents) {
        try {
          const aclCommand = new PutObjectAclCommand({
            Bucket: bucketName,
            Key: object.Key,
            ACL: 'public-read',
          });

          await s3Client.send(aclCommand);
          successCount++;
          console.log(`   ✅ ${object.Key}`);
        } catch (error) {
          errorCount++;
          console.error(`   ❌ Error en ${object.Key}: ${error.message}`);
        }
      }

      console.log('');
    }

    console.log('═══════════════════════════════════════════');
    console.log('📊 Resumen:');
    console.log(`   Total de archivos: ${totalFiles}`);
    console.log(`   ✅ Actualizados: ${successCount}`);
    console.log(`   ❌ Errores: ${errorCount}`);
    console.log('═══════════════════════════════════════════\n');

    if (errorCount > 0) {
      console.log('⚠️  Algunos archivos no se pudieron actualizar.');
      console.log('Verifica que tu usuario IAM tenga el permiso "s3:PutObjectAcl".\n');
    } else {
      console.log('✅ Todos los archivos ahora son públicamente accesibles.\n');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    
    if (error.name === 'NoSuchBucket') {
      console.error(`El bucket "${bucketName}" no existe.`);
    } else if (error.name === 'AccessDenied') {
      console.error('No tienes permisos para listar o modificar objetos en el bucket.');
      console.error('Asegúrate de que tu usuario IAM tenga estos permisos:');
      console.error('  - s3:ListBucket');
      console.error('  - s3:PutObjectAcl');
    }
    
    process.exit(1);
  }
};

fixACLs();
