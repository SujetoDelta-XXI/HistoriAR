import mongoose from 'mongoose';
import { config } from 'dotenv';

// Import seed functions
import seedCategories from './seedCategories.js';

// Import individual seed scripts
import './seedUsers.js';
import './seedInstitutions.js';

config();

async function seedAll() {
  try {
    console.log('🌱 Starting complete database seeding...\n');

    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB\n');

    // 1. Seed categories first (required by monuments)
    console.log('1️⃣ Seeding categories...');
    await seedCategories();
    console.log('✅ Categories seeded\n');

    // 2. Seed institutions (required by monuments)
    console.log('2️⃣ Seeding institutions...');
    await import('./seedInstitutions.js');
    console.log('✅ Institutions seeded\n');

    // 3. Seed users
    console.log('3️⃣ Seeding users...');
    await import('./seedUsers.js');
    console.log('✅ Users seeded\n');

    // 4. Seed monuments (depends on categories and institutions)
    console.log('4️⃣ Seeding monuments...');
    await import('./seedMonuments.js');
    console.log('✅ Monuments seeded\n');

    console.log('🎉 Database seeding completed successfully!');
    console.log('\n📋 Summary:');
    console.log('- Categories: 4 created');
    console.log('- Institutions: 4 created');
    console.log('- Users: 5 regular + 1 admin');
    console.log('- Monuments: 5 created with proper category references');
    console.log('\n🔑 Admin credentials:');
    console.log('Email: admin@historiar.pe');
    console.log('Password: admin123');

  } catch (error) {
    console.error('❌ Error during seeding:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

seedAll();