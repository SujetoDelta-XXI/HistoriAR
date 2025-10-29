import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { config } from 'dotenv';

config();

async function seedUsers() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@historiar.pe' });
    
    if (!existingAdmin) {
      // Create admin user
      const hashedPassword = await bcrypt.hash('admin123', 10);
      
      const adminUser = new User({
        name: 'Administrador HistoriAR',
        email: 'admin@historiar.pe',
        password: hashedPassword,
        role: 'admin',
        status: 'Activo'
      });

      await adminUser.save();
      console.log('Admin user created');
    } else {
      console.log('Admin user already exists');
    }

    // Create sample regular users
    const sampleUsers = [
      {
        name: 'María González',
        email: 'maria.gonzalez@email.com',
        role: 'user',
        status: 'Activo',
        district: 'Miraflores'
      },
      {
        name: 'Carlos Mendoza',
        email: 'carlos.mendoza@email.com',
        role: 'user',
        status: 'Activo',
        district: 'San Isidro'
      },
      {
        name: 'Ana Torres',
        email: 'ana.torres@email.com',
        role: 'user',
        status: 'Suspendido',
        district: 'Barranco'
      },
      {
        name: 'Luis Ramírez',
        email: 'luis.ramirez@email.com',
        role: 'user',
        status: 'Activo',
        district: 'Lima Centro'
      },
      {
        name: 'Carmen Silva',
        email: 'carmen.silva@email.com',
        role: 'user',
        status: 'Activo',
        district: 'Pueblo Libre'
      }
    ];

    // Remove existing regular users (keep admin)
    await User.deleteMany({ role: 'user' });
    console.log('Cleared existing regular users');

    // Create sample users
    const users = await User.insertMany(sampleUsers);
    console.log(`Created ${users.length} regular users:`);
    
    users.forEach(user => {
      console.log(`- ${user.name} (${user.email}) - ${user.status}`);
    });

    console.log('\nLogin credentials:');
    console.log('Admin: admin@historiar.pe / admin123');

  } catch (error) {
    console.error('Error seeding users:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

seedUsers();