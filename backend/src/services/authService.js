import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export async function registerUser(data) {
  const { name, email, password, role, district, status } = data;
  const exists = await User.findOne({ email });
  if (exists) throw new Error('El correo ya está registrado');
  const hash = password ? await bcrypt.hash(password, 10) : undefined;
  return await User.create({ name, email, password: hash, role, district, status });
}

export async function loginUser(email, password) {
  const user = await User.findOne({ email });
  if (!user || !user.password) throw new Error('Credenciales inválidas');
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) throw new Error('Credenciales inválidas');

  const token = jwt.sign(
    { sub: user._id, role: user.role, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
  return { token, user };
}
