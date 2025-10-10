import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
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
  Search,
  Filter,
  MoreHorizontal,
  Ban,
  CheckCircle,
  Trash2,
  Mail,
  Activity,
  Calendar,
  Smartphone,
  MapPin,
  Users,
  UserCheck,
  UserX,
  Send
} from 'lucide-react';

interface AppUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  status: 'activo' | 'bloqueado';
  lastActive: string;
  joinDate: string;
  device: 'Android' | 'iOS';
  version: string;
  visits: number;
  favoriteDistrict: string;
  arSessions: number;
}

const mockUsers: AppUser[] = [
  {
    id: '1',
    name: 'María González',
    email: 'maria.gonzalez@email.com',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b25c6d6e?w=150',
    status: 'activo',
    lastActive: '2024-01-15T14:30:00Z',
    joinDate: '2023-12-01',
    device: 'iOS',
    version: '2.1.0',
    visits: 15,
    favoriteDistrict: 'Miraflores',
    arSessions: 12
  },
  {
    id: '2',
    name: 'Carlos Ruiz',
    email: 'carlos.ruiz@email.com',
    status: 'activo',
    lastActive: '2024-01-14T09:15:00Z',
    joinDate: '2023-11-15',
    device: 'Android',
    version: '2.0.8',
    visits: 8,
    favoriteDistrict: 'San Isidro',
    arSessions: 6
  },
  {
    id: '3',
    name: 'Ana Torres',
    email: 'ana.torres@email.com',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
    status: 'bloqueado',
    lastActive: '2024-01-10T16:45:00Z',
    joinDate: '2023-10-20',
    device: 'Android',
    version: '2.1.0',
    visits: 25,
    favoriteDistrict: 'Barranco',
    arSessions: 20
  },
  {
    id: '4',
    name: 'Luis Mendoza',
    email: 'luis.mendoza@email.com',
    status: 'activo',
    lastActive: '2024-01-15T11:20:00Z',
    joinDate: '2024-01-05',
    device: 'iOS',
    version: '2.1.0',
    visits: 3,
    favoriteDistrict: 'Lima Centro',
    arSessions: 2
  }
];

const statusLabels = {
  activo: 'Activo',
  bloqueado: 'Bloqueado'
};

const statusColors = {
  activo: 'default',
  bloqueado: 'destructive'
} as const;

export function UsersManager() {
  const [users, setUsers] = useState<AppUser[]>(mockUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedDevice, setSelectedDevice] = useState('all');
  const [isMessageDialogOpen, setIsMessageDialogOpen] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || user.status === selectedStatus;
    const matchesDevice = selectedDevice === 'all' || user.device === selectedDevice;
    
    return matchesSearch && matchesStatus && matchesDevice;
  });

  const handleStatusToggle = (id: string) => {
    setUsers(prev => 
      prev.map(user => 
        user.id === id 
          ? { ...user, status: user.status === 'activo' ? 'bloqueado' : 'activo' }
          : user
      )
    );
  };

  const handleDelete = (id: string) => {
    setUsers(prev => prev.filter(user => user.id !== id));
  };

  const formatLastActive = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffHours < 1) return 'Hace menos de 1 hora';
    if (diffHours < 24) return `Hace ${diffHours} horas`;
    const diffDays = Math.floor(diffHours / 24);
    return `Hace ${diffDays} días`;
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Gestión de Usuarios</h1>
          <p className="text-muted-foreground">
            Administra los usuarios de la aplicación móvil HistoriAR
          </p>
        </div>
        
        <Dialog open={isMessageDialogOpen} onOpenChange={setIsMessageDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Mail className="w-4 h-4" />
              Enviar Mensaje
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Enviar Mensaje a Usuarios</DialogTitle>
              <DialogDescription>
                Envía un correo electrónico o notificación push a los usuarios seleccionados
              </DialogDescription>
            </DialogHeader>
            <MessageForm onClose={() => setIsMessageDialogOpen(false)} />
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
                placeholder="Buscar usuarios por nombre o email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="activo">Activos</SelectItem>
                <SelectItem value="bloqueado">Bloqueados</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedDevice} onValueChange={setSelectedDevice}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Dispositivo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="Android">Android</SelectItem>
                <SelectItem value="iOS">iOS</SelectItem>
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
                <Users className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium">Total Usuarios</p>
                <p className="text-2xl font-bold">{users.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <UserCheck className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium">Usuarios Activos</p>
                <p className="text-2xl font-bold">
                  {users.filter(u => u.status === 'activo').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                <UserX className="w-4 h-4 text-red-600" />
              </div>
              <div>
                <p className="text-sm font-medium">Usuarios Bloqueados</p>
                <p className="text-2xl font-bold">
                  {users.filter(u => u.status === 'bloqueado').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <Activity className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium">Promedio Visitas</p>
                <p className="text-2xl font-bold">
                  {Math.round(users.reduce((sum, u) => sum + u.visits, 0) / users.length)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabla de usuarios */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Usuarios</CardTitle>
          <CardDescription>
            {filteredUsers.length} usuarios encontrados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Usuario</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Dispositivo</TableHead>
                <TableHead>Actividad</TableHead>
                <TableHead>Estadísticas</TableHead>
                <TableHead>Última conexión</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback>
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusColors[user.status]}>
                      {statusLabels[user.status]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Smartphone className="w-4 h-4 text-muted-foreground" />
                      <span>{user.device}</span>
                      <span className="text-xs text-muted-foreground">v{user.version}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{user.favoriteDistrict}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="text-sm">
                        <span className="font-medium">{user.visits}</span> visitas
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <span className="font-medium">{user.arSessions}</span> sesiones AR
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="text-sm">{formatLastActive(user.lastActive)}</div>
                      <div className="text-xs text-muted-foreground">
                        Desde {new Date(user.joinDate).toLocaleDateString('es-PE')}
                      </div>
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
                        <DropdownMenuItem>
                          <Activity className="mr-2 h-4 w-4" />
                          Ver actividad
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Mail className="mr-2 h-4 w-4" />
                          Enviar mensaje
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleStatusToggle(user.id)}
                        >
                          {user.status === 'activo' ? (
                            <>
                              <Ban className="mr-2 h-4 w-4" />
                              Bloquear usuario
                            </>
                          ) : (
                            <>
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Desbloquear usuario
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-destructive"
                          onClick={() => handleDelete(user.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Eliminar usuario
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

function MessageForm({ onClose }: { onClose: () => void }) {
  const [messageType, setMessageType] = useState('email');
  
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="message-type">Tipo de mensaje</Label>
        <Select value={messageType} onValueChange={setMessageType}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="email">Correo electrónico</SelectItem>
            <SelectItem value="push">Notificación push</SelectItem>
            <SelectItem value="both">Ambos</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="recipients">Destinatarios</Label>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Seleccionar usuarios" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los usuarios</SelectItem>
            <SelectItem value="active">Solo usuarios activos</SelectItem>
            <SelectItem value="android">Usuarios Android</SelectItem>
            <SelectItem value="ios">Usuarios iOS</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="subject">Asunto</Label>
        <Input id="subject" placeholder="Asunto del mensaje" />
      </div>

      <div>
        <Label htmlFor="message">Mensaje</Label>
        <Textarea 
          id="message" 
          placeholder="Escribe tu mensaje aquí..."
          rows={4}
        />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <Button onClick={onClose} className="gap-2">
          <Send className="w-4 h-4" />
          Enviar Mensaje
        </Button>
      </div>
    </div>
  );
}