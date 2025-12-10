#!/usr/bin/env node

/**
 * Data Migration Script: Cloudinary to Google Cloud Storage
 * 
 * This script migrates existing Monument records from Cloudinary URLs to GCS URLs.
 * It creates a backup of existing data before performing the migration.
 * 
 * Requirements: 2.1, 2.4
 */

import mongoose from 'mongoose';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { connectDB } from '../src/config/db.js';
import Monument from '../src/models/Monument.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

const BACKUP_DIR = path.join(__dirname, '../backups');
const BACKUP_FILE = path.join(BACKUP_DIR, `monuments-backup-${new Date().toISOString().split('T')[0]}.json`);

/**
 * Create backup of existing Monument data
 */
async function createBackup() {
  console.log('📦 Creating backup of existing Monument data...');
  
  try {
    // Ensure backup directory exists
    await fs.mkdir(BACKUP_DIR, { recursive: true });
    
    // Get all monuments
    const monuments = await Monument.find({}).lean();
    
    // Write backup file
    await fs.writeFile(BACKUP_FILE, JSON.stringify(monuments, null, 2));
    
    console.log(`✅ Backup created: ${BACKUP_FILE}`);
    console.log(`📊 Backed up ${monuments.length} monuments`);
    
    return monuments.length;
  } catch (error) {
    console.error('❌ Error creating backup:', error.message);
    throw error;
  }
}

/**
 * Migrate Cloudinary URLs to GCS placeholder URLs
 */
async function migrateToGCS() {
  console.log('🔄 Starting migration from Cloudinary to GCS...');
  
  try {
    // Find monuments with Cloudinary URLs
    const monumentsWithCloudinary = await Monument.find({
      $or: [
        { imageUrl: { $regex: /cloudinary\.com/i } },
        { model3DUrl: { $regex: /cloudinary\.com/i } }
      ]
    });
    
    console.log(`📊 Found ${monumentsWithCloudinary.length} monuments with Cloudinary URLs`);
    
    let migratedCount = 0;
    
    for (const monument of monumentsWithCloudinary) {
      const updates = {};
      
      // Migrate image URL if it's from Cloudinary
      if (monument.imageUrl && monument.imageUrl.includes('cloudinary.com')) {
        // Extract filename from Cloudinary URL
        const imageFilename = extractFilenameFromCloudinaryUrl(monument.imageUrl);
        updates.imageUrl = `https://storage.googleapis.com/histori_ar/images/${imageFilename}`;
        updates.gcsImageFileName = imageFilename;
        
        console.log(`  🖼️  Migrating image for monument "${monument.name}"`);
      }
      
      // Migrate 3D model URL if it's from Cloudinary
      if (monument.model3DUrl && monument.model3DUrl.includes('cloudinary.com')) {
        // Extract filename from Cloudinary URL
        const modelFilename = extractFilenameFromCloudinaryUrl(monument.model3DUrl);
        updates.model3DUrl = `https://storage.googleapis.com/histori_ar/models/${modelFilename}`;
        updates.gcsModelFileName = modelFilename;
        
        console.log(`  🎯 Migrating 3D model for monument "${monument.name}"`);
      }
      
      // Update the monument if there are changes
      if (Object.keys(updates).length > 0) {
        await Monument.findByIdAndUpdate(monument._id, updates);
        migratedCount++;
      }
    }
    
    console.log(`✅ Migration completed: ${migratedCount} monuments updated`);
    return migratedCount;
    
  } catch (error) {
    console.error('❌ Error during migration:', error.message);
    throw error;
  }
}

/**
 * Extract filename from Cloudinary URL
 * Example: https://res.cloudinary.com/demo/image/upload/v1234567890/sample.jpg -> sample.jpg
 */
function extractFilenameFromCloudinaryUrl(url) {
  try {
    const urlParts = url.split('/');
    const filename = urlParts[urlParts.length - 1];
    
    // Remove Cloudinary transformations if present
    const cleanFilename = filename.split('?')[0];
    
    return cleanFilename || `migrated-${Date.now()}.jpg`;
  } catch (error) {
    console.warn(`⚠️  Could not extract filename from URL: ${url}`);
    return `migrated-${Date.now()}.jpg`;
  }
}

/**
 * Verify migration results
 */
async function verifyMigration() {
  console.log('🔍 Verifying migration results...');
  
  try {
    const totalMonuments = await Monument.countDocuments();
    const cloudinaryMonuments = await Monument.countDocuments({
      $or: [
        { imageUrl: { $regex: /cloudinary\.com/i } },
        { model3DUrl: { $regex: /cloudinary\.com/i } }
      ]
    });
    const gcsMonuments = await Monument.countDocuments({
      $or: [
        { imageUrl: { $regex: /storage\.googleapis\.com/i } },
        { model3DUrl: { $regex: /storage\.googleapis\.com/i } }
      ]
    });
    
    console.log(`📊 Migration Summary:`);
    console.log(`   Total monuments: ${totalMonuments}`);
    console.log(`   Still using Cloudinary: ${cloudinaryMonuments}`);
    console.log(`   Using GCS: ${gcsMonuments}`);
    
    if (cloudinaryMonuments === 0) {
      console.log('✅ All monuments successfully migrated to GCS!');
    } else {
      console.log(`⚠️  ${cloudinaryMonuments} monuments still using Cloudinary URLs`);
    }
    
  } catch (error) {
    console.error('❌ Error during verification:', error.message);
    throw error;
  }
}

/**
 * Main migration function
 */
async function main() {
  console.log('🚀 Starting Monument data migration to GCS...\n');
  
  try {
    // Connect to database
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI environment variable is required');
    }
    
    await connectDB(process.env.MONGODB_URI);
    
    // Create backup
    const backupCount = await createBackup();
    
    if (backupCount === 0) {
      console.log('ℹ️  No monuments found to migrate. Exiting...');
      process.exit(0);
    }
    
    // Confirm migration
    console.log('\n⚠️  This will update Monument records in the database.');
    console.log('   A backup has been created, but please ensure you have additional backups.');
    console.log('   Press Ctrl+C to cancel, or wait 5 seconds to continue...\n');
    
    // Wait 5 seconds for user to cancel
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Perform migration
    const migratedCount = await migrateToGCS();
    
    // Verify results
    await verifyMigration();
    
    console.log('\n🎉 Migration completed successfully!');
    console.log(`📁 Backup saved to: ${BACKUP_FILE}`);
    
  } catch (error) {
    console.error('\n❌ Migration failed:', error.message);
    console.error('💡 Check the backup file and database state before retrying.');
    process.exit(1);
  } finally {
    // Close database connection
    await mongoose.connection.close();
    console.log('🔌 Database connection closed.');
  }
}

// Handle script execution
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { createBackup, migrateToGCS, verifyMigration };