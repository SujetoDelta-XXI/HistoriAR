/**
 * Gestor de Monumentos (MonumentsManager)
 * 
 * Permite listar, filtrar y administrar (mock) monumentos y sitios históricos.
 * Incluye creación (diálogo), cambio de estado, eliminación y estadísticas rápidas.
 */
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from './ui/table';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from './ui/dropdown-menu';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import {
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Eye,
  Trash2,
  MapPin,
  Calendar
} from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import PropTypes from 'prop-types';

const mockMonuments = [
  {
    id: '1',
    title: 'Huaca Pucllana',
    category: 'huaca',
    district: 'Miraflores',
    status: 'publicado',
    visits: 1250,
    rating: 4.5,
    lastModified: '2024-01-15',
    image: 'https://images.unsplash.com/photo-1555078233-8c11a1b6c9b6?w=400',
    description: 'Sitio arqueológico preincaico de la cultura Lima.',
    address: 'Calle General Borgoño cuadra 8, Miraflores',
    schedule: 'Miércoles a Lunes: 9:00 - 17:00',
    price: 'S/ 15.00'
  },
  {
    id: '2',
    title: 'Museo Larco',
    category: 'museo',
    district: 'Pueblo Libre',
    status: 'publicado',
    visits: 650,
    rating: 4.8,
    lastModified: '2024-01-12',
    image: 'https://images.unsplash.com/photo-1580619305218-8423a7ef79b4?w=400',
    description: 'Museo privado de arte precolombino peruano.',
    address: 'Av. Simón Bolívar 1515, Pueblo Libre',
    schedule: 'Todos los días: 9:00 - 22:00',
    price: 'S/ 30.00'
  },
  {
    id: '3',
    title: 'Casa de Aliaga',
    category: 'sitio_historico',
    district: 'Lima Centro',
    status: 'borrador',
    visits: 420,
    rating: 4.2,
    lastModified: '2024-01-10',
    image: 'https://images.unsplash.com/photo-1518331647614-4ca666c4e2c2?w=400',
    description: 'Casa colonial del siglo XVI habitada por la misma familia.',
    address: 'Jr. de la Unión 224, Lima',
    schedule: 'Lunes a Viernes: 10:00 - 17:00',
    price: 'S/ 35.00'
  }
];

// Etiquetas legibles para las categorías
const categoryLabels = {
  huaca: 'Huaca',
  museo: 'Museo',
  sitio_historico: 'Sitio Histórico'
};

// Etiquetas legibles para los estados
const statusLabels = {
  borrador: 'Borrador',
  publicado: 'Publicado',
  oculto: 'Oculto'
};

// Mapeo de color de badge por estado
const statusColors = {
  borrador: 'secondary',
  publicado: 'default',
  oculto: 'destructive'
};

