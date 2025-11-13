import { motion } from 'motion/react'
import { Card, CardContent } from './ui/card'
import { Badge } from './ui/badge'
import { Progress } from './ui/progress'
import { Trophy, Star, Target, MapPin, Camera, Clock, Award, Medal } from 'lucide-react'

export function GamificationScreen() {
  const userStats = {
    level: 7,
    experience: 2840,
    nextLevelExp: 3000,
    totalPoints: 12450,
    huacasVisited: 8,
    arScans: 23,
    timeSpent: "15.5h"
  }

  const achievements = [
    {
      id: 1,
      name: "Primer Explorador",
      description: "Visita tu primera huaca",
      icon: MapPin,
      earned: true,
      rarity: "common",
      points: 100
    },
    {
      id: 2,
      name: "Fotógrafo AR",
      description: "Captura 10 modelos en realidad aumentada",
      icon: Camera,
      earned: true,
      rarity: "rare",
      points: 250
    },
    {
      id: 3,
      name: "Historiador Dedicado",
      description: "Pasa 10 horas explorando",
      icon: Clock,
      earned: true,
      rarity: "epic",
      points: 500
    },
    {
      id: 4,
      name: "Coleccionista Experto",
      description: "Visita todas las huacas disponibles",
      icon: Trophy,
      earned: false,
      rarity: "legendary",
      points: 1000,
      progress: 8,
      total: 12
    },
    {
      id: 5,
      name: "Maestro AR",
      description: "Escanea 50 objetos con realidad aumentada",
      icon: Target,
      earned: false,
      rarity: "epic",
      points: 750,
      progress: 23,
      total: 50
    },
    {
      id: 6,
      name: "Arqueólogo Virtual",
      description: "Completa todos los tours virtuales",
      icon: Award,
      earned: false,
      rarity: "rare",
      points: 300,
      progress: 2,
      total: 6
    }
  ]

  const leaderboard = [
    { rank: 1, name: "Carlos M.", points: 18750, level: 12 },
    { rank: 2, name: "Ana L.", points: 16240, level: 11 },
    { rank: 3, name: "Diego R.", points: 14830, level: 10 },
    { rank: 4, name: "Tú", points: 12450, level: 7, isUser: true },
    { rank: 5, name: "María S.", points: 11200, level: 8 }
  ]

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-gray-400'
      case 'rare': return 'bg-blue-500'
      case 'epic': return 'bg-purple-500'
      case 'legendary': return 'bg-[#FF6600]'
      default: return 'bg-gray-400'
    }
  }

  const getRarityTextColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'text-gray-600'
      case 'rare': return 'text-blue-600'
      case 'epic': return 'text-purple-600'
      case 'legendary': return 'text-[#FF6600]'
      default: return 'text-gray-600'
    }
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
          <h1 className="text-2xl font-bold text-black mb-2">Gamificación</h1>
          <p className="text-gray-600">Logros y estadísticas</p>
        </motion.div>
      </div>

      {/* Content */}
      <div className="flex-1 px-4 py-4 pb-20 overflow-auto space-y-6">
        {/* User Level & Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="bg-gradient-to-r from-[#FF6600] to-orange-500 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold">Nivel {userStats.level}</h2>
                  <p className="text-orange-100">Explorador Avanzado</p>
                </div>
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                  <Trophy className="w-8 h-8 text-white" />
                </div>
              </div>
              
              <div className="mb-2">
                <div className="flex justify-between text-sm mb-1">
                  <span>Experiencia</span>
                  <span>{userStats.experience}/{userStats.nextLevelExp} XP</span>
                </div>
                <Progress 
                  value={(userStats.experience / userStats.nextLevelExp) * 100} 
                  className="h-2 bg-white/20"
                />
              </div>
              
              <div className="flex justify-between text-sm text-orange-100">
                <span>{userStats.nextLevelExp - userStats.experience} XP para siguiente nivel</span>
                <span>{userStats.totalPoints} puntos totales</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="grid grid-cols-3 gap-3"
        >
          <Card>
            <CardContent className="p-4 text-center">
              <MapPin className="w-6 h-6 mx-auto mb-2 text-[#FF6600]" />
              <p className="text-xl font-bold text-black">{userStats.huacasVisited}</p>
              <p className="text-xs text-gray-600">Huacas Visitadas</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <Camera className="w-6 h-6 mx-auto mb-2 text-[#FF6600]" />
              <p className="text-xl font-bold text-black">{userStats.arScans}</p>
              <p className="text-xs text-gray-600">Escaneos AR</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <Clock className="w-6 h-6 mx-auto mb-2 text-[#FF6600]" />
              <p className="text-xl font-bold text-black">{userStats.timeSpent}</p>
              <p className="text-xs text-gray-600">Tiempo Total</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Achievements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <h2 className="text-lg font-bold text-black mb-4">Logros</h2>
          <div className="space-y-3">
            {achievements.map((achievement, index) => {
              const Icon = achievement.icon
              return (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.1, duration: 0.6 }}
                >
                  <Card className={`${achievement.earned ? 'bg-white' : 'bg-gray-50'} transition-colors hover:shadow-md`}>
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          achievement.earned ? getRarityColor(achievement.rarity) : 'bg-gray-300'
                        }`}>
                          <Icon className={`w-6 h-6 ${achievement.earned ? 'text-white' : 'text-gray-500'}`} />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className={`font-bold ${achievement.earned ? 'text-black' : 'text-gray-500'}`}>
                              {achievement.name}
                            </h3>
                            <div className="flex items-center space-x-2">
                              <Badge 
                                className={`${getRarityColor(achievement.rarity)} text-white text-xs`}
                              >
                                {achievement.rarity}
                              </Badge>
                              {achievement.earned && (
                                <Badge className="bg-green-500 text-white text-xs">
                                  +{achievement.points} XP
                                </Badge>
                              )}
                            </div>
                          </div>
                          
                          <p className={`text-sm mb-2 ${achievement.earned ? 'text-gray-600' : 'text-gray-400'}`}>
                            {achievement.description}
                          </p>
                          
                          {!achievement.earned && achievement.progress !== undefined && (
                            <div className="mb-2">
                              <div className="flex justify-between text-xs text-gray-500 mb-1">
                                <span>Progreso</span>
                                <span>{achievement.progress}/{achievement.total}</span>
                              </div>
                              <Progress 
                                value={(achievement.progress / achievement.total) * 100} 
                                className="h-1.5"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* Leaderboard */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <h2 className="text-lg font-bold text-black mb-4">Tabla de Posiciones</h2>
          <Card>
            <CardContent className="p-0">
              {leaderboard.map((player, index) => (
                <motion.div
                  key={player.rank}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1 + index * 0.1, duration: 0.6 }}
                  className={`flex items-center justify-between p-4 border-b border-gray-100 last:border-b-0 ${
                    player.isUser ? 'bg-[#FF6600]/10' : ''
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                      player.rank === 1 ? 'bg-yellow-500 text-white' :
                      player.rank === 2 ? 'bg-gray-400 text-white' :
                      player.rank === 3 ? 'bg-orange-600 text-white' :
                      player.isUser ? 'bg-[#FF6600] text-white' :
                      'bg-gray-200 text-gray-700'
                    }`}>
                      {player.rank <= 3 ? (
                        player.rank === 1 ? <Trophy className="w-4 h-4" /> :
                        player.rank === 2 ? <Medal className="w-4 h-4" /> :
                        <Award className="w-4 h-4" />
                      ) : (
                        player.rank
                      )}
                    </div>
                    
                    <div>
                      <p className={`font-medium ${player.isUser ? 'text-[#FF6600]' : 'text-black'}`}>
                        {player.name}
                      </p>
                      <p className="text-xs text-gray-500">Nivel {player.level}</p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className={`font-bold ${player.isUser ? 'text-[#FF6600]' : 'text-black'}`}>
                      {player.points.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500">puntos</p>
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}