import { S3Client, GetBucketCorsCommand } from '@aws-sdk/client-s3';
import { config } from 'dotenv';

config();

const checkCORS = async () => {
  console.log('🔍 Verificando configuración CORS de S3...\n');

  const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  });

  const bucketName = process.env.S3_BUCKET;

  try {
    const command = new GetBucketCorsCommand({
      Bucket: bucketName,
    });

    const response = await s3Client.send(command);
    
    console.log(`✅ Bucket: ${bucketName}`);
    console.log(`✅ Región: ${process.env.AWS_REGION}\n`);
    console.log('📋 Configuración CORS actual:\n');
    console.log(JSON.stringify(response.CORSRules, null, 2));
    
    // Verificar si permite localhost
    const allowsLocalhost = response.CORSRules.some(rule => 
      rule.AllowedOrigins.includes('*') || 
      rule.AllowedOrigins.some(origin => origin.includes('localhost'))
    );
    
    if (allowsLocalhost) {
      console.log('\n✅ CORS permite solicitudes desde localhost');
    } else {
      console.log('\n⚠️  CORS NO permite solicitudes desde localhost');
      console.log('Necesitas agregar "http://localhost:5173" a AllowedOrigins');
    }
    
    // Verificar métodos GET
    const allowsGET = response.CORSRules.some(rule => 
      rule.AllowedMethods.includes('GET')
    );
    
    if (allowsGET) {
      console.log('✅ CORS permite método GET');
    } else {
      console.log('⚠️  CORS NO permite método GET');
    }
    
  } catch (error) {
    if (error.name === 'NoSuchCORSConfiguration') {
      console.error('❌ El bucket NO tiene configuración CORS');
      console.error('\nNecesitas configurar CORS en tu bucket.');
      console.error('Sigue las instrucciones en: backend/docs/CONFIGURAR_CORS_S3.md');
    } else {
      console.error('❌ Error al verificar CORS:', error.message);
    }
    process.exit(1);
  }
};

checkCORS();
