/**
 * Gestor de Categorías (CategoriesManager)
 * 
 * Permite listar, filtrar y administrar categorías de monumentos.
 */
import { useState, useEffect } from 'react';
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
import { Label } from './ui/label';
import {
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Tag,
  Palette,
  Loader2,
  Building,
  Castle,
  Church,
  Landmark,
  Mountain,
  TreePine,
  Waves,
  Sun,
  Moon,
  Star,
  Crown,
  Shield,
  Sword,
  Anchor,
  Compass,
  Map,
  Globe,
  Home,
  School,
  Hospital,
  Factory,
  Store,
  Plane,
  Car,
  Train,
  Ship,
  Rocket,
  Camera,
  Music,
  Palette as PaletteIcon,
  Book,
  Scroll,
  Feather,
  Gem,
  Key,
  Lock,
  Heart,
  Flame,
  Zap,
  Leaf,
  Flower,
  Bug,
  Fish,
  Bird
} from 'lucide-react';
import apiService from '../services/api';
import PropTypes from 'prop-types';

// Iconos disponibles para las categorías
const availableIcons = {
  // Arquitectura y Edificios
  Building: Building,
  Castle: Castle,
  Church: Church,
  Landmark: Landmark,
  Home: Home,
  School: School,
  Hospital: Hospital,
  Factory: Factory,
  Store: Store,
  
  // Naturaleza y Geografía
  Mountain: Mountain,
  TreePine: TreePine,
  Waves: Waves,
  Sun: Sun,
  Moon: Moon,
  Star: Star,
  Globe: Globe,
  Map: Map,
  Compass: Compass,
  Leaf: Leaf,
  Flower: Flower,
  
  // Historia y Cultura
  Crown: Crown,
  Shield: Shield,
  Sword: Sword,
  Scroll: Scroll,
  Book: Book,
  Feather: Feather,
  Key: Key,
  Lock: Lock,
  
  // Transporte
  Anchor: Anchor,
  Plane: Plane,
  Car: Car,
  Train: Train,
  Ship: Ship,
  Rocket: Rocket,
  
  // Arte y Entretenimiento
  Camera: Camera,
  Music: Music,
  PaletteIcon: PaletteIcon,
  
  // Elementos y Símbolos
  Heart: Heart,
  Flame: Flame,
  Zap: Zap,
  Gem: Gem,
  Tag: Tag,
  
  // Animales
  Bug: Bug,
  Fish: Fish,
  Bird: Bird
};

