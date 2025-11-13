import { config } from 'dotenv';
import app from './app.js';
import { connectDB } from './config/db.js';
import { verifyGCSConnection, createFolderStructure } from './config/gcs.js';

config();

const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI;

(async () => {
  try {
    // Connect to MongoDB
    await connectDB(MONGO_URI);
    
    // Verify GCS connection and setup
    console.log('🔧 Initializing Google Cloud Storage...');
    try {
      await verifyGCSConnection();
      await createFolderStructure();
    } catch (error) {
      console.warn('⚠️  GCS initialization failed (using placeholder credentials):', error.message);
      console.log('📝 To fix: Replace placeholder values in .env file with real GCS credentials');
      console.log('🚀 Server will continue without GCS functionality');
    }
    
    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 HistoriAR API running on http://localhost:${PORT}`);
      console.log(`📁 GCS Bucket: ${process.env.GCS_BUCKET_NAME}`);
      console.log(`🔑 Service Account: ${process.env.GCS_CLIENT_EMAIL}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
})();
