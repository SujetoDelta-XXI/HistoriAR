import { S3Client, GetBucketCorsCommand, GetObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3';
import { config } from 'dotenv';
import https from 'https';

config();

const testCORS = async () => {
  console.log('🔍 DIAGNÓSTICO COMPLETO DE CORS\n');
  console.log('═══════════════════════════════════════════\n');

  const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  });

  const bucketName = process.env.S3_BUCKET;
  const testImageKey = 'images/691a3556e84cda3b79fa9579/1765169411987_look-1.jpeg';
  const testImageUrl = `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${testImageKey}`;

  // 1. Verificar configuración CORS del bucket
  console.log('1️⃣  VERIFICANDO CONFIGURACIÓN CORS DEL BUCKET\n');
  try {
    const corsCommand = new GetBucketCorsCommand({ Bucket: bucketName });
    const corsResponse = await s3Client.send(corsCommand);
    
    console.log('✅ CORS configurado:');
    console.log(JSON.stringify(corsResponse.CORSRules, null, 2));
    console.log('');
  } catch (error) {
    console.error('❌ Error al obtener CORS:', error.message);
    console.log('');
  }

  // 2. Verificar metadata del archivo específico
  console.log('2️⃣  VERIFICANDO METADATA DEL ARCHIVO\n');
  try {
    const headCommand = new HeadObjectCommand({
      Bucket: bucketName,
      Key: testImageKey,
    });
    const headResponse = await s3Client.send(headCommand);
    
    console.log('✅ Archivo encontrado:');
    console.log(`   Content-Type: ${headResponse.ContentType}`);
    console.log(`   Content-Length: ${headResponse.ContentLength} bytes`);
    console.log(`   ETag: ${headResponse.ETag}`);
    console.log(`   Last Modified: ${headResponse.LastModified}`);
    console.log('');
  } catch (error) {
    console.error('❌ Error al obtener metadata:', error.message);
    console.log('');
  }

  // 3. Probar acceso HTTP directo
  console.log('3️⃣  PROBANDO ACCESO HTTP DIRECTO\n');
  console.log(`   URL: ${testImageUrl}\n`);
  
  await new Promise((resolve) => {
    https.get(testImageUrl, (res) => {
      console.log(`   Status: ${res.statusCode} ${res.statusMessage}`);
      console.log('   Headers de respuesta:');
      
      const importantHeaders = [
        'access-control-allow-origin',
        'access-control-allow-methods',
        'access-control-expose-headers',
        'content-type',
        'x-amz-request-id'
      ];
      
      importantHeaders.forEach(header => {
        if (res.headers[header]) {
          console.log(`     ${header}: ${res.headers[header]}`);
        }
      });
      
      console.log('');
      
      if (res.statusCode === 200) {
        if (res.headers['access-control-allow-origin']) {
          console.log('✅ El archivo es accesible Y tiene headers CORS');
        } else {
          console.log('⚠️  El archivo es accesible pero NO tiene headers CORS');
          console.log('   ESTE ES EL PROBLEMA: El bucket tiene CORS configurado,');
          console.log('   pero los archivos individuales no están devolviendo los headers.');
        }
      } else if (res.statusCode === 403) {
        console.log('❌ Acceso denegado (403)');
        console.log('   El archivo NO es público. Necesitas:');
        console.log('   1. Habilitar ACLs en el bucket');
        console.log('   2. Hacer el archivo público mediante ACL');
      } else {
        console.log(`❌ Error HTTP: ${res.statusCode}`);
      }
      
      resolve();
    }).on('error', (error) => {
      console.error('❌ Error de red:', error.message);
      resolve();
    });
  });

  console.log('');
  console.log('═══════════════════════════════════════════');
  console.log('4️⃣  RECOMENDACIONES\n');
  
  console.log('Si ves "⚠️  El archivo es accesible pero NO tiene headers CORS":');
  console.log('   → El problema es que S3 no está aplicando la configuración CORS');
  console.log('   → Solución: Espera 5-10 minutos para que AWS propague los cambios');
  console.log('   → O intenta limpiar la caché del navegador (Ctrl+Shift+R)');
  console.log('');
  
  console.log('Si ves "❌ Acceso denegado (403)":');
  console.log('   → El archivo no es público');
  console.log('   → Ve a AWS Console → S3 → tu bucket → images/');
  console.log('   → Selecciona el archivo → Acciones → Hacer público mediante ACL');
  console.log('');
  
  console.log('Si ves "✅ El archivo es accesible Y tiene headers CORS":');
  console.log('   → La configuración está correcta');
  console.log('   → El problema puede ser caché del navegador');
  console.log('   → Prueba en modo incógnito o limpia la caché');
  console.log('');
};

testCORS();
