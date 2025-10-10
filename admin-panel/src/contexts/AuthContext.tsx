import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'super_admin' | 'editor' | 'analyst';
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const rolePermissions = {
  super_admin: ['*'],
  editor: ['content:read', 'content:write', 'content:delete', 'media:upload'],
  analyst: ['analytics:read', 'reports:export', 'dashboard:read']
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simular verificación de sesión existente
    const token = localStorage.getItem('histor_ar_token');
    if (token) {
      // En producción, verificar token con backend
      const mockUser: User = {
        id: '1',
        email: 'admin@historiar.pe',
        name: 'Administrador',
        role: 'super_admin'
      };
      setUser(mockUser);
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    // Simulación de login - en producción usar Supabase
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (email === 'admin@historiar.pe' && password === 'admin123') {
      const user: User = {
        id: '1',
        email,
        name: 'Administrador Principal',
        role: 'super_admin'
      };
      setUser(user);
      localStorage.setItem('histor_ar_token', 'mock_token');
    } else if (email === 'editor@historiar.pe' && password === 'editor123') {
      const user: User = {
        id: '2',
        email,
        name: 'Editor de Contenido',
        role: 'editor'
      };
      setUser(user);
      localStorage.setItem('histor_ar_token', 'mock_token');
    } else if (email === 'analista@historiar.pe' && password === 'analista123') {
      const user: User = {
        id: '3',
        email,
        name: 'Analista de Datos',
        role: 'analyst'
      };
      setUser(user);
      localStorage.setItem('histor_ar_token', 'mock_token');
    } else {
      throw new Error('Credenciales inválidas');
    }
    
    setIsLoading(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('histor_ar_token');
  };

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    const permissions = rolePermissions[user.role];
    return permissions.includes('*') || permissions.includes(permission);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}