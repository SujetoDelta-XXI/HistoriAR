/**
 * Migration: Fix S3 URL formats in database
 * 
 * Problem: Some documents have partial paths or filenames instead of full S3 URLs
 * Examples:
 *   - "models/monuments/ID/file.glb" should be "https://bucket.s3.region.amazonaws.com/models/monuments/ID/file.glb"
 *   - "file.glb" should be converted to full URL (if we can determine the path)
 * 
 * This migration fixes these URLs to the correct format.
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '../../.env') });

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME || 'historiar-storage';
const REGION = process.env.AWS_REGION || 'us-east-2';

/**
 * Convert a partial path, GCS URL, or filename to a full S3 URL
 */
function toFullS3Url(value) {
  if (!value || typeof value !== 'string') {
    return value;
  }

  // Already a full S3 URL
  if (value.startsWith(`https://${BUCKET_NAME}.s3.${REGION}.amazonaws.com/`)) {
    return value;
  }

  // Convert Google Cloud Storage URL to S3 URL
  // Format: https://storage.googleapis.com/bucket_name/path/to/file
  const gcsPattern = /https:\/\/storage\.googleapis\.com\/[^\/]+\/(.+)/;
  const gcsMatch = value.match(gcsPattern);
  
  if (gcsMatch) {
    const path = decodeURIComponent(gcsMatch[1]);
    console.log(`  🔄 Converting GCS URL to S3: ${path}`);
    return `https://${BUCKET_NAME}.s3.${REGION}.amazonaws.com/${path}`;
  }

  // It's a key path (images/, models/, etc.)
  if (value.startsWith('images/') || value.startsWith('models/') || value.startsWith('documents/')) {
    return `https://${BUCKET_NAME}.s3.${REGION}.amazonaws.com/${value}`;
  }

  // Can't determine the full path - return as is
  console.warn(`⚠️  Cannot convert to full URL: ${value}`);
  return value;
}

async function fixMonuments() {
  const Monument = mongoose.model('Monument');
  
  console.log('\n📦 Fixing Monument URLs...');
  
  const monuments = await Monument.find({
    $or: [
      { imageUrl: { $exists: true, $ne: null } },
      { model3DUrl: { $exists: true, $ne: null } },
      { model3DTilesUrl: { $exists: true, $ne: null } }
    ]
  });

  let fixed = 0;
  
  for (const monument of monuments) {
    let updated = false;
    const updates = {};

    // Fix imageUrl
    if (monument.imageUrl && !monument.imageUrl.startsWith('https://')) {
      const newUrl = toFullS3Url(monument.imageUrl);
      if (newUrl !== monument.imageUrl) {
        updates.imageUrl = newUrl;
        updated = true;
        console.log(`  ✓ Monument ${monument.name}: imageUrl fixed`);
      }
    }

    // Fix model3DUrl
    if (monument.model3DUrl && !monument.model3DUrl.startsWith('https://')) {
      const newUrl = toFullS3Url(monument.model3DUrl);
      if (newUrl !== monument.model3DUrl) {
        updates.model3DUrl = newUrl;
        updated = true;
        console.log(`  ✓ Monument ${monument.name}: model3DUrl fixed`);
      }
    }

    // Fix model3DTilesUrl
    if (monument.model3DTilesUrl && !monument.model3DTilesUrl.startsWith('https://')) {
      const newUrl = toFullS3Url(monument.model3DTilesUrl);
      if (newUrl !== monument.model3DTilesUrl) {
        updates.model3DTilesUrl = newUrl;
        updated = true;
        console.log(`  ✓ Monument ${monument.name}: model3DTilesUrl fixed`);
      }
    }

    if (updated) {
      await Monument.updateOne({ _id: monument._id }, { $set: updates });
      fixed++;
    }
  }

  console.log(`✅ Fixed ${fixed} monuments`);
  return fixed;
}

async function fixInstitutions() {
  const Institution = mongoose.model('Institution');
  
  console.log('\n🏛️  Fixing Institution URLs...');
  
  const institutions = await Institution.find({
    imageUrl: { $exists: true, $ne: null }
  });

  let fixed = 0;
  
  for (const institution of institutions) {
    if (institution.imageUrl && !institution.imageUrl.startsWith('https://')) {
      const newUrl = toFullS3Url(institution.imageUrl);
      if (newUrl !== institution.imageUrl) {
        await Institution.updateOne(
          { _id: institution._id },
          { $set: { imageUrl: newUrl } }
        );
        fixed++;
        console.log(`  ✓ Institution ${institution.name}: imageUrl fixed`);
      }
    }
  }

  console.log(`✅ Fixed ${fixed} institutions`);
  return fixed;
}

