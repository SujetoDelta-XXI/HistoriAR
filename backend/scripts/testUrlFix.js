/**
 * Test script to check and fix S3 URL formats
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME || 'historiar-storage';
const REGION = process.env.AWS_REGION || 'us-east-2';

console.log('🔍 Checking S3 URL formats...\n');
console.log(`Bucket: ${BUCKET_NAME}`);
console.log(`Region: ${REGION}\n`);

async function checkUrls() {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI;
    console.log(`Connecting to: ${mongoUri}\n`);
    
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB\n');

    // Load Monument model
    const Monument = mongoose.model('Monument', new mongoose.Schema({
      name: String,
      imageUrl: String,
      model3DUrl: String,
      model3DTilesUrl: String
    }, { strict: false }));

    // Find monuments with URLs
    const monuments = await Monument.find({
      $or: [
        { imageUrl: { $exists: true, $ne: null } },
        { model3DUrl: { $exists: true, $ne: null } }
      ]
    }).limit(10);

    console.log(`Found ${monuments.length} monuments with URLs\n`);

    for (const monument of monuments) {
      console.log(`\n📦 Monument: ${monument.name}`);
      
      if (monument.imageUrl) {
        const isFullUrl = monument.imageUrl.startsWith('https://');
        console.log(`  imageUrl: ${monument.imageUrl.substring(0, 80)}...`);
        console.log(`  Format: ${isFullUrl ? '✅ Full URL' : '⚠️  Partial path'}`);
      }
      
      if (monument.model3DUrl) {
        const isFullUrl = monument.model3DUrl.startsWith('https://');
        console.log(`  model3DUrl: ${monument.model3DUrl.substring(0, 80)}...`);
        console.log(`  Format: ${isFullUrl ? '✅ Full URL' : '⚠️  Partial path'}`);
      }
    }

    // Count problematic URLs
    const badImageUrls = await Monument.countDocuments({
      imageUrl: { $exists: true, $regex: /^[^h]/ }
    });
    
    const badModelUrls = await Monument.countDocuments({
      model3DUrl: { $exists: true, $regex: /^[^h]/ }
    });

    console.log('\n' + '='.repeat(50));
    console.log(`⚠️  Monuments with partial imageUrl: ${badImageUrls}`);
    console.log(`⚠️  Monuments with partial model3DUrl: ${badModelUrls}`);
    console.log('='.repeat(50));

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n👋 Disconnected from MongoDB');
  }
}

checkUrls();
