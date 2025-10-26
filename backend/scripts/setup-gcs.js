#!/usr/bin/env node

/**
 * Google Cloud Storage Setup Script
 * 
 * This script helps set up the GCS service account and verify the configuration.
 * 
 * Usage:
 * node scripts/setup-gcs.js
 */

import { config } from 'dotenv';
import { verifyGCSConnection, createFolderStructure } from '../src/config/gcs.js';
import fs from 'fs';
import path from 'path';

config();

const REQUIRED_ENV_VARS = [
  'GCS_PROJECT_ID',
  'GCS_PRIVATE_KEY',
  'GCS_CLIENT_EMAIL',
  'GCS_BUCKET_NAME'
];



async function checkEnvironmentVariables() {
  console.log('🔍 Checking environment variables...');
  
  const missing = REQUIRED_ENV_VARS.filter(varName => !process.env[varName]);
  
  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:');
    missing.forEach(varName => console.error(`   - ${varName}`));
    return false;
  }
  
  console.log('✅ All required environment variables are set');
  return true;
}

async function checkServiceAccountCredentials() {
  console.log('🔍 Checking service account credentials...');
  
  // Check if private key is still placeholder
  if (process.env.GCS_PRIVATE_KEY?.includes('PLACEHOLDER_PRIVATE_KEY')) {
    console.error('❌ GCS_PRIVATE_KEY contains placeholder value');
    console.log('⚠️  Please replace with actual private key from service account JSON');
    return false;
  }
  
  // Check if client email looks valid
  if (!process.env.GCS_CLIENT_EMAIL?.includes('@') || process.env.GCS_CLIENT_EMAIL?.includes('your-service-account')) {
    console.error('❌ GCS_CLIENT_EMAIL appears to be invalid or placeholder');
    console.log('⚠️  Please set valid service account email');
    return false;
  }
  
  console.log('✅ Service account credentials appear valid');
  return true;
}

async function testGCSConnection() {
  console.log('🔍 Testing GCS connection...');
  
  try {
    await verifyGCSConnection();
    console.log('✅ GCS connection successful');
    return true;
  } catch (error) {
    console.error('❌ GCS connection failed:', error.message);
    return false;
  }
}

async function setupFolderStructure() {
  console.log('🔍 Setting up folder structure...');
  
  try {
    await createFolderStructure();
    console.log('✅ Folder structure created successfully');
    return true;
  } catch (error) {
    console.error('❌ Failed to create folder structure:', error.message);
    return false;
  }
}

async function main() {
  console.log('🚀 HistoriAR GCS Setup Script');
  console.log('================================');
  
  const steps = [
    { name: 'Environment Variables', fn: checkEnvironmentVariables },
    { name: 'Service Account Credentials', fn: checkServiceAccountCredentials },
    { name: 'GCS Connection', fn: testGCSConnection },
    { name: 'Folder Structure', fn: setupFolderStructure }
  ];
  
  let allPassed = true;
  
  for (const step of steps) {
    try {
      const result = await step.fn();
      if (!result) {
        allPassed = false;
        break;
      }
    } catch (error) {
      console.error(`❌ ${step.name} failed:`, error.message);
      allPassed = false;
      break;
    }
    console.log('');
  }
  
  console.log('================================');
  if (allPassed) {
    console.log('🎉 GCS setup completed successfully!');
    console.log('');
    console.log('Next steps:');
    console.log('1. Start the server: npm run dev');
    console.log('2. Test health endpoint: GET /api/health/gcs');
  } else {
    console.log('❌ GCS setup incomplete. Please fix the issues above.');
    console.log('');
    console.log('Setup instructions:');
    console.log('1. Create a service account in Google Cloud Console');
    console.log('2. Grant Storage Admin permissions to the service account');
    console.log('3. Download the service account JSON key');
    console.log('4. Extract private_key and client_email from the JSON');
    console.log('5. Update .env file with the actual credentials');
    console.log('6. Run this script again');
  }
}

main().catch(console.error);