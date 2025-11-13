import { createContext } from 'react';

export const AuthContext = createContext(undefined);

export const rolePermissions = {
  super_admin: ['*']
};
