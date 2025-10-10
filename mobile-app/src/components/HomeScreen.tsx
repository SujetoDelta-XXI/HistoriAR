import { motion } from 'motion/react'
import { Card, CardContent } from './ui/card'
import { Badge } from './ui/badge'
import { MapPin, Clock, Users } from 'lucide-react'
import { ImageWithFallback } from './figma/ImageWithFallback'

interface HomeScreenProps {
  onNavigate: (screen: string, data?: any) => void
}

export function HomeScreen({ onNavigate }: HomeScreenProps) {
  const featuredHuacas = [
    {
      id: 1,
      name: "Huaca Puruchuco",
      period: "1100 - 1532 d.C.",
      visitors: 324,
      image: "https://images.unsplash.com/photo-1714876906025-77b148689e2c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxMaW1hJTIwUGVydSUyMGNvbG9uaWFsJTIwYXJjaGl0ZWN0dXJlfGVufDF8fHx8MTc1OTAzMTM0M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    },
    {
      id: 2,
      name: "Huaca La Palma",
      period: "900 - 1200 d.C.",
      visitors: 156,
      image: "https://images.unsplash.com/photo-1565719073549-49601e85fe3d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxQYWxhY2lvJTIwVG9ycmUlMjBUYWdsZSUyMExpbWF8ZW58MXx8fHwxNzU5MDMxMzQ3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    }
  ]

  const stats = [
    { label: "Huacas Visitadas", value: "3", icon: MapPin },
    { label: "Tiempo Total", value: "2.5h", icon: Clock },
    { label: "Logros", value: "5", icon: Users },
  ]

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header */}
      <div className="px-4 pt-12 pb-6 bg-white">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-2xl font-bold text-black mb-2">¡Hola Explorer!</h1>
          <p className="text-gray-600">Descubre las Huacas de Santa Anita</p>
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-4 pb-20 overflow-auto">
        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="grid grid-cols-3 gap-3 mb-6"
        >
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <Card key={index} className="text-center">
                <CardContent className="p-4">
                  <Icon className="w-6 h-6 mx-auto mb-2 text-[#FF6600]" />
                  <p className="text-lg font-bold text-black">{stat.value}</p>
                  <p className="text-xs text-gray-600">{stat.label}</p>
                </CardContent>
              </Card>
            )
          })}
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mb-6"
        >
          <h2 className="text-lg font-bold text-black mb-4">Acceso Rápido</h2>
          <div className="grid grid-cols-2 gap-3">
            <Card 
              className="cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => onNavigate('explore')}
            >
              <CardContent className="p-4 text-center">
                <div className="w-12 h-12 bg-[#FF6600] rounded-full flex items-center justify-center mx-auto mb-3">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <p className="font-bold text-black">Explorar Huacas</p>
                <p className="text-xs text-gray-600">Descubre sitios cercanos</p>
              </CardContent>
            </Card>
            
            <Card 
              className="cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => onNavigate('ar')}
            >
              <CardContent className="p-4 text-center">
                <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center mx-auto mb-3">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="w-6 h-6 border-2 border-white border-t-transparent rounded-full"
                  />
                </div>
                <p className="font-bold text-black">RA en Vivo</p>
                <p className="text-xs text-gray-600">Experiencia inmersiva</p>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Featured Huacas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <h2 className="text-lg font-bold text-black mb-4">Huacas Destacadas</h2>
          <div className="space-y-4">
            {featuredHuacas.map((huaca, index) => (
              <motion.div
                key={huaca.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 + index * 0.1, duration: 0.6 }}
              >
                <Card 
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => onNavigate('detail', huaca)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                        <ImageWithFallback
                          src={huaca.image}
                          alt={huaca.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-black truncate">{huaca.name}</h3>
                        <p className="text-sm text-gray-600">{huaca.period}</p>
                        <div className="flex items-center mt-2 space-x-3">
                          <Badge variant="secondary" className="text-xs">
                            <Users className="w-3 h-3 mr-1" />
                            {huaca.visitors}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-[#FF6600]">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}