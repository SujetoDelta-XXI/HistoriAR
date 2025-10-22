/**
 * Formulario de Inicio de Sesión (LoginForm)
 * 
 * Maneja las credenciales del usuario administrador y el flujo de autenticación
 * contra el contexto de auth. Muestra estados de carga y errores.
 */
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Alert, AlertDescription } from './ui/alert';
import { Loader2, MapPin, Smartphone } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, isLoading } = useAuth();

  /**
   * Envía el formulario y ejecuta el login del contexto
   * - Previene el submit por defecto
   * - Limpia errores anteriores
   * - Muestra errores provenientes del contexto
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      await login(email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al iniciar sesión');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-100 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-amber-600 rounded-full flex items-center justify-center mb-4">
            <MapPin className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">HistoriAR</h1>
          <p className="text-gray-600 mt-2">Panel de Administración</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Iniciar Sesión</CardTitle>
            <CardDescription>
              Accede al panel de administración de HistoriAR
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Campo: correo electrónico */}
              <div className="space-y-2">
                <Label htmlFor="email">Correo electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@historiar.pe"
                  required
                />
              </div>
              
              {/* Campo: contraseña */}
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>

              {/* Estado de error de autenticación */}
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Botón de envío con indicador de carga */}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Iniciando sesión...
                  </>
                ) : (
                  'Iniciar Sesión'
                )}
              </Button>
            </form>

            {/* Credenciales de prueba visibles para QA/demostración */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-medium text-blue-900 mb-2">Cuentas de prueba:</h3>
              <div className="space-y-1 text-sm text-blue-800">
                <div><strong>Super Admin:</strong> admin@historiar.pe / admin123</div>
                <div><strong>Editor:</strong> editor@historiar.pe / editor123</div>
                <div><strong>Analista:</strong> analista@historiar.pe / analista123</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
            <Smartphone className="w-4 h-4" />
            <span>Potenciando el turismo cultural en Lima</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;
