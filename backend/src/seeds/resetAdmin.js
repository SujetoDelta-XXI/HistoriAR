import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { config } from 'dotenv';

config();

async function resetAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Delete existing admin user
    await User.deleteOne({ email: 'admin@historiar.pe' });
    console.log('Deleted existing admin user');

    // Create new admin user with correct password
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    const adminUser = new User({
      name: 'Administrador HistoriAR',
      email: 'admin@historiar.pe',
      password: hashedPassword,
      role: 'admin',
      status: 'Activo'
    });

    await adminUser.save();
    console.log('✅ New admin user created successfully');
    console.log('📧 Email: admin@historiar.pe');
    console.log('🔑 Password: admin123');
    console.log('👤 Role: admin');

    // Test the password hash
    const testPassword = await bcrypt.compare('admin123', hashedPassword);
    console.log('🧪 Password hash test:', testPassword ? '✅ PASS' : '❌ FAIL');

  } catch (error) {
    console.error('❌ Error resetting admin:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

resetAdmin();