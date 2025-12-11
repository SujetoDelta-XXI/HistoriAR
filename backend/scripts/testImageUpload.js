import { uploadMonumentImageToS3, uploadFileToS3 } from '../src/services/s3Service.js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Test image upload to S3
 * This script tests if image uploads work after fixing ACL permissions
 */
async function testImageUpload() {
  try {
    console.log('\n🧪 Testing S3 Image Upload...\n');

    // Create a small test image buffer (1x1 pixel PNG)
    const testImageBuffer = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
      'base64'
    );

    const timestamp = Date.now();
    const testFilename = `test_${timestamp}.png`;

    console.log('📤 Uploading test image to monuments folder...');
    
    // Test monument image upload
    const monumentUrl = await uploadMonumentImageToS3(
      testImageBuffer,
      testFilename,
      'image/png'
    );

    console.log('✅ Monument image upload successful!');
    console.log(`   URL: ${monumentUrl}\n`);

    // Test institution image upload
    console.log('📤 Uploading test image to institutions folder...');
    
    const institutionFilename = `institution_test_${timestamp}.png`;
    const institutionUrl = await uploadFileToS3(
      testImageBuffer,
      `images/institutions/${institutionFilename}`,
      'image/png'
    );

    console.log('✅ Institution image upload successful!');
    console.log(`   URL: ${institutionUrl}\n`);

    console.log('🎉 All uploads successful! ACL issue is resolved.\n');
    console.log('You can now upload images from the admin panel.');

  } catch (error) {
    console.error('\n❌ Upload test failed:', error.message);
    console.error('\n📋 Next steps:');
    console.error('   1. Check backend/docs/FIX_S3_ACL_ERROR.md for solutions');
    console.error('   2. Update your S3 bucket Object Ownership settings');
    console.error('   3. Or add a bucket policy for public access\n');
    process.exit(1);
  }
}

testImageUpload();
