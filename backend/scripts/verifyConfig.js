#!/usr/bin/env node
/**
 * Script para verificar configuración del entorno
 * 
 * Uso: node scripts/verifyConfig.js
 * 
 * Verifica que todas las variables de entorno necesarias estén configuradas
 */

import dotenv from 'dotenv';
import { Storage } from '@google-cloud/storage';
import mongoose from 'mongoose';

dotenv.config();

const requiredEnvVars = [
  'MONGODB_URI',
  'JWT_SECRET',
  'PORT',
  'GCS_BUCKET_NAME',
  'GCS_PROJECT_ID'
];

const optionalEnvVars = [
  'NODE_ENV',
  'GOOGLE_APPLICATION_CREDENTIALS'
];

async function verifyConfig() {
  console.log('\n🔍 Verifying environment configuration...\n');
  
  let hasErrors = false;
  let hasWarnings = false;

  // Verificar variables requeridas
  console.log('Required Environment Variables:');
  for (const varName of requiredEnvVars) {
    const value = process.env[varName];
    if (!value) {
      console.error(`  ✗ ${varName}: MISSING`);
      hasErrors = true;
    } else {
      // Ocultar valores sensibles
      const displayValue = ['JWT_SECRET', 'MONGODB_URI'].includes(varName) 
        ? '***' 
        : value;
      console.log(`  ✓ ${varName}: ${displayValue}`);
    }
  }

  // Verificar variables opcionales
  console.log('\nOptional Environment Variables:');
  for (const varName of optionalEnvVars) {
    const value = process.env[varName];
    if (!value) {
      console.warn(`  ⚠ ${varName}: Not set (using default)`);
      hasWarnings = true;
    } else {
      console.log(`  ✓ ${varName}: ${value}`);
    }
  }

  // Verificar conexión a MongoDB
  console.log('\n📊 Testing MongoDB Connection:');
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000
    });
    console.log('  ✓ MongoDB connection successful');
    await mongoose.connection.close();
  } catch (error) {
    console.error('  ✗ MongoDB connection failed:', error.message);
    hasErrors = true;
  }

  // Verificar acceso a GCS
  console.log('\n☁️  Testing Google Cloud Storage:');
  try {
    const storage = new Storage({
      projectId: process.env.GCS_PROJECT_ID
    });
    const bucket = storage.bucket(process.env.GCS_BUCKET_NAME);
    const [exists] = await bucket.exists();
    
    if (exists) {
      console.log(`  ✓ GCS bucket '${process.env.GCS_BUCKET_NAME}' is accessible`);
    } else {
      console.error(`  ✗ GCS bucket '${process.env.GCS_BUCKET_NAME}' does not exist`);
      hasErrors = true;
    }
  } catch (error) {
    console.error('  ✗ GCS connection failed:', error.message);
    hasErrors = true;
  }

  // Resumen
  console.log('\n' + '='.repeat(60));
  if (hasErrors) {
    console.error('✗ Configuration verification FAILED');
    console.error('Please fix the errors above before deploying');
    console.log('='.repeat(60) + '\n');
    process.exit(1);
  } else if (hasWarnings) {
    console.warn('⚠ Configuration verification completed with warnings');
    console.warn('Review the warnings above');
    console.log('='.repeat(60) + '\n');
    process.exit(0);
  } else {
    console.log('✓ Configuration verification PASSED');
    console.log('All required configurations are set correctly');
    console.log('='.repeat(60) + '\n');
    process.exit(0);
  }
}

verifyConfig();
