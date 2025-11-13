/**
 * Vista de Analítica y Métricas de HistoriAR
 * 
 * Presenta paneles y gráficos para analizar el comportamiento de usuarios,
 * engagement de experiencias AR, distribución demográfica y embudo de conversión.
 * Incluye exportación de reportes (simulada) en múltiples formatos.
 */
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from './ui/table';
import {
  Download,
  Calendar,
  Users,
  MapPin,
  Camera,
  TrendingUp,
  TrendingDown,
  FileBarChart
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell,
  AreaChart,
  Area
} from 'recharts';

// ============================================
// DATOS SIMULADOS PARA ANÁLISIS (mock)
// Nota: Estos datos se deberían reemplazar por consultas a la API en producción.
// ============================================
// Curva de retención de usuarios por día (D1, D3, D7, etc.)
const userRetentionData = [
  { day: 'D1', percentage: 85 },
  { day: 'D3', percentage: 72 },
  { day: 'D7', percentage: 58 },
  { day: 'D14', percentage: 45 },
  { day: 'D30', percentage: 32 },
];

// Usuarios activos por franja horaria
const hourlyUsageData = [
  { hour: '00:00', users: 45 },
  { hour: '03:00', users: 23 },
  { hour: '06:00', users: 67 },
  { hour: '09:00', users: 156 },
  { hour: '12:00', users: 234 },
  { hour: '15:00', users: 198 },
  { hour: '18:00', users: 287 },
  { hour: '21:00', users: 145 },
];

// Distribución de usuarios por grupo etario
const ageGroupData = [
  { age: '18-24', value: 28, color: '#3B82F6' },
  { age: '25-34', value: 35, color: '#EF4444' },
  { age: '35-44', value: 22, color: '#10B981' },
  { age: '45-54', value: 12, color: '#F59E0B' },
  { age: '55+', value: 3, color: '#8B5CF6' },
];

// Engagement de experiencias AR (tasa de finalización y duración)
const arEngagementData = [
  { name: 'Ene', completionRate: 68, avgDuration: 145 },
  { name: 'Feb', completionRate: 72, avgDuration: 152 },
  { name: 'Mar', completionRate: 75, avgDuration: 168 },
  { name: 'Abr', completionRate: 71, avgDuration: 159 },
  { name: 'May', completionRate: 78, avgDuration: 174 },
  { name: 'Jun', completionRate: 82, avgDuration: 189 },
];

// Contenidos/top lugares con mejor rendimiento
const topPerformingContent = [
  { name: 'Huaca Pucllana', visits: 1250, engagement: 85, arUsage: 92 },
  { name: 'Museo Larco', visits: 980, engagement: 78, arUsage: 68 },
  { name: 'Casa de Aliaga', visits: 675, engagement: 82, arUsage: 75 },
  { name: 'Circuito Mágico', visits: 550, engagement: 70, arUsage: 45 },
  { name: 'Parque de las Leyendas', visits: 420, engagement: 65, arUsage: 38 },
];

// Embudo: desde descarga hasta usuario activo (5+ visitas)
const conversionFunnelData = [
  { step: 'Descarga App', users: 10000, percentage: 100 },
  { step: 'Registro', users: 7500, percentage: 75 },
  { step: 'Primera Visita', users: 5200, percentage: 52 },
  { step: 'Primera Experiencia AR', users: 3900, percentage: 39 },
  { step: 'Usuario Activo (5+ visitas)', users: 2100, percentage: 21 },
];

/**
 * Componente principal de Analítica
 * - Permite cambiar rango de tiempo y tipo de reporte
 * - Renderiza tarjetas de KPIs, gráficos y tablas
 */
