import jwt from 'jsonwebtoken';

/**
 * ✅ Verifica el token JWT y adjunta los datos del usuario al request
 */
export function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: 'Token faltante' });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    // Normalizamos para que todos los controladores usen req.user.id
    req.user = {
      id: payload.sub,    // 👈 convierte "sub" a "id"
      role: payload.role,
      email: payload.email
    };
    next();
  } catch {
    return res.status(401).json({ message: 'Token inválido o expirado' });
  }
}

/**
 * ✅ Verifica que el usuario tenga uno de los roles permitidos
 * @param  {...string} roles - roles válidos (ej. 'admin', 'editor')
 */
export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Acceso denegado' });
    }
    next();
  };
}
