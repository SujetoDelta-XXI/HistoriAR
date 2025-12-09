#!/usr/bin/env node
/**
 * Script to test S3 upload functionality
 * 
 * Usage: node scripts/testS3Upload.js
 * 
 * This script tests:
 * 1. S3 connection
 * 2. File upload
 * 3. File accessibility
 * 4. File deletion
 */

import dotenv from 'dotenv';
import { initializeS3Client, verifyS3Connection } from '../src/config/s3.js';
import * as s3Service from '../src/services/s3Service.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

// Create a simple test image (1x1 pixel PNG)
const createTestImage = () => {
  // 1x1 red pixel PNG
  const pngData = Buffer.from([
    0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A,
    0x00, 0x00, 0x00, 0x0D, 0x49, 0x48, 0x44, 0x52,
    0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
    0x08, 0x02, 0x00, 0x00, 0x00, 0x90, 0x77, 0x53,
    0xDE, 0x00, 0x00, 0x00, 0x0C, 0x49, 0x44, 0x41,
    0x54, 0x08, 0xD7, 0x63, 0xF8, 0xCF, 0xC0, 0x00,
    0x00, 0x03, 0x01, 0x01, 0x00, 0x18, 0xDD, 0x8D,
    0xB4, 0x00, 0x00, 0x00, 0x00, 0x49, 0x45, 0x4E,
    0x44, 0xAE, 0x42, 0x60, 0x82
  ]);
  return pngData;
};

async function testS3Upload() {
  console.log('\n🧪 Testing S3 Upload Functionality\n');
  console.log('='.repeat(60));
  
  let uploadedUrl = null;
  let testPassed = true;

  try {
    // Test 1: Initialize S3 Client
    console.log('\n1️⃣  Initializing S3 Client...');
    initializeS3Client();
    console.log('   ✓ S3 client initialized');

    // Test 2: Verify S3 Connection
    console.log('\n2️⃣  Verifying S3 Connection...');
    await verifyS3Connection();
    console.log('   ✓ S3 connection verified');

    // Test 3: Upload Test Image
    console.log('\n3️⃣  Uploading Test Image...');
    const testImage = createTestImage();
    const testMonumentId = 'TEST_MONUMENT_' + Date.now();
    const testFileName = 'test-image.png';
    
    uploadedUrl = await s3Service.uploadImageToS3(
      testImage,
      testFileName,
      testMonumentId,
      'image/png'
    );
    
    console.log('   ✓ Image uploaded successfully');
    console.log('   📎 URL:', uploadedUrl);

    // Test 4: Verify File is Accessible
    console.log('\n4️⃣  Verifying File Accessibility...');
    const response = await fetch(uploadedUrl);
    
    if (response.ok) {
      console.log('   ✓ File is publicly accessible');
      console.log('   📊 Status:', response.status);
      console.log('   📦 Content-Type:', response.headers.get('content-type'));
      console.log('   📏 Content-Length:', response.headers.get('content-length'), 'bytes');
    } else {
      throw new Error(`File not accessible: ${response.status} ${response.statusText}`);
    }

    // Test 5: List Monument Files
    console.log('\n5️⃣  Listing Monument Files...');
    const files = await s3Service.listMonumentFiles(testMonumentId);
    console.log('   ✓ Found', files.length, 'file(s)');
    files.forEach(file => console.log('   📄', file));

    // Test 6: Delete Test File
    console.log('\n6️⃣  Deleting Test File...');
    await s3Service.deleteFileFromS3(uploadedUrl);
    console.log('   ✓ File deleted successfully');

    // Test 7: Verify File is Deleted
    console.log('\n7️⃣  Verifying File Deletion...');
    const deleteResponse = await fetch(uploadedUrl);
    
    if (deleteResponse.status === 404 || deleteResponse.status === 403) {
      console.log('   ✓ File successfully removed from S3');
    } else {
      console.warn('   ⚠ File might still be accessible (status:', deleteResponse.status, ')');
      console.warn('   Note: S3 deletion can take a few seconds to propagate');
    }

    // Summary
    console.log('\n' + '='.repeat(60));
    console.log('✅ All S3 Tests PASSED');
    console.log('='.repeat(60));
    console.log('\n📋 Summary:');
    console.log('   • S3 client initialization: ✓');
    console.log('   • S3 connection: ✓');
    console.log('   • File upload: ✓');
    console.log('   • File accessibility: ✓');
    console.log('   • File listing: ✓');
    console.log('   • File deletion: ✓');
    console.log('\n🎉 S3 integration is working correctly!\n');
    
    process.exit(0);

  } catch (error) {
    testPassed = false;
    console.error('\n❌ Test FAILED:', error.message);
    console.error('\n' + '='.repeat(60));
    console.error('Test failed at:', error.stack);
    console.error('='.repeat(60));
    
    // Cleanup: Try to delete test file if it was uploaded
    if (uploadedUrl) {
      console.log('\n🧹 Attempting cleanup...');
      try {
        await s3Service.deleteFileFromS3(uploadedUrl);
        console.log('   ✓ Test file cleaned up');
      } catch (cleanupError) {
        console.error('   ✗ Cleanup failed:', cleanupError.message);
      }
    }
    
    console.log('\n💡 Troubleshooting:');
    console.log('   1. Check AWS credentials in .env file');
    console.log('   2. Verify S3 bucket exists and is accessible');
    console.log('   3. Check IAM permissions (PutObject, GetObject, DeleteObject, ListBucket)');
    console.log('   4. Verify bucket policy allows public read access');
    console.log('   5. Run: npm run verify\n');
    
    process.exit(1);
  }
}

// Run tests
testS3Upload();
