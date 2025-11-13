import { useState } from 'react'
import { motion } from 'motion/react'
import { Card, CardContent } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Input } from './ui/input'
import { Search, Eye, Calendar, Trophy, Filter, Grid, List, BookOpen, PlayCircle } from 'lucide-react'
import { ImageWithFallback } from './figma/ImageWithFallback'

interface MyTourScreenProps {
  visitedMonuments: Set<number>
  onMonumentSelect: (monument: any) => void
  onQuizStart: (monument: any) => void
}

export function MyTourScreen({ visitedMonuments, onMonumentSelect, onQuizStart }: MyTourScreenProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('recent')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const allMonuments = [
    {
      id: 1,
      name: "Huaca Pucllana",
      type: "Huaca Arqueológica",
      culture: "Cultura Lima",
      period: "200-700 d.C.",
      visitDate: "2024-01-15",
      image: "https://images.unsplash.com/photo-1640303037628-9d9286f3a051?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxIdWFjYSUyMFB1Y2xsYW5hJTIwTGltYSUyMFBlcnV8ZW58MXx8fHwxNzU5MDMyNDM3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      arScans: 8,
      discoveries: 5,
      rarity: "legendary",
      description: "Pirámide trunca de adobe construida por la cultura Lima, centro ceremonial y administrativo",
      district: "Miraflores",
      quizCompleted: true,
      quizScore: 92
    },
    {
      id: 2,
      name: "Huaca Huallamarca",
      type: "Huaca Arqueológica",
      culture: "Cultura Lima",
      period: "200-650 d.C.",
      visitDate: "2024-01-10",
      image: "https://images.unsplash.com/photo-1649643646365-35e8ddb2d146?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxIdWFjYSUyMEh1YWxsYW1hcmNhJTIwTGltYSUyMGFuY2llbnR8ZW58MXx8fHwxNzU5MDMyNDM4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      arScans: 6,
      discoveries: 4,
      rarity: "epic",
      description: "También conocida como Pan de Azúcar, centro ceremonial de la cultura Lima",
      district: "San Isidro",
      quizCompleted: true,
      quizScore: 88
    },
    {
      id: 5,
      name: "Huaca Mateo Salado",
      type: "Huaca Arqueológica",
      culture: "Cultura Ichma-Inca",
      period: "1100-1532 d.C.",
      visitDate: "2024-01-08",
      image: "https://images.unsplash.com/photo-1508485847222-cea28aac0589?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxIdWFjYSUyME1hdGVvJTIwU2FsYWRvJTIwTGltYXxlbnwxfHx8fDE3NTkwMzI0Mzh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      arScans: 4,
      discoveries: 3,
      rarity: "rare",
      description: "Complejo de pirámides de adobe, centro administrativo y ceremonial prehispánico",
      district: "Pueblo Libre",
      quizCompleted: false,
      quizScore: 0
    },
    {
      id: 6,
      name: "Huaca San Marcos",
      type: "Huaca Arqueológica",
      culture: "Cultura Lima-Ichma",
      period: "200-1470 d.C.",
      visitDate: "2024-01-12",
      image: "https://images.unsplash.com/photo-1669075226810-3d3eaa459949?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxIdWFjYSUyMFNhbiUyME1hcmNvcyUyMExpbWElMjBhcmNoYWVvbG9naWNhbHxlbnwxfHx8fDE3NTkwMzI0Mzl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      arScans: 5,
      discoveries: 2,
      rarity: "epic",
      description: "Sitio arqueológico ubicado en Ciudad Universitaria, centro ceremonial milenario",
      district: "Lima",
      quizCompleted: true,
      quizScore: 76
    }
  ]

  const myMonuments = allMonuments.filter(monument => visitedMonuments.has(monument.id))

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'bg-[#FF6600] text-white'
      case 'epic': return 'bg-purple-500 text-white'
      case 'rare': return 'bg-blue-500 text-white'
      case 'common': return 'bg-gray-400 text-white'
      default: return 'bg-gray-400 text-white'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Huaca Arqueológica': return 'bg-amber-600 text-white'
      case 'Sitio Arqueológico': return 'bg-amber-500 text-white'
      case 'Plaza Histórica': return 'bg-green-500 text-white'
      case 'Edificio Religioso': return 'bg-blue-500 text-white'
      case 'Edificio Gubernamental': return 'bg-red-500 text-white'
      default: return 'bg-gray-500 text-white'
    }
  }

  const sortedMonuments = [...myMonuments].sort((a, b) => {
    switch (sortBy) {
      case 'recent':
        return new Date(b.visitDate).getTime() - new Date(a.visitDate).getTime()
      case 'name':
        return a.name.localeCompare(b.name)
      case 'type':
        return a.type.localeCompare(b.type)
      case 'district':
        return a.district.localeCompare(b.district)
      case 'rarity':
        const rarityOrder = { legendary: 4, epic: 3, rare: 2, common: 1 }
        return (rarityOrder[b.rarity as keyof typeof rarityOrder] || 1) - (rarityOrder[a.rarity as keyof typeof rarityOrder] || 1)
      default:
        return 0
    }
  })

  const filteredMonuments = sortedMonuments.filter(monument =>
    monument.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    monument.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    monument.district.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  const totalStats = {
    totalMonuments: myMonuments.length,
    totalScans: myMonuments.reduce((sum, monument) => sum + monument.arScans, 0),
    totalDiscoveries: myMonuments.reduce((sum, monument) => sum + monument.discoveries, 0),
    completedQuizzes: myMonuments.filter(m => m.quizCompleted).length,
    averageQuizScore: myMonuments.filter(m => m.quizCompleted).length > 0 
      ? Math.round(myMonuments.filter(m => m.quizCompleted).reduce((sum, m) => sum + m.quizScore, 0) / myMonuments.filter(m => m.quizCompleted).length)
      : 0
  }

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header */}
      <div className="px-4 pt-12 pb-6 bg-white border-b border-gray-100">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-2xl font-bold text-black mb-2">Mi Tour</h1>
          <p className="text-gray-600">Tu colección personal de huacas de Lima</p>
        </motion.div>
      </div>

      {/* Content */}
      <div className="flex-1 pb-20 overflow-auto">
        {myMonuments.length === 0 ? (
          /* Empty State */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center justify-center h-full px-4"
          >
            <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <Trophy className="w-16 h-16 text-gray-400" />
            </div>
            <h2 className="text-xl font-bold text-black mb-2">Tu tour está vacío</h2>
            <p className="text-gray-600 text-center mb-6">
              Visita huacas en el mapa para comenzar tu colección personal
            </p>
            <Button className="bg-[#FF6600] hover:bg-[#E55A00] text-white" style={{ backgroundColor: '#FF6600' }}>
              Explorar Huacas
            </Button>
          </motion.div>
        ) : (
          <div className="px-4 py-4 space-y-6">
            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="grid grid-cols-2 gap-3"
            >
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold text-[#FF6600]">{totalStats.totalMonuments}</p>
                  <p className="text-xs text-gray-600">Huacas Visitadas</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold text-[#FF6600]">{totalStats.totalScans}</p>
                  <p className="text-xs text-gray-600">Escaneos AR</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold text-[#FF6600]">{totalStats.completedQuizzes}</p>
                  <p className="text-xs text-gray-600">Quizzes Completados</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold text-[#FF6600]">{totalStats.averageQuizScore}%</p>
                  <p className="text-xs text-gray-600">Promedio Quiz</p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Search and Filters */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="space-y-4"
            >
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Buscar en tu tour..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="flex items-center justify-between">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
                >
                  <option value="recent">Más recientes</option>
                  <option value="name">Por nombre</option>
                  <option value="type">Por tipo</option>
                  <option value="district">Por distrito</option>
                  <option value="rarity">Por rareza</option>
                </select>

                <div className="flex items-center space-x-2">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className={viewMode === 'grid' ? 'bg-[#FF6600] hover:bg-[#E55A00]' : ''}
                    style={viewMode === 'grid' ? { backgroundColor: '#FF6600' } : {}}
                  >
                    <Grid className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className={viewMode === 'list' ? 'bg-[#FF6600] hover:bg-[#E55A00]' : ''}
                    style={viewMode === 'list' ? { backgroundColor: '#FF6600' } : {}}
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </motion.div>

            {/* Monuments Collection */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 gap-4">
                  {filteredMonuments.map((monument, index) => (
                    <motion.div
                      key={monument.id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.6 + index * 0.1, duration: 0.6 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Card className="cursor-pointer hover:shadow-lg transition-all duration-300">
                        <CardContent className="p-0">
                          <div className="relative">
                            <div className="aspect-video bg-gray-200 rounded-t-lg overflow-hidden">
                              <ImageWithFallback
                                src={monument.image}
                                alt={monument.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            
                            <div className="absolute top-2 left-2">
                              <Badge className={`${getTypeColor(monument.type)} text-xs`}>
                                {monument.type}
                              </Badge>
                            </div>

                            <div className="absolute top-2 right-2">
                              <Badge className={`${getRarityColor(monument.rarity)} text-xs`}>
                                {monument.rarity}
                              </Badge>
                            </div>

                            <div className="absolute bottom-2 left-2">
                              <Badge className="bg-black/70 text-white text-xs">
                                <Calendar className="w-3 h-3 mr-1" />
                                {formatDate(monument.visitDate)}
                              </Badge>
                            </div>

                            {monument.quizCompleted && (
                              <div className="absolute bottom-2 right-2">
                                <Badge className="bg-green-500 text-white text-xs">
                                  <Trophy className="w-3 h-3 mr-1" />
                                  {monument.quizScore}%
                                </Badge>
                              </div>
                            )}
                          </div>

                          <div className="p-4">
                            <h3 className="font-bold text-black mb-1">{monument.name}</h3>
                            <p className="text-sm text-gray-600 mb-2">{monument.district} • {monument.period}</p>
                            <p className="text-xs text-gray-500 mb-3 line-clamp-2">{monument.description}</p>
                            
                            <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                              <span>{monument.arScans} scans</span>
                              <span>{monument.discoveries} descubrimientos</span>
                            </div>

                            <div className="flex space-x-2">
                              <Button
                                onClick={() => onMonumentSelect(monument)}
                                className="flex-1 bg-[#FF6600] hover:bg-[#E55A00] text-white text-xs"
                                style={{ backgroundColor: '#FF6600' }}
                              >
                                <Eye className="w-3 h-3 mr-1" />
                                Ver en RA
                              </Button>
                              
                              <Button
                                onClick={() => onQuizStart(monument)}
                                variant="outline"
                                className="flex-1 border-[#FF6600] text-[#FF6600] hover:bg-[#FF6600] hover:text-white text-xs"
                              >
                                {monument.quizCompleted ? (
                                  <>
                                    <BookOpen className="w-3 h-3 mr-1" />
                                    Repetir
                                  </>
                                ) : (
                                  <>
                                    <PlayCircle className="w-3 h-3 mr-1" />
                                    Quiz
                                  </>
                                )}
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredMonuments.map((monument, index) => (
                    <motion.div
                      key={monument.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + index * 0.1, duration: 0.6 }}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      <Card className="cursor-pointer hover:shadow-md transition-all duration-300">
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-4">
                            <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                              <ImageWithFallback
                                src={monument.image}
                                alt={monument.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between mb-1">
                                <h3 className="font-bold text-black truncate">{monument.name}</h3>
                                <div className="flex space-x-1 ml-2">
                                  <Badge className={`${getTypeColor(monument.type)} text-xs`}>
                                    {monument.type}
                                  </Badge>
                                  {monument.quizCompleted && (
                                    <Badge className="bg-green-500 text-white text-xs">
                                      {monument.quizScore}%
                                    </Badge>
                                  )}
                                </div>
                              </div>
                              
                              <p className="text-sm text-gray-600 mb-2">{monument.district} • {monument.period}</p>
                              
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3 text-xs text-gray-500">
                                  <span>{monument.arScans} scans</span>
                                  <span>{monument.discoveries} descubrimientos</span>
                                  <Badge variant="outline" className="text-xs">
                                    <Calendar className="w-3 h-3 mr-1" />
                                    {formatDate(monument.visitDate)}
                                  </Badge>
                                </div>
                                
                                <div className="flex space-x-2">
                                  <Button
                                    onClick={() => onMonumentSelect(monument)}
                                    size="sm"
                                    className="bg-[#FF6600] hover:bg-[#E55A00] text-white"
                                    style={{ backgroundColor: '#FF6600' }}
                                  >
                                    <Eye className="w-4 h-4 mr-1" />
                                    RA
                                  </Button>
                                  <Button
                                    onClick={() => onQuizStart(monument)}
                                    size="sm"
                                    variant="outline"
                                    className="border-[#FF6600] text-[#FF6600] hover:bg-[#FF6600] hover:text-white"
                                  >
                                    {monument.quizCompleted ? (
                                      <BookOpen className="w-4 h-4" />
                                    ) : (
                                      <PlayCircle className="w-4 h-4" />
                                    )}
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>

            {filteredMonuments.length === 0 && searchQuery && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="text-center py-12"
              >
                <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron resultados</h3>
                <p className="text-gray-500">Intenta con otros términos de búsqueda</p>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}