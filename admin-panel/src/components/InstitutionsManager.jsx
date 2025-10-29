/**
 * Gestor de Instituciones (InstitutionsManager)
 * 
 * Permite listar, filtrar y administrar instituciones (museos, universidades, etc.).
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
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import {
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Building,
  MapPin,
  Loader2
} from 'lucide-react';
import apiService from '../services/api';
import PropTypes from 'prop-types';

// Etiquetas legibles para los tipos
const typeLabels = {
  'Museo': 'Museo',
  'Universidad': 'Universidad',
  'Municipalidad': 'Municipalidad',
  'Otro': 'Otro'
};

function InstitutionsManager() {
  const [institutions, setInstitutions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingInstitution, setEditingInstitution] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // Cargar datos iniciales
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await apiService.getInstitutions();
      setInstitutions(data.items || data || []);
    } catch (error) {
      console.error('Error loading institutions:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filtro compuesto por término de búsqueda y tipo
  const filteredInstitutions = institutions.filter(institution => {
    const matchesSearch = institution.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         institution.district?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || institution.type === selectedType;
    
    return matchesSearch && matchesType;
  });

  // Eliminar institución
  const handleDelete = async (id) => {
    if (!confirm('¿Estás seguro de que deseas eliminar esta institución?')) return;
    
    try {
      await apiService.deleteInstitution(id);
      setInstitutions(prev => prev.filter(institution => institution._id !== id));
    } catch (error) {
      console.error('Error deleting institution:', error);
      alert('Error al eliminar la institución');
    }
  };

  // Abrir diálogo de edición
  const handleEdit = (institution) => {
    setEditingInstitution(institution);
    setIsEditDialogOpen(true);
  };

  // Cerrar diálogo de edición
  const handleCloseEdit = () => {
    setEditingInstitution(null);
    setIsEditDialogOpen(false);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Gestión de Instituciones</h1>
          <p className="text-muted-foreground">
            Administra las instituciones asociadas a los monumentos
          </p>
        </div>
        
        {/* Diálogo de creación de institución */}
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Nueva Institución
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Crear Nueva Institución</DialogTitle>
              <DialogDescription>
                Añade una nueva institución al sistema
              </DialogDescription>
            </DialogHeader>
            <InstitutionForm 
              onClose={() => setIsCreateDialogOpen(false)}
              onSave={loadData}
            />
          </DialogContent>
        </Dialog>

        {/* Diálogo de edición de institución */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Editar Institución</DialogTitle>
              <DialogDescription>
                Modifica la información de la institución seleccionada
              </DialogDescription>
            </DialogHeader>
            <InstitutionForm 
              institution={editingInstitution}
              onClose={handleCloseEdit}
              onSave={loadData}
            />
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
                placeholder="Buscar instituciones por nombre o distrito..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los tipos</SelectItem>
                <SelectItem value="Museo">Museos</SelectItem>
                <SelectItem value="Universidad">Universidades</SelectItem>
                <SelectItem value="Municipalidad">Municipalidades</SelectItem>
                <SelectItem value="Otro">Otros</SelectItem>
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
                <Building className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium">Total Instituciones</p>
                <p className="text-2xl font-bold">{institutions.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <Building className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium">Museos</p>
                <p className="text-2xl font-bold">
                  {institutions.filter(i => i.type === 'Museo').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <Building className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium">Universidades</p>
                <p className="text-2xl font-bold">
                  {institutions.filter(i => i.type === 'Universidad').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                <MapPin className="w-4 h-4 text-orange-600" />
              </div>
              <div>
                <p className="text-sm font-medium">Municipalidades</p>
                <p className="text-2xl font-bold">
                  {institutions.filter(i => i.type === 'Municipalidad').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabla de instituciones */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Instituciones</CardTitle>
          <CardDescription>
            {filteredInstitutions.length} instituciones encontradas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Institución</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Distrito</TableHead>
                <TableHead>Contacto</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto" />
                    <p className="mt-2 text-muted-foreground">Cargando instituciones...</p>
                  </TableCell>
                </TableRow>
              ) : filteredInstitutions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    <p className="text-muted-foreground">No se encontraron instituciones</p>
                  </TableCell>
                </TableRow>
              ) : (
                filteredInstitutions.map((institution) => (
                  <TableRow key={institution._id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{institution.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {institution.description?.substring(0, 50)}...
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {typeLabels[institution.type] || institution.type}
                      </Badge>
                    </TableCell>
                    <TableCell>{institution.district || 'Sin distrito'}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {institution.contactEmail && (
                          <p>{institution.contactEmail}</p>
                        )}
                        {institution.phone && (
                          <p className="text-muted-foreground">{institution.phone}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(institution)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-destructive"
                            onClick={() => handleDelete(institution._id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Eliminar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function InstitutionForm({ onClose, institution = null, onSave }) {
  const [formData, setFormData] = useState({
    name: institution?.name || '',
    type: institution?.type || 'Museo',
    description: institution?.description || '',
    district: institution?.district || '',
    address: institution?.address || '',
    contactEmail: institution?.contactEmail || '',
    phone: institution?.phone || '',
    website: institution?.website || '',
    schedule: {
      monday: institution?.schedule?.monday || { closed: true },
      tuesday: institution?.schedule?.tuesday || { open: '09:00', close: '17:00' },
      wednesday: institution?.schedule?.wednesday || { open: '09:00', close: '17:00' },
      thursday: institution?.schedule?.thursday || { open: '09:00', close: '17:00' },
      friday: institution?.schedule?.friday || { open: '09:00', close: '17:00' },
      saturday: institution?.schedule?.saturday || { open: '09:00', close: '17:00' },
      sunday: institution?.schedule?.sunday || { closed: true }
    }
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      if (institution) {
        await apiService.updateInstitution(institution._id, formData);
      } else {
        await apiService.createInstitution(formData);
      }
      
      onSave();
      onClose();
    } catch (error) {
      console.error('Error saving institution:', error);
      alert('Error al guardar la institución: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isEditing = Boolean(institution);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Nombre</Label>
          <Input 
            id="name" 
            placeholder="Nombre de la institución"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="type">Tipo</Label>
          <Select 
            value={formData.type} 
            onValueChange={(value) => handleInputChange('type', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Museo">Museo</SelectItem>
              <SelectItem value="Universidad">Universidad</SelectItem>
              <SelectItem value="Municipalidad">Municipalidad</SelectItem>
              <SelectItem value="Otro">Otro</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="district">Distrito</Label>
          <Input 
            id="district" 
            placeholder="Distrito"
            value={formData.district}
            onChange={(e) => handleInputChange('district', e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="phone">Teléfono</Label>
          <Input 
            id="phone" 
            placeholder="(01) 123-4567"
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="address">Dirección</Label>
        <Input 
          id="address" 
          placeholder="Dirección completa"
          value={formData.address}
          onChange={(e) => handleInputChange('address', e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="contactEmail">Email de contacto</Label>
          <Input 
            id="contactEmail" 
            type="email"
            placeholder="contacto@institucion.pe"
            value={formData.contactEmail}
            onChange={(e) => handleInputChange('contactEmail', e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="website">Sitio web</Label>
          <Input 
            id="website" 
            placeholder="https://www.institucion.pe"
            value={formData.website}
            onChange={(e) => handleInputChange('website', e.target.value)}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="description">Descripción</Label>
        <Textarea 
          id="description" 
          placeholder="Descripción de la institución"
          rows={3}
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
        />
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
            isEditing ? 'Actualizar Institución' : 'Crear Institución'
          )}
        </Button>
      </div>
    </div>
  );
}

InstitutionForm.propTypes = {
  onClose: PropTypes.func.isRequired,
  institution: PropTypes.object,
  onSave: PropTypes.func.isRequired,
};

export default InstitutionsManager;