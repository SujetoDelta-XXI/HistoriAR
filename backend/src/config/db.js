import mongoose from 'mongoose';

export async function connectDB(uri) {
  try {
    mongoose.set('strictQuery', true);
    await mongoose.connect(uri, { dbName: 'historiar' });
    console.log('✅ MongoDB Atlas conectado');
  } catch (err) {
    console.error('❌ Error conectando a MongoDB:', err.message);
    // In serverless environments (like Vercel) calling process.exit will kill the runtime.
    // Re-throw the error so callers can handle it gracefully instead of exiting the process.
    throw err;
  }
}
