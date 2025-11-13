# Data Migration: Cloudinary to Google Cloud Storage

This directory contains scripts for migrating Monument data from Cloudinary URLs to Google Cloud Storage URLs.

## Migration Script

### `migrate-to-gcs.js`

Migrates existing Monument records from Cloudinary URLs to GCS placeholder URLs.

**Features:**
- Creates automatic backup before migration
- Updates `imageUrl` and `model3DUrl` fields to use GCS URLs
- Adds `gcsImageFileName` and `gcsModelFileName` fields for file management
- Provides verification of migration results
- Handles errors gracefully with detailed logging

**Requirements Addressed:**
- 2.1: Replace Cloudinary with Google Cloud Storage
- 2.4: Backup existing data before migration

### Usage

```bash
# Run the migration
npm run migrate:gcs

# Or run directly
node scripts/migrate-to-gcs.js
```

### What the script does:

1. **Backup Creation**: Creates a JSON backup of all Monument records in `backend/backups/`
2. **URL Migration**: Converts Cloudinary URLs to GCS format:
   - Images: `https://storage.googleapis.com/histori_ar/images/{filename}`
   - 3D Models: `https://storage.googleapis.com/histori_ar/models/{filename}`
3. **Filename Extraction**: Extracts original filenames from Cloudinary URLs
4. **Database Update**: Updates Monument records with new GCS URLs and filenames
5. **Verification**: Confirms migration success and provides summary

### Important Notes:

- **Backup**: The script creates a backup before making changes
- **Placeholder URLs**: The migrated URLs are placeholders - actual files need to be transferred separately
- **HistoricalData**: This model is left unchanged as specified in requirements
- **Reversible**: The backup can be used to restore original data if needed

### Environment Requirements:

- `MONGO_URI`: MongoDB connection string
- Database connection must be available

### Output Example:

```
🚀 Starting Monument data migration to GCS...

📦 Creating backup of existing Monument data...
✅ Backup created: backend/backups/monuments-backup-2024-01-15.json
📊 Backed up 25 monuments

🔄 Starting migration from Cloudinary to GCS...
📊 Found 15 monuments with Cloudinary URLs
  🖼️  Migrating image for monument "Machu Picchu"
  🎯 Migrating 3D model for monument "Machu Picchu"
✅ Migration completed: 15 monuments updated

🔍 Verifying migration results...
📊 Migration Summary:
   Total monuments: 25
   Still using Cloudinary: 0
   Using GCS: 15
✅ All monuments successfully migrated to GCS!

🎉 Migration completed successfully!
📁 Backup saved to: backend/backups/monuments-backup-2024-01-15.json
```