import { useState, useEffect } from 'react'
import { motion } from 'motion/react'
import { Card, CardContent } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { MapPin, Navigation, Layers, Search, Eye, Lock } from 'lucide-react'

interface MapExploreScreenProps {
  onMonumentSelect: (monument: any) => void
  visitedMonuments: Set<number>
}

export function MapExploreScreen({ onMonumentSelect, visitedMonuments }: MapExploreScreenProps) {
  const [userLocation, setUserLocation] = useState({ lat: -12.0464, lng: -77.0428 }) // Lima, Peru
  const [selectedMonument, setSelectedMonument] = useState<any>(null)
  const [mapCenter, setMapCenter] = useState({ lat: -12.0464, lng: -77.0428 })
  const [zoom, setZoom] = useState(14)

  const monuments = [
    {
      id: 1,
      name: "Huaca Puruchuco",
      type: "Sitio Arqueológico",
      lat: -12.0234,
      lng: -77.0145,
      distance: 850,
      canVisit: true,
      period: "1100-1532 d.C.",
      culture: "Inca",
      discovered: true,
      district: "Ate"
    },
    {
      id: 2,
      name: "Plaza Mayor de Lima",
      type: "Plaza Histórica", 
      lat: -12.0464,
      lng: -77.0428,
      distance: 200,
      canVisit: true,
      period: "1535 d.C.",
      culture: "Colonial",
      discovered: true,
      district: "Cercado de Lima"
    },
    {
      id: 3,
      name: "Palacio de Torre Tagle",
      type: "Edificio Colonial",
      lat: -12.0478,
      lng: -77.0305,
      distance: 1100,
      canVisit: false,
      period: "1715-1735 d.C.",
      culture: "Colonial",
      discovered: true,
      district: "Cercado de Lima"
    },
    {
      id: 4,
      name: "Huaca Huallamarca",
      type: "Sitio Arqueológico",
      lat: -12.0923,
      lng: -77.0373,
      distance: 5200,
      canVisit: false,
      period: "200-700 d.C.",
      culture: "Lima",
      discovered: false,
      district: "San Isidro"
    },
    {
      id: 5,
      name: "Catedral de Lima",
      type: "Edificio Religioso",
      lat: -12.0456,
      lng: -77.0334,
      distance: 850,
      canVisit: true,
      period: "1535-1625 d.C.",
      culture: "Colonial",
      discovered: true,
      district: "Cercado de Lima"
    },
    {
      id: 6,
      name: "Palacio de Gobierno",
      type: "Edificio Gubernamental",
      lat: -12.0445,
      lng: -77.0389,
      distance: 600,
      canVisit: true,
      period: "1535-1937 d.C.",
      culture: "Colonial/Republicano",
      discovered: true,
      district: "Cercado de Lima"
    }
  ]

  const getMonumentIcon = (monument: any) => {
    const isVisited = visitedMonuments.has(monument.id)
    const canVisit = monument.distance <= 1000 && monument.discovered
    
    if (isVisited) {
      switch (monument.type) {
        case 'Sitio Arqueológico': return "🏛️"
        case 'Plaza Histórica': return "🏛️"
        case 'Edificio Religioso': return "⛪"
        case 'Edificio Gubernamental': return "🏛️"
        case 'Edificio Colonial': return "🏛️"
        default: return "🏛️"
      }
    }
    if (canVisit) return "📍"
    if (!monument.discovered) return "❓"
    return "🔒"
  }

  const getMonumentColor = (monument: any) => {
    const isVisited = visitedMonuments.has(monument.id)
    const canVisit = monument.distance <= 1000 && monument.discovered
    
    if (isVisited) return "bg-green-500"
    if (canVisit) return "bg-[#FF6600]"
    if (!monument.discovered) return "bg-gray-400"
    return "bg-red-500"
  }

  const getRelativePosition = (monument: any) => {
    // Simular posiciones relativas en el mapa
    const latDiff = (monument.lat - mapCenter.lat) * 1000
    const lngDiff = (monument.lng - mapCenter.lng) * 1000
    
    return {
      x: 50 + lngDiff,
      y: 50 + latDiff
    }
  }

  const handleMonumentClick = (monument: any) => {
    setSelectedMonument(monument)
  }

  const handleARView = () => {
    if (selectedMonument) {
      onMonumentSelect(selectedMonument)
    }
  }

  const centerOnUser = () => {
    setMapCenter(userLocation)
  }

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header */}
      <div className="px-4 pt-12 pb-4 bg-white border-b border-gray-100 z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-2xl font-bold text-black">Explorar</h1>
            <p className="text-gray-600">Descubre monumentos de Lima</p>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Search className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm">
              <Layers className="w-4 h-4" />
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Map Area */}
      <div className="flex-1 relative bg-gradient-to-br from-green-100 to-green-200 overflow-hidden">
        {/* Simulated Map Background */}
        <div className="absolute inset-0">
          <div className="grid grid-cols-8 grid-rows-8 h-full w-full opacity-20">
            {Array.from({ length: 64 }).map((_, i) => (
              <div key={i} className="border border-gray-300" />
            ))}
          </div>
        </div>

        {/* Streets overlay */}
        <div className="absolute inset-0">
          <div className="absolute top-1/3 left-0 right-0 h-1 bg-gray-400 opacity-60" />
          <div className="absolute top-2/3 left-0 right-0 h-1 bg-gray-400 opacity-60" />
          <div className="absolute left-1/4 top-0 bottom-0 w-1 bg-gray-400 opacity-60" />
          <div className="absolute left-3/4 top-0 bottom-0 w-1 bg-gray-400 opacity-60" />
        </div>

        {/* User Location */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10"
        >
          <div className="relative">
            <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg" />
            <motion.div
              animate={{ scale: [1, 1.5, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 bg-blue-300 rounded-full opacity-30"
            />
          </div>
        </motion.div>

        {/* Monuments */}
        {monuments.map((monument, index) => {
          const position = getRelativePosition(monument)
          const isVisited = visitedMonuments.has(monument.id)
          const canVisit = monument.distance <= 1000 && monument.discovered
          
          return (
            <motion.div
              key={monument.id}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8 + index * 0.2, duration: 0.6 }}
              className="absolute z-20 cursor-pointer"
              style={{
                left: `${Math.max(10, Math.min(85, position.x))}%`,
                top: `${Math.max(10, Math.min(85, position.y))}%`
              }}
              onClick={() => handleMonumentClick(monument)}
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="relative"
              >
                <div className={`w-12 h-12 ${getMonumentColor(monument)} rounded-full flex items-center justify-center shadow-lg border-2 border-white`}>
                  <span className="text-white text-lg">{getMonumentIcon(monument)}</span>
                </div>
                
                {/* Distance badge */}
                <div className="absolute -top-2 -right-2 bg-white rounded-full px-2 py-1 text-xs font-bold text-black shadow">
                  {monument.distance}m
                </div>
                
                {/* Visited indicator */}
                {isVisited && (
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                )}

                {/* Discovery ring animation */}
                {canVisit && !isVisited && (
                  <motion.div
                    animate={{ scale: [1, 1.5, 1], opacity: [0.8, 0, 0.8] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-0 bg-[#FF6600] rounded-full opacity-30"
                  />
                )}
              </motion.div>
            </motion.div>
          )
        })}

        {/* Map Controls */}
        <div className="absolute top-4 right-4 space-y-2">
          <Button
            onClick={() => setZoom(prev => Math.min(prev + 1, 18))}
            className="w-10 h-10 bg-white hover:bg-gray-50 text-black shadow-lg"
          >
            +
          </Button>
          <Button
            onClick={() => setZoom(prev => Math.max(prev - 1, 10))}
            className="w-10 h-10 bg-white hover:bg-gray-50 text-black shadow-lg"
          >
            -
          </Button>
        </div>

        {/* Center on user button */}
        <Button
          onClick={centerOnUser}
          className="absolute bottom-20 right-4 w-12 h-12 bg-white hover:bg-gray-50 text-black shadow-lg rounded-full"
        >
          <Navigation className="w-6 h-6" />
        </Button>
      </div>

      {/* Selected Monument Panel */}
      {selectedMonument && (
        <motion.div
          initial={{ y: 300 }}
          animate={{ y: 0 }}
          exit={{ y: 300 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="absolute bottom-20 left-4 right-4 z-30"
        >
          <Card className="shadow-2xl">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-bold text-black mb-1">{selectedMonument.name}</h3>
                  <p className="text-sm text-gray-600 mb-1">{selectedMonument.type}</p>
                  <p className="text-sm text-gray-600 mb-2">{selectedMonument.culture} • {selectedMonument.period}</p>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {selectedMonument.distance}m
                    </div>
                    {visitedMonuments.has(selectedMonument.id) && (
                      <Badge className="bg-green-100 text-green-700">
                        Visitado
                      </Badge>
                    )}
                    {!selectedMonument.discovered && (
                      <Badge className="bg-gray-100 text-gray-700">
                        <Lock className="w-3 h-3 mr-1" />
                        Oculto
                      </Badge>
                    )}
                  </div>
                </div>
                
                <button
                  onClick={() => setSelectedMonument(null)}
                  className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center"
                >
                  ×
                </button>
              </div>

              <div className="flex space-x-2">
                {selectedMonument.distance <= 1000 && selectedMonument.discovered ? (
                  <Button
                    onClick={handleARView}
                    className="flex-1 bg-[#FF6600] hover:bg-[#E55A00] text-white"
                    style={{ backgroundColor: '#FF6600' }}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Ver en RA
                  </Button>
                ) : (
                  <Button
                    disabled
                    className="flex-1 bg-gray-300 text-gray-500 cursor-not-allowed"
                  >
                    {!selectedMonument.discovered ? (
                      <>
                        <Lock className="w-4 h-4 mr-2" />
                        No Descubierto
                      </>
                    ) : (
                      <>
                        <MapPin className="w-4 h-4 mr-2" />
                        Muy Lejos
                      </>
                    )}
                  </Button>
                )}
                
                <Button variant="outline" className="px-4">
                  <Navigation className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Legend */}
      <div className="absolute top-20 left-4 z-10">
        <Card className="bg-white/90 backdrop-blur-sm">
          <CardContent className="p-3">
            <div className="space-y-2 text-xs">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-[#FF6600] rounded-full" />
                <span>Disponible</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full" />
                <span>Visitado</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full" />
                <span>Muy lejos</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-gray-400 rounded-full" />
                <span>Oculto</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}