async function fixHistoricalData() {
  const HistoricalData = mongoose.model('HistoricalData');
  
  console.log('\n📜 Fixing Historical Data URLs...');
  
  const historicalData = await HistoricalData.find({
    $or: [
      { imageUrl: { $exists: true, $ne: null } },
      { 'multimedia.url': { $exists: true } }
    ]
  });

  let fixed = 0;
  
  for (const data of historicalData) {
    let updated = false;
    const updates = {};

    // Fix imageUrl
    if (data.imageUrl && !data.imageUrl.startsWith('https://')) {
      const newUrl = toFullS3Url(data.imageUrl);
      if (newUrl !== data.imageUrl) {
        updates.imageUrl = newUrl;
        updated = true;
        console.log(`  ✓ Historical Data ${data.title}: imageUrl fixed`);
      }
    }

    // Fix multimedia URLs
    if (data.multimedia && Array.isArray(data.multimedia)) {
      const fixedMultimedia = data.multimedia.map(item => {
        if (item.url && !item.url.startsWith('https://')) {
          const newUrl = toFullS3Url(item.url);
          if (newUrl !== item.url) {
            updated = true;
            console.log(`  ✓ Historical Data ${data.title}: multimedia URL fixed`);
            return { ...item, url: newUrl };
          }
        }
        return item;
      });
      
      if (updated) {
        updates.multimedia = fixedMultimedia;
      }
    }

    if (updated) {
      await HistoricalData.updateOne({ _id: data._id }, { $set: updates });
      fixed++;
    }
  }

  console.log(`✅ Fixed ${fixed} historical data entries`);
  return fixed;
}

async function fixModelVersions() {
  const ModelVersion = mongoose.model('ModelVersion');
  
  console.log('\n🎨 Fixing Model Version URLs...');
  
  const versions = await ModelVersion.find({
    $or: [
      { url: { $exists: true, $ne: null } },
      { tilesUrl: { $exists: true, $ne: null } }
    ]
  });

  let fixed = 0;
  
  for (const version of versions) {
    let updated = false;
    const updates = {};

    // Fix url
    if (version.url && !version.url.startsWith('https://')) {
      const newUrl = toFullS3Url(version.url);
      if (newUrl !== version.url) {
        updates.url = newUrl;
        updated = true;
        console.log(`  ✓ Model Version ${version.filename}: url fixed`);
      }
    }

    // Fix tilesUrl
    if (version.tilesUrl && !version.tilesUrl.startsWith('https://')) {
      const newUrl = toFullS3Url(version.tilesUrl);
      if (newUrl !== version.tilesUrl) {
        updates.tilesUrl = newUrl;
        updated = true;
        console.log(`  ✓ Model Version ${version.filename}: tilesUrl fixed`);
      }
    }

    if (updated) {
      await ModelVersion.updateOne({ _id: version._id }, { $set: updates });
      fixed++;
    }
  }

  console.log(`✅ Fixed ${fixed} model versions`);
  return fixed;
}

async function runMigration() {
  try {
    console.log('🚀 Starting S3 URL format migration...\n');
    console.log(`📍 Bucket: ${BUCKET_NAME}`);
    console.log(`📍 Region: ${REGION}\n`);

    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/historiar';
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB\n');

    // Load models
    await import('../models/Monument.js');
    await import('../models/Institution.js');
    await import('../models/HistoricalData.js');
    await import('../models/ModelVersion.js');

    // Run migrations
    const monumentsFixed = await fixMonuments();
    const institutionsFixed = await fixInstitutions();
    const historicalDataFixed = await fixHistoricalData();
    const modelVersionsFixed = await fixModelVersions();

    const total = monumentsFixed + institutionsFixed + historicalDataFixed + modelVersionsFixed;

    console.log('\n' + '='.repeat(50));
    console.log('✅ Migration completed successfully!');
    console.log(`📊 Total documents fixed: ${total}`);
    console.log('='.repeat(50) + '\n');

  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('👋 Disconnected from MongoDB');
  }
}

// Run migration if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runMigration();
}

export default runMigration;
