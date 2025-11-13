import React, { useState } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './hooks/useAuth';
import Toaster from './components/ui/sonner';
import { ToastProvider } from './components/ui/toast';
import LoginForm from './components/LoginForm';
import AppSidebar from './components/AppSidebar';
import Dashboard from './components/Dashboard';
import MonumentsManager from './components/MonumentsManager';
import InstitutionsManager from './components/InstitutionsManager';
import CategoriesManager from './components/CategoriesManager';
import UsersManager from './components/UsersManager';
import AnalyticsView from './components/AnalyticsView';
import ToursManager from './components/ToursManager';
import ARExperiencesManager from './components/ARExperiencesManager';
import HistoricalDataManager from './components/HistoricalDataManager';
import QuizzesManager from './components/QuizzesManager';
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
      case 'institutions':
        return <InstitutionsManager />;
      case 'categories':
        return <CategoriesManager />;
      case 'quizzes':
        return <ARExperiencesManager />;
      case 'quiz-manager':
        return <QuizzesManager />;
      case 'tours':
        return <ToursManager />;
      case 'historical-data':
        return <HistoricalDataManager />;
      case 'users':
        return <UsersManager />;
      case 'messaging':
        return (
          <div className="p-6">
            <h1>Sistema de Mensajería</h1>
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
      <ToastProvider>
        <AppContent />
        <Toaster />
      </ToastProvider>
    </AuthProvider>
  );
}
