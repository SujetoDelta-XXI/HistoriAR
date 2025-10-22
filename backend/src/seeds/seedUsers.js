import bcrypt from 'bcryptjs';
import User from '../models/User.js';

export default async function seedUsers() {
  const users = [
    {
      name: 'Carlos Asparrín',
      email: 'admin@historiar.pe',
      password: 'Admin#2025',
      role: 'admin',
      district: 'Miraflores',
      status: 'Activo'
    },
    {
      name: 'Lucía Ramos',
      email: 'lucia@historiar.pe',
      password: 'User#2025',
      role: 'user',
      district: 'Barranco',
      status: 'Activo'
    },
    {
      name: 'José García',
      email: 'jose@historiar.pe',
      password: 'User#2025',
      role: 'user',
      district: 'San Miguel',
      status: 'Activo'
    }
  ];

  for (const u of users) {
    const exists = await User.findOne({ email: u.email });
    if (exists) continue;
    const hash = await bcrypt.hash(u.password, 10);
    await User.create({ ...u, password: hash });
    console.log(`✅ Usuario creado: ${u.email}`);
  }
}
