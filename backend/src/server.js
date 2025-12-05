import { config } from 'dotenv';
import app from './app.js';
import { connectDB } from './config/db.js';
import { verifyGCSConnection, createFolderStructure } from './config/gcs.js';

config();

const PORT = process.env.PORT || 4000;

if (process.env.NODE_ENV !== "production") {
  const MONGO_URI = process.env.MONGODB_URI || process.env.MONGO_URI;

  (async () => {
    await connectDB(MONGO_URI);
    try {
      await verifyGCSConnection();
      await createFolderStructure();
    } catch (e) {
      console.warn("⚠️ GCS init fail:", e.message);
    }

    app.listen(PORT, () => {
      console.log(`Running locally on ${PORT}`);
    });
  })();
}

export default app;  // <-- needed for Vercel
