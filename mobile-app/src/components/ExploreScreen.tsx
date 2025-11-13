import { useState } from 'react'
import { motion } from 'motion/react'
import { Card, CardContent } from './ui/card'
import { Input } from './ui/input'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { Search, MapPin, Clock, Users, Filter } from 'lucide-react'
import { ImageWithFallback } from './figma/ImageWithFallback'

interface ExploreScreenProps {
  onNavigate: (screen: string, data?: any) => void
}

export function ExploreScreen({ onNavigate }: ExploreScreenProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('all')

  const huacas = [
    {
      id: 1,
      name: "Huaca Puruchuco",
      description: "Complejo arqueológico del período Inca",
      period: "1100 - 1532 d.C.",
      distance: "0.8 km",
      duration: "45 min",
      visitors: 324,
      difficulty: "Fácil",
      image: "https://images.unsplash.com/photo-1714876906025-77b148689e2c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxMaW1hJTIwUGVydSUyMGNvbG9uaWFsJTIwYXJjaGl0ZWN0dXJlfGVufDF8fHx8MTc1OTAzMTM0M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      isOpen: true
    },
    {
      id: 2,
      name: "Huaca La Palma",
      description: "Sitio ceremonial de la cultura Lima",
      period: "900 - 1200 d.C.",
      distance: "1.2 km",
      duration: "30 min",
      visitors: 156,
      difficulty: "Fácil",
      image: "https://images.unsplash.com/photo-1565719073549-49601e85fe3d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxQYWxhY2lvJTIwVG9ycmUlMjBUYWdsZSUyMExpbWF8ZW58MXx8fHwxNzU5MDMxMzQ3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      isOpen: true
    },
    {
      id: 3,
      name: "Huaca Fortaleza",
      description: "Estructura defensiva precolombina",
      period: "800 - 1000 d.C.",
      distance: "2.1 km",
      duration: "60 min",
      visitors: 89,
      difficulty: "Moderado",
      image: "https://images.unsplash.com/photo-1669462493013-ddd1c85d1c52?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxDYXNhJTIwQWxpYWdhJTIwTGltYSUyMFBlcnV8ZW58MXx8fHwxNzU5MDMxMzU0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      isOpen: false
    },
    {
      id: 4,
      name: "Huaca El Mirador",
      description: "Plataforma ceremonial con vista panorámica",
      period: "1200 - 1470 d.C.",
      distance: "3.4 km",
      duration: "90 min",
      visitors: 67,
      difficulty: "Difícil",
      image: "https://images.unsplash.com/photo-1739162666913-ad7e6cfbb5c1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxHb3Zlcm5tZW50JTIwUGFsYWNlJTIwTGltYSUyMFBlcnV8ZW58MXx8fHwxNzU5MDMxMzU4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      isOpen: true
    }
  ]

  const filters = [
    { id: 'all', label: 'Todas' },
    { id: 'open', label: 'Abiertas' },
    { id: 'nearby', label: 'Cercanas' },
    { id: 'popular', label: 'Populares' }
  ]

  const filteredHuacas = huacas.filter(huaca => {
    const matchesSearch = huaca.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         huaca.description.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesFilter = selectedFilter === 'all' ||
                         (selectedFilter === 'open' && huaca.isOpen) ||
                         (selectedFilter === 'nearby' && parseFloat(huaca.distance) < 2) ||
                         (selectedFilter === 'popular' && huaca.visitors > 150)
    
    return matchesSearch && matchesFilter
  })

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header */}
      <div className="px-4 pt-12 pb-6 bg-white border-b border-gray-100">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-2xl font-bold text-black mb-4">Explorar Huacas</h1>
          
          {/* Search Bar */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Buscar huacas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4"
            />
          </div>

          {/* Filters */}
          <div className="flex items-center space-x-2 overflow-x-auto">
            {filters.map((filter) => (
              <Button
                key={filter.id}
                variant={selectedFilter === filter.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedFilter(filter.id)}
                className={`flex-shrink-0 ${
                  selectedFilter === filter.id 
                    ? 'bg-[#FF6600] hover:bg-[#E55A00] text-white border-[#FF6600]' 
                    : 'text-black hover:bg-gray-50'
                }`}
                style={selectedFilter === filter.id ? { backgroundColor: '#FF6600', borderColor: '#FF6600' } : {}}
              >
                {filter.label}
              </Button>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Content */}
      <div className="flex-1 px-4 py-4 pb-20 overflow-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="space-y-4"
        >
          {filteredHuacas.map((huaca, index) => (
            <motion.div
              key={huaca.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index, duration: 0.6 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card 
                className="cursor-pointer hover:shadow-lg transition-all duration-300"
                onClick={() => onNavigate('detail', huaca)}
              >
                <CardContent className="p-0">
                  <div className="relative">
                    <div className="h-48 bg-gray-200 rounded-t-lg overflow-hidden">
                      <ImageWithFallback
                        src={huaca.image}
                        alt={huaca.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    {/* Status Badge */}
                    <div className="absolute top-3 right-3">
                      <Badge 
                        className={`${
                          huaca.isOpen 
                            ? 'bg-green-500 text-white' 
                            : 'bg-red-500 text-white'
                        }`}
                      >
                        {huaca.isOpen ? 'Abierta' : 'Cerrada'}
                      </Badge>
                    </div>

                    {/* Difficulty Badge */}
                    <div className="absolute top-3 left-3">
                      <Badge variant="secondary">
                        {huaca.difficulty}
                      </Badge>
                    </div>
                  </div>

                  <div className="p-4">
                    <h3 className="text-lg font-bold text-black mb-1">{huaca.name}</h3>
                    <p className="text-gray-600 text-sm mb-3">{huaca.description}</p>
                    <p className="text-xs text-gray-500 mb-3">{huaca.period}</p>

                    <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                      <div className="flex items-center space-x-4">
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
                          {huaca.visitors}
                        </div>
                      </div>
                    </div>

                    <Button 
                      className="w-full bg-[#FF6600] hover:bg-[#E55A00] text-white"
                      style={{ backgroundColor: '#FF6600' }}
                      onClick={(e) => {
                        e.stopPropagation()
                        onNavigate('detail', huaca)
                      }}
                    >
                      Ver más
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {filteredHuacas.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center py-12"
          >
            <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron huacas</h3>
            <p className="text-gray-500">Intenta con otros términos de búsqueda o filtros</p>
          </motion.div>
        )}
      </div>
    </div>
  )
}