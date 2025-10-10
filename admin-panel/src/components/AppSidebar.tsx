import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarTrigger,
} from "./ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback } from "./ui/avatar";
import {
  BarChart3,
  Building2,
  Camera,
  ChevronUp,
  FileText,
  Flag,
  LayoutDashboard,
  MapPin,
  MessageSquare,
  Settings,
  Shield,
  Users,
  LogOut,
  Eye,
  Mail,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

interface AppSidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

export function AppSidebar({ activeView, onViewChange }: AppSidebarProps) {
  const { user, logout, hasPermission } = useAuth();

  const navigationItems = [
    {
      group: "Principal",
      items: [
        {
          id: "dashboard",
          title: "Dashboard",
          icon: LayoutDashboard,
          permission: "dashboard:read",
        },
      ],
    },
    {
      group: "Gestión de Contenido",
      items: [
        {
          id: "monuments",
          title: "Monumentos",
          icon: Building2,
          permission: "content:read",
        },
        {
          id: "museums",
          title: "Museos",
          icon: MapPin,
          permission: "content:read",
        },
        {
          id: "ar-experiences",
          title: "Experiencias AR",
          icon: Camera,
          permission: "content:read",
        },
        {
          id: "categories",
          title: "Categorías",
          icon: Flag,
          permission: "content:read",
        },
      ],
    },
    {
      group: "Usuarios y Moderación",
      items: [
        {
          id: "users",
          title: "Usuarios App",
          icon: Users,
          permission: "users:read",
        },
        {
          id: "reports",
          title: "Reportes",
          icon: MessageSquare,
          permission: "moderation:read",
        },
        {
          id: "reviews",
          title: "Reseñas",
          icon: Eye,
          permission: "moderation:read",
        },
        {
          id: "messaging",
          title: "Mensajería",
          icon: Mail,
          permission: "messaging:send",
        },
      ],
    },
    {
      group: "Analítica",
      items: [
        {
          id: "analytics",
          title: "Métricas",
          icon: BarChart3,
          permission: "analytics:read",
        },
        {
          id: "export-reports",
          title: "Reportes",
          icon: FileText,
          permission: "reports:export",
        },
      ],
    },
    {
      group: "Administración",
      items: [
        {
          id: "audit",
          title: "Auditoría",
          icon: Shield,
          permission: "*",
        },
        {
          id: "settings",
          title: "Configuración",
          icon: Settings,
          permission: "*",
        },
      ],
    },
  ];

  const filteredNavigation = navigationItems.map((group) => ({
    ...group,
    items: group.items.filter((item) => hasPermission(item.permission)),
  })).filter((group) => group.items.length > 0);

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-1">
          <div className="w-8 h-8 bg-amber-600 rounded-lg flex items-center justify-center">
            <MapPin className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-sm font-semibold">HistoriAR</p>
            <p className="text-xs text-muted-foreground">Admin Panel</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {filteredNavigation.map((group) => (
          <SidebarGroup key={group.group}>
            <SidebarGroupLabel>{group.group}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      onClick={() => onViewChange(item.id)}
                      isActive={activeView === item.id}
                    >
                      <item.icon className="w-4 h-4" />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <Avatar className="w-8 h-8">
                    <AvatarFallback>
                      {user?.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col items-start text-left">
                    <span className="text-sm font-medium">{user?.name}</span>
                    <span className="text-xs text-muted-foreground capitalize">
                      {user?.role.replace('_', ' ')}
                    </span>
                  </div>
                  <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" className="w-[--radix-popper-anchor-width]">
                <DropdownMenuItem onClick={logout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Cerrar Sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}