function AnalyticsView() {
  const [timeRange, setTimeRange] = useState('30d');
  const [reportType, setReportType] = useState('general');

  const exportReport = (format) => {
    // Simulación de exportación
    console.log(`Exportando reporte en formato ${format} para período ${timeRange}`);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Encabezado con acciones: rango de tiempo y exportación */}
      <div className="flex items-center justify-between">
        <div>
          <h1>Analítica y Métricas</h1>
          <p className="text-muted-foreground">
            Análisis detallado del comportamiento de usuarios y rendimiento de contenido
          </p>
        </div>
        
        <div className="flex gap-2">
          {/* Selector de rango temporal */}
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Últimos 7 días</SelectItem>
              <SelectItem value="30d">Últimos 30 días</SelectItem>
              <SelectItem value="90d">Últimos 3 meses</SelectItem>
              <SelectItem value="1y">Último año</SelectItem>
            </SelectContent>
          </Select>
          
          {/* Acciones de exportación (mock) */}
          <Button variant="outline" onClick={() => exportReport('csv')} className="gap-2">
            <Download className="w-4 h-4" />
            Exportar CSV
          </Button>
          
          <Button variant="outline" onClick={() => exportReport('pdf')} className="gap-2">
            <FileBarChart className="w-4 h-4" />
            Reporte PDF
          </Button>
        </div>
      </div>

      {/* ============================================ */}
      {/* MÉTRICAS PRINCIPALES (KPIs) */}
      {/* ============================================ */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">DAU (Usuarios Activos Diarios)</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,247</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-green-600" />
              <span className="text-green-600">+8.2%</span> vs ayer
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tiempo Promedio de Sesión</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">14m 32s</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <TrendingDown className="w-3 h-3 text-red-600" />
              <span className="text-red-600">-1.4%</span> vs promedio
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tasa de Finalización AR</CardTitle>
            <Camera className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">76.8%</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-green-600" />
              <span className="text-green-600">+3.1%</span> vs mes anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ubicaciones Visitadas</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,847</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-green-600" />
              <span className="text-green-600">+12.5%</span> vs mes anterior
            </p>
          </CardContent>
        </Card>
      </div>

      {/* ============================================ */}
      {/* GRÁFICOS DE ANÁLISIS */}
      {/* Retención y Uso por hora */}
      {/* ============================================ */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Retención de Usuarios</CardTitle>
            <CardDescription>Porcentaje de usuarios que regresan después de su primera visita</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={userRetentionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip formatter={(value) => `${value}%`} />
                <Area type="monotone" dataKey="percentage" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Uso por Hora del Día</CardTitle>
            <CardDescription>Distribución de usuarios activos por hora</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={hourlyUsageData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="users" fill="#EF4444" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Distribución por Edad</CardTitle>
            <CardDescription>Segmentación demográfica de usuarios</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={ageGroupData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {ageGroupData.map((entry) => (
                    <Cell key={`cell-${entry.age}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value}%`} />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-3 gap-2 mt-4">
              {ageGroupData.map((entry) => (
                <div key={entry.age} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: entry.color }}
                  />
                  <span className="text-sm">{entry.age}</span>
                  <span className="text-xs text-muted-foreground">({entry.value}%)</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Engagement de Experiencias AR</CardTitle>
            <CardDescription>Tasa de finalización y duración promedio</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={arEngagementData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Line 
                  yAxisId="left" 
                  type="monotone" 
                  dataKey="completionRate" 
                  stroke="#10B981" 
                  strokeWidth={2}
                  name="Tasa de finalización (%)"
                />
                <Line 
                  yAxisId="right" 
                  type="monotone" 
                  dataKey="avgDuration" 
                  stroke="#F59E0B" 
                  strokeWidth={2}
                  name="Duración promedio (seg)"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* ============================================ */}
      {/* TABLAS DE RENDIMIENTO */}
      {/* Contenido top y embudo de conversión */}
      {/* ============================================ */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Top Contenido por Rendimiento</CardTitle>
            <CardDescription>Monumentos y experiencias más exitosas</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Contenido</TableHead>
                  <TableHead>Visitas</TableHead>
                  <TableHead>Engagement</TableHead>
                  <TableHead>Uso AR</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topPerformingContent.map((item, index) => (
                  <TableRow key={item.name}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs">
                          {index + 1}
                        </div>
                        <span className="font-medium">{item.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{item.visits.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge variant={item.engagement > 75 ? "default" : "secondary"}>
                        {item.engagement}%
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={item.arUsage > 70 ? "default" : "secondary"}>
                        {item.arUsage}%
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Embudo de Conversión</CardTitle>
            <CardDescription>Flujo de usuarios desde descarga hasta uso activo</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {conversionFunnelData.map((step, index) => (
                <div key={step.step} className="relative">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">{step.step}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold">{step.users.toLocaleString()}</span>
                      <Badge variant="outline">{step.percentage}%</Badge>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${step.percentage}%` }}
                    />
                  </div>
                  {index < conversionFunnelData.length - 1 && (
                    <div className="flex justify-center my-2">
                      <div className="text-xs text-muted-foreground bg-gray-100 px-2 py-1 rounded">
                        -{Math.round((conversionFunnelData[index].users - conversionFunnelData[index + 1].users) / conversionFunnelData[index].users * 100)}%
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ============================================ */}
      {/* EXPORTACIÓN DE REPORTES PERSONALIZADOS */}
      {/* ============================================ */}
      <Card>
        <CardHeader>
          <CardTitle>Exportar Reportes Personalizados</CardTitle>
          <CardDescription>Genera reportes específicos para diferentes períodos y métricas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <Select value={reportType} onValueChange={setReportType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">Reporte General</SelectItem>
                <SelectItem value="users">Análisis de Usuarios</SelectItem>
                <SelectItem value="content">Rendimiento de Contenido</SelectItem>
                <SelectItem value="ar">Métricas de AR</SelectItem>
                <SelectItem value="geo">Análisis Geográfico</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" onClick={() => exportReport('excel')} className="gap-2">
              <Download className="w-4 h-4" />
              Exportar Excel
            </Button>

            <Button onClick={() => exportReport('dashboard')} className="gap-2">
              <FileBarChart className="w-4 h-4" />
              Dashboard Ejecutivo
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default AnalyticsView;
