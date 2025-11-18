import app from '../src/app.js';
import { config as loadEnv } from 'dotenv';
import { connectDB } from '../src/config/db.js';
import { verifyGCSConnection, createFolderStructure } from '../src/config/gcs.js';

loadEnv();

let initialized = false;

async function initializeOnce() {
  if (initialized) return;

  const MONGO_URI = process.env.MONGO_URI;

  try {
    if (MONGO_URI) {
      await connectDB(MONGO_URI);
    } else {
      console.warn('⚠️  MONGO_URI not provided; skipping MongoDB connection');
    }
  } catch (err) {
    console.warn('⚠️  MongoDB initialization failed:', err.message);
  }

  try {
    await verifyGCSConnection();
    await createFolderStructure();
  } catch (err) {
    console.warn('⚠️  GCS initialization skipped/failed:', err.message);
  }

  initialized = true;
}

export default async function handler(req, res) {
  if (!initialized) {
    try {
      await initializeOnce();
    } catch (err) {
      console.warn('Initialization error:', err.message);
    }
  }

  // The Express `app` is a callable request handler: forward the request.
  return app(req, res);
}
