import React, { useState } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './hooks/useAuth';
import Toaster from './components/ui/sonner';
import LoginForm from './components/LoginForm';
import AppSidebar from './components/AppSidebar';
import Dashboard from './components/Dashboard';
import MonumentsManager from './components/MonumentsManager';
import UsersManager from './components/UsersManager';
import AnalyticsView from './components/AnalyticsView';
import { SidebarProvider, SidebarInset } from './components/ui/sidebar';

function AppContent() {
  const { user, isLoading } = useAuth();
  const [activeView, setActiveView] = useState('dashboard');

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginForm />;
  }

  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard />;
      case 'monuments':
        return <MonumentsManager />;
      case 'museums':
        return (
          <div className="p-6">
            <h1>Gestión de Museos</h1>
            <p>Funcionalidad en desarrollo...</p>
          </div>
        );
      case 'ar-experiences':
        return (
          <div className="p-6">
            <h1>Experiencias AR</h1>
            <p>Funcionalidad en desarrollo...</p>
          </div>
        );
      case 'categories':
        return (
          <div className="p-6">
            <h1>Categorías</h1>
            <p>Funcionalidad en desarrollo...</p>
          </div>
        );
      case 'users':
        return <UsersManager />;
      case 'reports':
        return (
          <div className="p-6">
            <h1>Reportes de Usuarios</h1>
            <p>Funcionalidad en desarrollo...</p>
          </div>
        );
      case 'reviews':
        return (
          <div className="p-6">
            <h1>Gestión de Reseñas</h1>
            <p>Funcionalidad en desarrollo...</p>
          </div>
        );
      case 'messaging':
        return (
          <div className="p-6">
            <h1>Sistema de Mensajería</h1>
            <p>Funcionalidad en desarrollo...</p>
          </div>
        );
      case 'analytics':
        return <AnalyticsView />;
      case 'export-reports':
        return (
          <div className="p-6">
            <h1>Exportar Reportes</h1>
            <p>Funcionalidad en desarrollo...</p>
          </div>
        );
      case 'audit':
        return (
          <div className="p-6">
            <h1>Auditoría del Sistema</h1>
            <p>Funcionalidad en desarrollo...</p>
          </div>
        );
      case 'settings':
        return (
          <div className="p-6">
            <h1>Configuración del Sistema</h1>
            <p>Funcionalidad en desarrollo...</p>
          </div>
        );
      default:
        return <Dashboard />;
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar activeView={activeView} onViewChange={setActiveView} />
        <SidebarInset className="flex-1 overflow-auto">
          {renderView()}
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
      <Toaster />
    </AuthProvider>
  );
}
