import { useState } from 'react'
import { motion } from 'motion/react'
import { Card, CardContent } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { ArrowLeft, MapPin, Clock, Users, Camera, Play, Info, RotateCcw } from 'lucide-react'
import { ImageWithFallback } from './figma/ImageWithFallback'

interface HuacaDetailScreenProps {
  huaca: any
  onNavigate: (screen: string, data?: any) => void
  onBack: () => void
}

export function HuacaDetailScreen({ huaca, onNavigate, onBack }: HuacaDetailScreenProps) {
  const [activeTab, setActiveTab] = useState('historia')
  const [is3DViewing, setIs3DViewing] = useState(false)

  const timelineEvents = [
    { year: "800 d.C.", event: "Construcción inicial del complejo ceremonial", period: "Período Intermedio Temprano" },
    { year: "1100 d.C.", event: "Expansión y renovación de estructuras", period: "Horizonte Medio" },
    { year: "1400 d.C.", event: "Ocupación inca y modificaciones", period: "Horizonte Tardío" },
    { year: "1532 d.C.", event: "Abandono tras la conquista española", period: "Período Colonial" },
    { year: "1960", event: "Inicio de excavaciones arqueológicas", period: "Período Moderno" },
    { year: "2010", event: "Apertura al público como sitio turístico", period: "Actualidad" }
  ]

  const tabs = [
    { id: 'historia', label: 'Historia' },
    { id: 'timeline', label: 'Línea de Tiempo' },
    { id: 'gallery', label: 'Galería' }
  ]

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header */}
      <div className="relative">
        <div className="h-64 bg-gray-200 overflow-hidden">
          <ImageWithFallback
            src={huaca.image}
            alt={huaca.name}
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Back Button */}
        <button
          onClick={onBack}
          className="absolute top-12 left-4 w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>

        {/* Status Badge */}
        <div className="absolute top-12 right-4">
          <Badge className={`${huaca.isOpen ? 'bg-green-500' : 'bg-red-500'} text-white`}>
            {huaca.isOpen ? 'Abierta' : 'Cerrada'}
          </Badge>
        </div>

        {/* 3D Model Toggle */}
        <div className="absolute bottom-4 right-4">
          <Button
            onClick={() => setIs3DViewing(!is3DViewing)}
            className="bg-white/90 text-black hover:bg-white"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            {is3DViewing ? 'Vista Foto' : 'Modelo 3D'}
          </Button>
        </div>

        {/* 3D Model Overlay */}
        {is3DViewing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-black/80 flex items-center justify-center"
          >
            <div className="text-center text-white">
              <div className="w-32 h-32 mx-auto mb-4 border-4 border-white/30 rounded-lg flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-[#FF6600] border-t-transparent rounded-full animate-spin" />
              </div>
              <p className="text-lg">Cargando modelo 3D...</p>
              <p className="text-sm text-white/70 mt-2">Experiencia interactiva</p>
            </div>
          </motion.div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto pb-20">
        {/* Basic Info */}
        <div className="p-4 border-b border-gray-100">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-2xl font-bold text-black mb-2">{huaca.name}</h1>
            <p className="text-gray-600 mb-3">{huaca.description}</p>
            <p className="text-sm text-gray-500 mb-4">{huaca.period}</p>

            <div className="flex items-center space-x-6 text-sm text-gray-600 mb-4">
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-1" />
                {huaca.distance}
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                {huaca.duration}
              </div>
              <div className="flex items-center">
                <Users className="w-4 h-4 mr-1" />
                {huaca.visitors} visitantes
              </div>
            </div>

            <Button 
              onClick={() => onNavigate('ar', huaca)}
              className="w-full bg-[#FF6600] hover:bg-[#E55A00] text-white mb-4"
              style={{ backgroundColor: '#FF6600' }}
            >
              <Camera className="w-5 h-5 mr-2" />
              Ver en Realidad Aumentada
            </Button>
          </motion.div>
        </div>

        {/* Tabs */}
        <div className="px-4 py-2 border-b border-gray-100">
          <div className="flex space-x-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-[#FF6600] text-white'
                    : 'text-gray-600 hover:text-black hover:bg-gray-100'
                }`}
                style={activeTab === tab.id ? { backgroundColor: '#FF6600' } : {}}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-4">
          {activeTab === 'historia' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-4"
            >
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-bold text-black mb-3">Historia del Sitio</h3>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Este complejo arqueológico representa uno de los sitios más importantes del período 
                    precolombino en la zona de Santa Anita. Construido originalmente por culturas locales, 
                    fue posteriormente ocupado y modificado durante el Imperio Inca.
                  </p>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Las estructuras principales incluyen plataformas ceremoniales, áreas residenciales 
                    y sistemas de irrigación que demuestran el avanzado conocimiento técnico de sus constructores.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    Las excavaciones arqueológicas han revelado una rica cultura material que incluye 
                    cerámicas, textiles y herramientas que proporcionan insights únicos sobre la vida 
                    cotidiana de sus habitantes.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <h3 className="font-bold text-black mb-3">Importancia Cultural</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Este sitio arqueológico es fundamental para entender la evolución cultural de la región. 
                    Su preservación nos permite conectar con nuestras raíces ancestrales y comprender 
                    las complejas sociedades que habitaron estas tierras hace siglos.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {activeTab === 'timeline' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-4"
            >
              <h3 className="font-bold text-black mb-4">Línea de Tiempo</h3>
              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-[#FF6600]" />
                {timelineEvents.map((event, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.6 }}
                    className="relative flex items-start mb-6 pl-10"
                  >
                    <div className="absolute left-2 w-4 h-4 bg-[#FF6600] rounded-full -translate-x-1/2" />
                    <div className="flex-1">
                      <div className="flex items-center mb-1">
                        <span className="font-bold text-[#FF6600] mr-2">{event.year}</span>
                        <Badge variant="outline" className="text-xs">
                          {event.period}
                        </Badge>
                      </div>
                      <p className="text-gray-700">{event.event}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'gallery' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-4"
            >
              <h3 className="font-bold text-black mb-4">Galería de Imágenes</h3>
              <div className="grid grid-cols-2 gap-3">
                {[1, 2, 3, 4].map((index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1, duration: 0.6 }}
                    className="aspect-square bg-gray-200 rounded-lg overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                  >
                    <ImageWithFallback
                      src={huaca.image}
                      alt={`${huaca.name} - Vista ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                ))}
              </div>
              
              <Card className="mt-4">
                <CardContent className="p-4 text-center">
                  <Play className="w-8 h-8 text-[#FF6600] mx-auto mb-2" />
                  <h4 className="font-bold text-black mb-1">Tour Virtual</h4>
                  <p className="text-sm text-gray-600 mb-3">
                    Explora el sitio con nuestro recorrido interactivo de 360°
                  </p>
                  <Button 
                    className="bg-[#FF6600] hover:bg-[#E55A00] text-white"
                    style={{ backgroundColor: '#FF6600' }}
                  >
                    Iniciar Tour
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}