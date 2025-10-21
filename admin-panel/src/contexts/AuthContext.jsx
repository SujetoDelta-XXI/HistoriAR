import React, { useState, useEffect, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { AuthContext, rolePermissions } from './authContextConfig';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simular verificación de sesión existente
    const token = localStorage.getItem('histor_ar_token');
    if (token) {
      // En producción, verificar token con backend
      const mockUser = {
        id: '1',
        email: 'admin@historiar.pe',
        name: 'Administrador',
        role: 'super_admin'
      };
      setUser(mockUser);
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (email, password) => {
    setIsLoading(true);

    // Simulación de login - en producción usar Supabase o backend real
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (email === 'admin@historiar.pe' && password === 'admin123') {
      const newUser = {
        id: '1',
        email,
        name: 'Administrador Principal',
        role: 'super_admin'
      };
      setUser(newUser);
      localStorage.setItem('histor_ar_token', 'mock_token');
    } else {
      throw new Error('Credenciales inválidas');
    }

    setIsLoading(false);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('histor_ar_token');
  }, []);

  const hasPermission = useCallback((permission) => {
    if (!user) return false;
    const permissions = rolePermissions[user.role];
    return permissions.includes('*') || permissions.includes(permission);
  }, [user]);

  const contextValue = useMemo(() => ({
    user,
    isLoading,
    login,
    logout,
    hasPermission
  }), [user, isLoading, login, logout, hasPermission]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired
};
