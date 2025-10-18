import { config } from 'dotenv';
import app from './app.js';
import { connectDB } from './config/db.js';
import seedUsers from './seeds/seedUsers.js';

config();

const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI;

(async () => {
  await connectDB(MONGO_URI);
  await seedUsers();
  app.listen(PORT, () => console.log(`🚀 HistoriAR API en http://localhost:${PORT}`));
})();
