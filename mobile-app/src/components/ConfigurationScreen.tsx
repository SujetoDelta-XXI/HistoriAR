import { useState } from 'react'
import { motion } from 'motion/react'
import { Card, CardContent } from './ui/card'
import { Button } from './ui/button'
import { Switch } from './ui/switch'
import { Separator } from './ui/separator'
import { Badge } from './ui/badge'
import { 
  Settings, 
  Bell, 
  MapPin, 
  Camera, 
  Volume2, 
  Wifi, 
  HelpCircle, 
  Info, 
  Shield, 
  Smartphone,
  Battery,
  HardDrive,
  LogOut
} from 'lucide-react'

export function ConfigurationScreen() {
  const [settings, setSettings] = useState({
    notifications: true,
    location: true,
    arEffects: true,
    sound: true,
    highQuality: true,
    offlineMode: false,
    dataUsage: false
  })

  const handleSettingChange = (key: string, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  const appInfo = {
    version: "2.1.4",
    build: "Build 2024.01.15",
    lastUpdate: "15 Ene 2024"
  }

  const settingSections = [
    {
      title: "Notificaciones y Permisos",
      icon: Bell,
      settings: [
        {
          key: 'notifications',
          title: 'Notificaciones Push',
          description: 'Recibir alertas sobre nuevos monumentos y eventos',
          icon: Bell
        },
        {
          key: 'location',
          title: 'Acceso a Ubicación',
          description: 'Permitir acceso para experiencias basadas en ubicación',
          icon: MapPin
        }
      ]
    },
    {
      title: "Realidad Aumentada",
      icon: Camera,
      settings: [
        {
          key: 'arEffects',
          title: 'Efectos AR Avanzados',
          description: 'Habilitar partículas y efectos visuales en RA',
          icon: Camera
        },
        {
          key: 'highQuality',
          title: 'Calidad Alta',
          description: 'Renderizado de alta calidad (consume más batería)',
          icon: Smartphone
        }
      ]
    },
    {
      title: "Audio",
      icon: Volume2,
      settings: [
        {
          key: 'sound',
          title: 'Efectos de Sonido',
          description: 'Reproducir sonidos al interactuar con monumentos',
          icon: Volume2
        }
      ]
    },
    {
      title: "Datos y Almacenamiento",
      icon: HardDrive,
      settings: [
        {
          key: 'offlineMode',
          title: 'Modo Offline',
          description: 'Usar contenido descargado sin conexión',
          icon: Wifi
        },
        {
          key: 'dataUsage',
          title: 'Optimizar Datos',
          description: 'Reducir el uso de datos móviles',
          icon: Smartphone
        }
      ]
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
          <h1 className="text-2xl font-bold text-black mb-2">Configuración</h1>
          <p className="text-gray-600">Ajustes y preferencias de la app</p>
        </motion.div>
      </div>

      {/* Content */}
      <div className="flex-1 px-4 py-4 pb-20 overflow-auto space-y-6">
        {/* Settings Sections */}
        {settingSections.map((section, sectionIndex) => {
          const SectionIcon = section.icon
          return (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: sectionIndex * 0.1, duration: 0.6 }}
            >
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-[#FF6600] rounded-full flex items-center justify-center mr-3">
                  <SectionIcon className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-lg font-bold text-black">{section.title}</h2>
              </div>

              <Card>
                <CardContent className="p-0">
                  {section.settings.map((setting, settingIndex) => {
                    const SettingIcon = setting.icon
                    return (
                      <div key={setting.key}>
                        <div className="flex items-center justify-between p-4">
                          <div className="flex items-center space-x-4 flex-1">
                            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                              <SettingIcon className="w-5 h-5 text-gray-600" />
                            </div>
                            
                            <div className="flex-1">
                              <p className="font-medium text-black">{setting.title}</p>
                              <p className="text-sm text-gray-600">{setting.description}</p>
                            </div>
                          </div>
                          
                          <Switch
                            checked={settings[setting.key as keyof typeof settings]}
                            onCheckedChange={(value) => handleSettingChange(setting.key, value)}
                          />
                        </div>
                        {settingIndex < section.settings.length - 1 && <Separator />}
                      </div>
                    )
                  })}
                </CardContent>
              </Card>
            </motion.div>
          )
        })}



        {/* App Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 bg-[#FF6600] rounded-full flex items-center justify-center mr-3">
              <Info className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-lg font-bold text-black">Información de la App</h2>
          </div>

          <Card>
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Versión</span>
                  <span className="font-medium text-black">{appInfo.version}</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Build</span>
                  <span className="font-medium text-black">{appInfo.build}</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Última actualización</span>
                  <span className="font-medium text-black">{appInfo.lastUpdate}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Additional Options */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <Card>
            <CardContent className="p-0">
              <Button variant="ghost" className="w-full justify-start p-4 h-auto">
                <Shield className="w-5 h-5 mr-4 text-gray-600" />
                <div className="text-left">
                  <p className="font-medium text-black">Privacidad y Seguridad</p>
                  <p className="text-sm text-gray-600">Gestiona tus datos y privacidad</p>
                </div>
              </Button>
              
              <Separator />
              
              <Button variant="ghost" className="w-full justify-start p-4 h-auto">
                <HelpCircle className="w-5 h-5 mr-4 text-gray-600" />
                <div className="text-left">
                  <p className="font-medium text-black">Ayuda y Soporte</p>
                  <p className="text-sm text-gray-600">FAQ, tutoriales y contacto</p>
                </div>
              </Button>
              
              <Separator />
              
              <Button variant="ghost" className="w-full justify-start p-4 h-auto">
                <Battery className="w-5 h-5 mr-4 text-gray-600" />
                <div className="text-left">
                  <p className="font-medium text-black">Optimización de Batería</p>
                  <p className="text-sm text-gray-600">Consejos para ahorrar batería</p>
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

        {/* Performance Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="bg-orange-50 border border-orange-200 rounded-lg p-4"
        >
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-[#FF6600] rounded-full flex items-center justify-center mt-0.5">
              <Battery className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-black mb-2">Consejos de Rendimiento</h3>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Desactiva "Calidad Alta" para ahorrar batería</li>
                <li>• Activa "Optimizar Datos" en conexiones móviles</li>
                <li>• Usa el modo offline cuando sea posible</li>
                <li>• Ajusta los efectos AR según tu dispositivo</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}