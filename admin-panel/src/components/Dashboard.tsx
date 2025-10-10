import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { 
  Users, 
  MapPin, 
  Camera, 
  TrendingUp, 
  Download,
  Smartphone,
  Clock,
  AlertTriangle,
  Eye
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

// Datos simulados para los gráficos
const monthlyVisits = [
  { name: 'Ene', visitas: 1200, sesionesAR: 800 },
  { name: 'Feb', visitas: 1900, sesionesAR: 1200 },
  { name: 'Mar', visitas: 2400, sesionesAR: 1600 },
  { name: 'Abr', visitas: 2200, sesionesAR: 1400 },
  { name: 'May', visitas: 2800, sesionesAR: 1800 },
  { name: 'Jun', visitas: 3200, sesionesAR: 2100 },
];

const topMonuments = [
  { name: 'Huaca Pucllana', visitas: 1250, crecimiento: 12 },
  { name: 'Circuito Mágico del Agua', visitas: 980, crecimiento: 8 },
  { name: 'Parque de las Leyendas', visitas: 875, crecimiento: 15 },
  { name: 'Museo Larco', visitas: 650, crecimiento: -3 },
  { name: 'Casa de Aliaga', visitas: 420, crecimiento: 22 },
];

const deviceTypes = [
  { name: 'Android', value: 68, color: '#3B82F6' },
  { name: 'iOS', value: 32, color: '#EF4444' },
];

const districtData = [
  { name: 'Miraflores', visitas: 850 },
  { name: 'San Isidro', visitas: 720 },
  { name: 'Barranco', visitas: 680 },
  { name: 'Lima Centro', visitas: 920 },
  { name: 'San Borja', visitas: 340 },
];

export function Dashboard() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Dashboard Principal</h1>
          <p className="text-muted-foreground">
            Resumen de actividad de HistoriAR - {new Date().toLocaleDateString('es-PE', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="w-4 h-4" />
          Exportar Reporte
        </Button>
      </div>

      {/* KPIs Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuarios Activos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,847</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+12%</span> vs mes anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Visitas Totales</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">14,673</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+8%</span> vs mes anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sesiones AR</CardTitle>
            <Camera className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">9,234</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+15%</span> vs mes anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Retención 7d</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">68%</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-red-600">-2%</span> vs mes anterior
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Alertas y Notificaciones */}
      <Card className="border-orange-200 bg-orange-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-orange-800">
            <AlertTriangle className="w-5 h-5" />
            Alertas Importantes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-2 bg-white rounded-lg">
              <div className="flex items-center gap-2">
                <Badge variant="secondary">Contenido</Badge>
                <span className="text-sm">3 monumentos pendientes de aprobación</span>
              </div>
              <Button variant="ghost" size="sm">Ver</Button>
            </div>
            <div className="flex items-center justify-between p-2 bg-white rounded-lg">
              <div className="flex items-center gap-2">
                <Badge variant="destructive">Error</Badge>
                <span className="text-sm">2 experiencias AR con fallos técnicos</span>
              </div>
              <Button variant="ghost" size="sm">Ver</Button>
            </div>
            <div className="flex items-center justify-between p-2 bg-white rounded-lg">
              <div className="flex items-center gap-2">
                <Badge variant="outline">Soporte</Badge>
                <span className="text-sm">8 reportes de usuarios sin resolver</span>
              </div>
              <Button variant="ghost" size="sm">Ver</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Gráficos principales */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Tendencia de Visitas y Sesiones AR</CardTitle>
            <CardDescription>Comparativa mensual del último semestre</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyVisits}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="visitas" stroke="#3B82F6" strokeWidth={2} name="Visitas" />
                <Line type="monotone" dataKey="sesionesAR" stroke="#EF4444" strokeWidth={2} name="Sesiones AR" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Distribución por Dispositivos</CardTitle>
            <CardDescription>Porcentaje de usuarios por plataforma</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={deviceTypes}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {deviceTypes.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value}%`} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-4 mt-4">
              {deviceTypes.map((entry) => (
                <div key={entry.name} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: entry.color }}
                  />
                  <span className="text-sm">{entry.name} ({entry.value}%)</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Ranking y Estadísticas adicionales */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Top Monumentos más Visitados</CardTitle>
            <CardDescription>Ranking del último mes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topMonuments.map((monument, index) => (
                <div key={monument.name} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium">{monument.name}</p>
                      <p className="text-sm text-muted-foreground">{monument.visitas} visitas</p>
                    </div>
                  </div>
                  <Badge 
                    variant={monument.crecimiento > 0 ? "default" : "destructive"}
                    className="gap-1"
                  >
                    {monument.crecimiento > 0 ? '+' : ''}{monument.crecimiento}%
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Actividad por Distrito</CardTitle>
            <CardDescription>Visitas registradas por ubicación</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={districtData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={80} />
                <Tooltip />
                <Bar dataKey="visitas" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Estadísticas de tiempo real */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              Sesión Promedio
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12m 34s</div>
            <p className="text-xs text-muted-foreground">+2m vs promedio</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-muted-foreground" />
              Instalaciones Hoy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">127</div>
            <p className="text-xs text-muted-foreground">Meta: 150 diarias</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Eye className="w-4 h-4 text-muted-foreground" />
              Usuarios Online
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89</div>
            <p className="text-xs text-muted-foreground">Activos ahora</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}