function MonumentsManager() {
  const [monuments, setMonuments] = useState(mockMonuments);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  // Filtro compuesto por término de búsqueda, categoría y estado
  const filteredMonuments = monuments.filter(monument => {
    const matchesSearch = monument.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         monument.district.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || monument.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || monument.status === selectedStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Cambiar estado del monumento y actualizar última modificación
  const handleStatusChange = (id, newStatus) => {
    setMonuments(prev => 
      prev.map(monument => 
        monument.id === id 
          ? { ...monument, status: newStatus, lastModified: new Date().toISOString().split('T')[0] }
          : monument
      )
    );
  };

  // Eliminar monumento de la lista
  const handleDelete = (id) => {
    setMonuments(prev => prev.filter(monument => monument.id !== id));
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Gestión de Monumentos</h1>
          <p className="text-muted-foreground">
            Administra los monumentos y sitios históricos de la aplicación
          </p>
        </div>
        
        {/* Diálogo de creación de monumento */}
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Nuevo Monumento
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Crear Nuevo Monumento</DialogTitle>
              <DialogDescription>
                Añade un nuevo monumento o sitio histórico al catálogo
              </DialogDescription>
            </DialogHeader>
            <MonumentForm onClose={() => setIsCreateDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Filtros y búsqueda */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar monumentos por nombre o distrito..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las categorías</SelectItem>
                <SelectItem value="huaca">Huacas</SelectItem>
                <SelectItem value="museo">Museos</SelectItem>
                <SelectItem value="sitio_historico">Sitios Históricos</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="publicado">Publicado</SelectItem>
                <SelectItem value="borrador">Borrador</SelectItem>
                <SelectItem value="oculto">Oculto</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Estadísticas rápidas */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <MapPin className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium">Total Monumentos</p>
                <p className="text-2xl font-bold">{monuments.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <Eye className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium">Publicados</p>
                <p className="text-2xl font-bold">
                  {monuments.filter(m => m.status === 'publicado').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                <Edit className="w-4 h-4 text-orange-600" />
              </div>
              <div>
                <p className="text-sm font-medium">Borradores</p>
                <p className="text-2xl font-bold">
                  {monuments.filter(m => m.status === 'borrador').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium">Visitas Total</p>
                <p className="text-2xl font-bold">
                  {monuments.reduce((sum, m) => sum + m.visits, 0).toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabla de monumentos */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Monumentos</CardTitle>
          <CardDescription>
            {filteredMonuments.length} monumentos encontrados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Monumento</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead>Distrito</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Visitas</TableHead>
                <TableHead>Última modificación</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMonuments.map((monument) => (
                <TableRow key={monument.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <ImageWithFallback
                        src={monument.image}
                        alt={monument.title}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div>
                        <p className="font-medium">{monument.title}</p>
                        <p className="text-sm text-muted-foreground">
                          ⭐ {monument.rating} • {monument.price}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {categoryLabels[monument.category]}
                    </Badge>
                  </TableCell>
                  <TableCell>{monument.district}</TableCell>
                  <TableCell>
                    <Badge variant={statusColors[monument.status]}>
                      {statusLabels[monument.status]}
                    </Badge>
                  </TableCell>
                  <TableCell>{monument.visits.toLocaleString()}</TableCell>
                  <TableCell>
                    {new Date(monument.lastModified).toLocaleDateString('es-PE')}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" />
                          Ver detalles
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                        {monument.status === 'borrador' && (
                          <DropdownMenuItem 
                            onClick={() => handleStatusChange(monument.id, 'publicado')}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            Publicar
                          </DropdownMenuItem>
                        )}
                        {monument.status === 'publicado' && (
                          <DropdownMenuItem 
                            onClick={() => handleStatusChange(monument.id, 'oculto')}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            Ocultar
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem 
                          className="text-destructive"
                          onClick={() => handleDelete(monument.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function MonumentForm({ onClose }) {
  // Formulario simple de creación (mock) de monumentos
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="title">Título</Label>
          <Input id="title" placeholder="Nombre del monumento" />
        </div>
        <div>
          <Label htmlFor="category">Categoría</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar categoría" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="huaca">Huaca</SelectItem>
              <SelectItem value="museo">Museo</SelectItem>
              <SelectItem value="sitio_historico">Sitio Histórico</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="district">Distrito</Label>
          <Input id="district" placeholder="Distrito" />
        </div>
        <div>
          <Label htmlFor="price">Precio</Label>
          <Input id="price" placeholder="S/ 0.00" />
        </div>
      </div>

      <div>
        <Label htmlFor="address">Dirección</Label>
        <Input id="address" placeholder="Dirección completa" />
      </div>

      <div>
        <Label htmlFor="schedule">Horarios</Label>
        <Input id="schedule" placeholder="Lunes a Viernes: 9:00 - 17:00" />
      </div>

      <div>
        <Label htmlFor="description">Descripción</Label>
        <Textarea 
          id="description" 
          placeholder="Descripción del monumento o sitio histórico"
          rows={3}
        />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <Button onClick={onClose}>
          Crear Monumento
        </Button>
      </div>
    </div>
  );
}

MonumentForm.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default MonumentsManager;