function CategoriesManager() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // Cargar datos iniciales
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await apiService.getCategories();
      setCategories(data.items || data || []);
    } catch (error) {
      console.error('Error loading categories:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filtro por término de búsqueda
  const filteredCategories = categories.filter(category => {
    const matchesSearch = category.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         category.description?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  // Eliminar categoría
  const handleDelete = async (id) => {
    if (!confirm('¿Estás seguro de que deseas eliminar esta categoría?')) return;
    
    try {
      await apiService.deleteCategory(id);
      setCategories(prev => prev.filter(category => category._id !== id));
    } catch (error) {
      console.error('Error deleting category:', error);
      alert('Error al eliminar la categoría: ' + error.message);
    }
  };

  // Abrir diálogo de edición
  const handleEdit = (category) => {
    setEditingCategory(category);
    setIsEditDialogOpen(true);
  };

  // Cerrar diálogo de edición
  const handleCloseEdit = () => {
    setEditingCategory(null);
    setIsEditDialogOpen(false);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Gestión de Categorías</h1>
          <p className="text-muted-foreground">
            Administra las categorías de monumentos y sitios históricos
          </p>
        </div>
        
        {/* Diálogo de creación de categoría */}
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Nueva Categoría
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Crear Nueva Categoría</DialogTitle>
              <DialogDescription>
                Añade una nueva categoría para clasificar monumentos
              </DialogDescription>
            </DialogHeader>
            <CategoryForm 
              onClose={() => setIsCreateDialogOpen(false)}
              onSave={loadData}
            />
          </DialogContent>
        </Dialog>

        {/* Diálogo de edición de categoría */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Editar Categoría</DialogTitle>
              <DialogDescription>
                Modifica la información de la categoría seleccionada
              </DialogDescription>
            </DialogHeader>
            <CategoryForm 
              category={editingCategory}
              onClose={handleCloseEdit}
              onSave={loadData}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Filtros y búsqueda */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar categorías por nombre o descripción..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
        </CardContent>
      </Card>

      {/* Estadísticas rápidas */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <Tag className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium">Total Categorías</p>
                <p className="text-2xl font-bold">{categories.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <Tag className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium">Categorías Activas</p>
                <p className="text-2xl font-bold">
                  {categories.filter(c => c.isActive).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <Palette className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium">Colores Únicos</p>
                <p className="text-2xl font-bold">
                  {new Set(categories.map(c => c.color)).size}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabla de categorías */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Categorías</CardTitle>
          <CardDescription>
            {filteredCategories.length} categorías encontradas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Categoría</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead>Color</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto" />
                    <p className="mt-2 text-muted-foreground">Cargando categorías...</p>
                  </TableCell>
                </TableRow>
              ) : filteredCategories.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    <p className="text-muted-foreground">No se encontraron categorías</p>
                  </TableCell>
                </TableRow>
              ) : (
                filteredCategories.map((category) => {
                  const IconComponent = availableIcons[category.icon] || Tag;
                  return (
                    <TableRow key={category._id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-8 h-8 rounded-lg flex items-center justify-center"
                            style={{ backgroundColor: category.color + '20' }}
                          >
                            <IconComponent 
                              className="w-4 h-4" 
                              style={{ color: category.color }}
                            />
                          </div>
                          <div>
                            <p className="font-medium">{category.name}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm text-muted-foreground">
                          {category.description || 'Sin descripción'}
                        </p>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-4 h-4 rounded-full border"
                            style={{ backgroundColor: category.color }}
                          />
                          <span className="text-sm font-mono">{category.color}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={category.isActive ? 'default' : 'secondary'}>
                          {category.isActive ? 'Activa' : 'Inactiva'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEdit(category)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="text-destructive"
                              onClick={() => handleDelete(category._id)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Eliminar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function CategoryForm({ onClose, category = null, onSave }) {
  const [formData, setFormData] = useState({
    name: category?.name || '',
    description: category?.description || '',
    color: category?.color || '#3B82F6',
    icon: category?.icon || 'Tag',
    isActive: category?.isActive ?? true
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      if (category) {
        await apiService.updateCategory(category._id, formData);
      } else {
        await apiService.createCategory(formData);
      }
      
      onSave();
      onClose();
    } catch (error) {
      console.error('Error saving category:', error);
      alert('Error al guardar la categoría: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isEditing = Boolean(category);

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="name">Nombre</Label>
        <Input 
          id="name" 
          placeholder="Nombre de la categoría"
          value={formData.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          required
        />
      </div>

      <div>
        <Label htmlFor="description">Descripción</Label>
        <Input 
          id="description" 
          placeholder="Descripción de la categoría"
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="color">Color</Label>
          <div className="flex items-center gap-2">
            <Input 
              id="color" 
              type="color"
              value={formData.color}
              onChange={(e) => handleInputChange('color', e.target.value)}
              className="w-16 h-10 p-1"
            />
            <Input 
              value={formData.color}
              onChange={(e) => handleInputChange('color', e.target.value)}
              placeholder="#3B82F6"
              className="flex-1"
            />
          </div>
        </div>
        <div>
          <Label htmlFor="icon">Icono</Label>
          <Select 
            value={formData.icon} 
            onValueChange={(value) => handleInputChange('icon', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar icono" />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(availableIcons).map((iconName) => {
                const IconComponent = availableIcons[iconName];
                return (
                  <SelectItem key={iconName} value={iconName}>
                    <div className="flex items-center gap-2">
                      <IconComponent className="w-4 h-4" />
                      {iconName}
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="isActive">Estado</Label>
        <Select 
          value={formData.isActive.toString()} 
          onValueChange={(value) => handleInputChange('isActive', value === 'true')}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="true">Activa</SelectItem>
            <SelectItem value="false">Inactiva</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
          Cancelar
        </Button>
        <Button onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              {isEditing ? 'Actualizando...' : 'Creando...'}
            </>
          ) : (
            isEditing ? 'Actualizar Categoría' : 'Crear Categoría'
          )}
        </Button>
      </div>
    </div>
  );
}

CategoryForm.propTypes = {
  onClose: PropTypes.func.isRequired,
  category: PropTypes.object,
  onSave: PropTypes.func.isRequired,
};

export default CategoriesManager;