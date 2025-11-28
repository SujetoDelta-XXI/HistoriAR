import React, { useState, useEffect, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { AuthContext, rolePermissions } from './authContextConfig';
import { API_BASE_URL } from '../services/api';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Verificar sesión existente
    const validateSession = async () => {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      
      if (token && userData) {
        try {
          const user = JSON.parse(userData);
          
          // Solo permitir usuarios admin
          if (user.role !== 'admin') {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setIsLoading(false);
            return;
          }

          // Validar token contra el servidor
          const response = await fetch(`${API_BASE_URL}/auth/validate`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });

          if (response.ok) {
            const validatedUser = await response.json();
            // Verificar que sigue siendo admin
            if (validatedUser.role === 'admin') {
              setUser(validatedUser);
            } else {
              localStorage.removeItem('token');
              localStorage.removeItem('user');
            }
          } else {
            // Token inválido o expirado
            localStorage.removeItem('token');
            localStorage.removeItem('user');
          }
        } catch (error) {
          // Error al validar, limpiar sesión
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }
      setIsLoading(false);
    };

    validateSession();
  }, []);

  const login = useCallback(async (email, password) => {
    setIsLoading(true);

    try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error de autenticación');
      }

      const data = await response.json();
      
      // Solo permitir usuarios admin
      if (data.user.role !== 'admin') {
        throw new Error('Acceso denegado. Solo administradores pueden acceder.');
      }

      setUser(data.user);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }, []);

  const hasPermission = useCallback((permission) => {
    if (!user) return false;
    // Los usuarios admin tienen todos los permisos
    return user.role === 'admin';
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
