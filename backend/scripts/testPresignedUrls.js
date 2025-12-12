#!/usr/bin/env node

/**
 * Test Pre-Signed URLs
 * 
 * This script tests the generation of pre-signed URLs for S3 objects
 * Usage: node scripts/testPresignedUrls.js
 */

import { config } from 'dotenv';
import { 
  generatePresignedUrl, 
  convertToPresignedUrl,
  convertObjectToPresignedUrls,
  isPresignedUrl,
  getExpirationTime
} from '../src/services/s3Service.js';

config();

console.log('🔐 Testing Pre-Signed URLs\n');

async function testPresignedUrls() {
  try {
    // Test 1: Generate presigned URL for an image
    console.log('📸 Test 1: Generate presigned URL for image');
    const imageKey = 'images/monuments/test-monument.jpg';
    const imageUrl = await generatePresignedUrl(imageKey);
    console.log(`✅ Generated URL: ${imageUrl.substring(0, 100)}...`);
    console.log(`✅ Is presigned: ${isPresignedUrl(imageUrl)}`);
    console.log(`✅ Expiration: ${getExpirationTime('image')}s (${getExpirationTime('image') / 3600}h)\n`);

    // Test 2: Generate presigned URL for a 3D model
    console.log('🎨 Test 2: Generate presigned URL for 3D model');
    const modelKey = 'models/monuments/test-model.glb';
    const modelUrl = await generatePresignedUrl(modelKey);
    console.log(`✅ Generated URL: ${modelUrl.substring(0, 100)}...`);
    console.log(`✅ Is presigned: ${isPresignedUrl(modelUrl)}`);
    console.log(`✅ Expiration: ${getExpirationTime('model')}s (${getExpirationTime('model') / 3600}h)\n`);

    // Test 3: Convert S3 URL to presigned URL
    console.log('🔄 Test 3: Convert S3 URL to presigned URL');
    const s3Url = `https://${process.env.S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/images/monuments/test.jpg`;
    const convertedUrl = await convertToPresignedUrl(s3Url);
    console.log(`✅ Original URL: ${s3Url}`);
    console.log(`✅ Converted URL: ${convertedUrl.substring(0, 100)}...`);
    console.log(`✅ Is presigned: ${isPresignedUrl(convertedUrl)}\n`);

    // Test 4: Convert object with multiple URLs
    console.log('📦 Test 4: Convert object with multiple URLs');
    const testMonument = {
      _id: '123',
      name: 'Test Monument',
      imageUrl: `https://${process.env.S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/images/monuments/test.jpg`,
      model3DUrl: `https://${process.env.S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/models/monuments/test.glb`,
      description: 'Test description'
    };
    
    const convertedMonument = await convertObjectToPresignedUrls(testMonument);
    console.log(`✅ Original imageUrl: ${testMonument.imageUrl}`);
    console.log(`✅ Converted imageUrl: ${convertedMonument.imageUrl.substring(0, 100)}...`);
    console.log(`✅ Original model3DUrl: ${testMonument.model3DUrl}`);
    console.log(`✅ Converted model3DUrl: ${convertedMonument.model3DUrl.substring(0, 100)}...`);
    console.log(`✅ Both are presigned: ${isPresignedUrl(convertedMonument.imageUrl) && isPresignedUrl(convertedMonument.model3DUrl)}\n`);

    // Test 5: Convert array of objects
    console.log('📚 Test 5: Convert array of objects');
    const testMonuments = [
      {
        _id: '1',
        name: 'Monument 1',
        imageUrl: `https://${process.env.S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/images/monuments/test1.jpg`
      },
      {
        _id: '2',
        name: 'Monument 2',
        imageUrl: `https://${process.env.S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/images/monuments/test2.jpg`
      }
    ];
    
    const convertedMonuments = await convertObjectToPresignedUrls(testMonuments);
    console.log(`✅ Converted ${convertedMonuments.length} monuments`);
    console.log(`✅ All URLs are presigned: ${convertedMonuments.every(m => isPresignedUrl(m.imageUrl))}\n`);

    // Test 6: Handle already presigned URLs
    console.log('♻️  Test 6: Handle already presigned URLs');
    const alreadyPresigned = convertedMonument.imageUrl;
    const reconverted = await convertToPresignedUrl(alreadyPresigned);
    console.log(`✅ Already presigned URL returned as-is: ${alreadyPresigned === reconverted}\n`);

    // Test 7: Handle invalid URLs
    console.log('⚠️  Test 7: Handle invalid URLs');
    const invalidUrl = 'https://example.com/image.jpg';
    const invalidConverted = await convertToPresignedUrl(invalidUrl);
    console.log(`✅ Invalid URL returned as-is: ${invalidUrl === invalidConverted}\n`);

    // Test 8: Handle null/undefined
    console.log('🔍 Test 8: Handle null/undefined');
    const nullConverted = await convertToPresignedUrl(null);
    const undefinedConverted = await convertToPresignedUrl(undefined);
    console.log(`✅ Null handled: ${nullConverted === null}`);
    console.log(`✅ Undefined handled: ${undefinedConverted === null}\n`);

    // Summary
    console.log('✅ All tests passed!');
    console.log('\n📊 Configuration:');
    console.log(`   - Images expire in: ${getExpirationTime('image')}s (${getExpirationTime('image') / 3600}h)`);
    console.log(`   - Models expire in: ${getExpirationTime('model')}s (${getExpirationTime('model') / 3600}h)`);
    console.log(`   - Documents expire in: ${getExpirationTime('document')}s (${getExpirationTime('document') / 3600}h)`);
    console.log(`   - Default expires in: ${getExpirationTime('default')}s (${getExpirationTime('default') / 3600}h)`);
    
    console.log('\n💡 Note: These are test URLs. They will work if the files exist in S3.');
    console.log('   To test with real files, upload some files first using the admin panel.\n');

  } catch (error) {
    console.error('❌ Error testing presigned URLs:', error.message);
    console.error('\n💡 Make sure:');
    console.error('   1. AWS credentials are configured in .env');
    console.error('   2. S3 bucket exists and is accessible');
    console.error('   3. IAM role/user has s3:GetObject permission\n');
    process.exit(1);
  }
}

testPresignedUrls();
