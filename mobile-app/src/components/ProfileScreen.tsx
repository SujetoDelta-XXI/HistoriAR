import { motion } from 'motion/react'
import { Card, CardContent } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Avatar, AvatarFallback } from './ui/avatar'
import { Separator } from './ui/separator'
import { 
  MapPin, 
  Camera, 
  Trophy, 
  Clock, 
  Shield, 
  HelpCircle, 
  LogOut,
  Edit,
  Award,
  Calendar
} from 'lucide-react'

export function ProfileScreen() {

  const userProfile = {
    name: "Explorer Usuario",
    email: "explorer@historiar.com",
    level: 7,
    totalPoints: 12450,
    monumentsVisited: 8,
    arScans: 23,
    timeSpent: "15.5h",
    joinDate: "Enero 2024",
    achievements: 6,
    badges: ["Primer Explorador", "Fotógrafo AR", "Historiador Dedicado"]
  }

  const recentActivity = [
    {
      id: 1,
      type: "visit",
      title: "Visitaste Palacio de Torre Tagle",
      date: "Hace 2 días",
      points: 150,
      icon: MapPin
    },
    {
      id: 2,
      type: "achievement",
      title: "Logro desbloqueado: Explorador de Lima",
      date: "Hace 3 días",
      points: 500,
      icon: Trophy
    },
    {
      id: 3,
      type: "scan",
      title: "Escaneaste 5 objetos AR",
      date: "Hace 1 semana",
      points: 100,
      icon: Camera
    }
  ]



  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header */}
      <div className="px-4 pt-12 pb-6 bg-white border-b border-gray-100">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-2xl font-bold text-black mb-2">Mi Perfil</h1>
          <p className="text-gray-600">Configuración y estadísticas</p>
        </motion.div>
      </div>

      {/* Content */}
      <div className="flex-1 px-4 py-4 pb-20 overflow-auto space-y-6">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4 mb-4">
                <Avatar className="w-16 h-16">
                  <AvatarFallback className="bg-[#FF6600] text-white text-xl">
                    {userProfile.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-black">{userProfile.name}</h2>
                  <p className="text-gray-600">{userProfile.email}</p>
                  <div className="flex items-center mt-2">
                    <Badge className="bg-[#FF6600] text-white mr-2">
                      Nivel {userProfile.level}
                    </Badge>
                    <Badge variant="outline">
                      <Calendar className="w-3 h-3 mr-1" />
                      {userProfile.joinDate}
                    </Badge>
                  </div>
                </div>
                
                <Button variant="outline" size="sm">
                  <Edit className="w-4 h-4 mr-2" />
                  Editar
                </Button>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-black">{userProfile.totalPoints.toLocaleString()}</p>
                  <p className="text-sm text-gray-600">Puntos Totales</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-black">{userProfile.achievements}</p>
                  <p className="text-sm text-gray-600">Logros</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="grid grid-cols-3 gap-3"
        >
          <Card>
            <CardContent className="p-4 text-center">
              <MapPin className="w-6 h-6 mx-auto mb-2 text-[#FF6600]" />
              <p className="text-lg font-bold text-black">{userProfile.monumentsVisited}</p>
              <p className="text-xs text-gray-600">Monumentos Visitados</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <Camera className="w-6 h-6 mx-auto mb-2 text-[#FF6600]" />
              <p className="text-lg font-bold text-black">{userProfile.arScans}</p>
              <p className="text-xs text-gray-600">Escaneos AR</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <Clock className="w-6 h-6 mx-auto mb-2 text-[#FF6600]" />
              <p className="text-lg font-bold text-black">{userProfile.timeSpent}</p>
              <p className="text-xs text-gray-600">Tiempo Total</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <h2 className="text-lg font-bold text-black mb-4">Insignias Recientes</h2>
          <div className="flex items-center space-x-2 overflow-x-auto pb-2">
            {userProfile.badges.map((badge, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 + index * 0.1, duration: 0.6 }}
                className="flex-shrink-0"
              >
                <Badge className="bg-[#FF6600] text-white px-3 py-1">
                  <Award className="w-3 h-3 mr-1" />
                  {badge}
                </Badge>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <h2 className="text-lg font-bold text-black mb-4">Actividad Reciente</h2>
          <Card>
            <CardContent className="p-0">
              {recentActivity.map((activity, index) => {
                const Icon = activity.icon
                return (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 + index * 0.1, duration: 0.6 }}
                    className="flex items-center space-x-4 p-4 border-b border-gray-100 last:border-b-0"
                  >
                    <div className="w-10 h-10 bg-[#FF6600]/10 rounded-full flex items-center justify-center">
                      <Icon className="w-5 h-5 text-[#FF6600]" />
                    </div>
                    
                    <div className="flex-1">
                      <p className="font-medium text-black">{activity.title}</p>
                      <p className="text-sm text-gray-600">{activity.date}</p>
                    </div>
                    
                    <Badge className="bg-green-100 text-green-700">
                      +{activity.points} XP
                    </Badge>
                  </motion.div>
                )
              })}
            </CardContent>
          </Card>
        </motion.div>



        {/* Additional Options */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <Card>
            <CardContent className="p-0">
              <Button variant="ghost" className="w-full justify-start p-4 h-auto">
                <Shield className="w-5 h-5 mr-4 text-gray-600" />
                <div className="text-left">
                  <p className="font-medium text-black">Privacidad y Seguridad</p>
                  <p className="text-sm text-gray-600">Gestiona tu privacidad</p>
                </div>
              </Button>
              
              <Separator />
              
              <Button variant="ghost" className="w-full justify-start p-4 h-auto">
                <HelpCircle className="w-5 h-5 mr-4 text-gray-600" />
                <div className="text-left">
                  <p className="font-medium text-black">Ayuda y Soporte</p>
                  <p className="text-sm text-gray-600">Obtén ayuda con la app</p>
                </div>
              </Button>
              
              <Separator />
              
              <Button variant="ghost" className="w-full justify-start p-4 h-auto text-red-600 hover:text-red-700 hover:bg-red-50">
                <LogOut className="w-5 h-5 mr-4" />
                <div className="text-left">
                  <p className="font-medium">Cerrar Sesión</p>
                  <p className="text-sm text-red-400">Salir de tu cuenta</p>
                </div>
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}