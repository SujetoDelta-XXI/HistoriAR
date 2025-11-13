import { useState, useEffect } from 'react'
import { motion } from 'motion/react'
import { Button } from './ui/button'
import { Card, CardContent } from './ui/card'
import { Badge } from './ui/badge'
import { ArrowLeft, RotateCcw, ZoomIn, ZoomOut, Info, Maximize, Settings, Download, Share, Heart } from 'lucide-react'

interface ARViewerScreenProps {
  monument: any
  onBack: () => void
  onMarkAsVisited?: (monumentId: number) => void
  isFromTour?: boolean
}

export function ARViewerScreen({ monument, onBack, onMarkAsVisited, isFromTour = false }: ARViewerScreenProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [showInfo, setShowInfo] = useState(false)
  const [zoom, setZoom] = useState(1)
  const [rotation, setRotation] = useState({ x: 0, y: 0, z: 0 })
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [isLiked, setIsLiked] = useState(false)

  useEffect(() => {
    // Simular carga de modelo AR
    const timer = setTimeout(() => {
      setIsLoading(false)
      // Auto-marcar como visitado si no es del tour
      if (!isFromTour && onMarkAsVisited) {
        onMarkAsVisited(monument.id)
      }
    }, 2500)

    return () => clearTimeout(timer)
  }, [monument.id, isFromTour, onMarkAsVisited])

  const handleRotateX = () => {
    setRotation(prev => ({ ...prev, x: prev.x + 90 }))
  }

  const handleRotateY = () => {
    setRotation(prev => ({ ...prev, y: prev.y + 90 }))
  }

  const handleRotateZ = () => {
    setRotation(prev => ({ ...prev, z: prev.z + 90 }))
  }

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.2, 3))
  }

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.2, 0.3))
  }

  const handleReset = () => {
    setZoom(1)
    setRotation({ x: 0, y: 0, z: 0 })
    setPosition({ x: 0, y: 0 })
  }

  const handle360Rotation = () => {
    // Animación automática de 360°
    setRotation(prev => ({ ...prev, y: prev.y + 360 }))
  }

  const modelInfo = {
    triangles: "25,420",
    vertices: "12,710",
    fileSize: "8.2 MB",
    quality: "Alta resolución",
    scanDate: "15 Ene 2024",
    scanMethod: "Fotogrametría + LiDAR"
  }

  return (
    <div className="h-screen bg-black relative overflow-hidden">
      {/* AR Environment */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-gray-800 to-black">
        {/* AR Grid Background */}
        <div className="absolute inset-0 opacity-10">
          <div className="grid grid-cols-12 grid-rows-16 h-full w-full">
            {Array.from({ length: 192 }).map((_, i) => (
              <div key={i} className="border border-[#FF6600]/20" />
            ))}
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 flex items-center justify-center z-20"
          >
            <div className="text-center text-white">
              <motion.div
                animate={{ 
                  rotateY: 360,
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  rotateY: { duration: 2, repeat: Infinity, ease: "linear" },
                  scale: { duration: 1.5, repeat: Infinity }
                }}
                className="w-24 h-24 mx-auto mb-6 relative"
              >
                <div className="w-full h-full border-4 border-[#FF6600] border-t-transparent rounded-lg" />
                <div className="absolute inset-2 border-2 border-white/30 rounded" />
              </motion.div>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-xl mb-2"
              >
                Cargando modelo 3D
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="text-sm text-gray-300"
              >
                {monument.name}
              </motion.p>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ delay: 1.5, duration: 1 }}
                className="mt-4 h-1 bg-[#FF6600] rounded-full w-32 mx-auto"
              />
            </div>
          </motion.div>
        )}

        {/* 3D Model */}
        {!isLoading && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ 
              opacity: 1, 
              scale: zoom,
              rotateX: rotation.x,
              rotateY: rotation.y,
              rotateZ: rotation.z,
              x: position.x,
              y: position.y
            }}
            transition={{ 
              type: "spring",
              damping: 20,
              stiffness: 100
            }}
            className="absolute inset-0 flex items-center justify-center cursor-move"
            onMouseDown={() => setIsDragging(true)}
            onMouseUp={() => setIsDragging(false)}
            onMouseLeave={() => setIsDragging(false)}
          >
            {/* Modelo 3D Simulado */}
            <div className="relative group">
              <motion.div
                animate={{ 
                  rotateY: [0, 5, -5, 0],
                  rotateX: [0, 2, -2, 0]
                }}
                transition={{ 
                  duration: 6, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
                className="w-80 h-80 relative"
                style={{ 
                  transform: `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) rotateZ(${rotation.z}deg)`,
                  transformStyle: 'preserve-3d'
                }}
              >
                {/* Base de la huaca */}
                <div className="absolute inset-0 bg-gradient-to-b from-yellow-600 via-orange-600 to-red-700 rounded-lg shadow-2xl"
                     style={{ transform: 'translateZ(-20px)' }}>
                  <div className="absolute inset-4 bg-gradient-to-t from-gray-800 to-gray-600 rounded transform rotate-2" />
                  <div className="absolute inset-8 bg-gradient-to-br from-yellow-500 to-orange-600 rounded transform -rotate-1" />
                </div>

                {/* Estructura superior */}
                <div className="absolute top-1/4 left-1/4 right-1/4 bottom-1/4 bg-gradient-to-t from-orange-700 to-yellow-500 rounded-t-full shadow-inner"
                     style={{ transform: 'translateZ(20px)' }}>
                  <div className="absolute top-2 left-2 right-2 bottom-2 bg-gradient-to-b from-yellow-400 to-orange-500 rounded-t-full" />
                </div>

                {/* Detalles arquitectónicos */}
                <div className="absolute top-1/3 left-1/3 right-1/3 h-4 bg-white/20 rounded-full shadow-lg"
                     style={{ transform: 'translateZ(25px)' }} />
                <div className="absolute bottom-1/3 left-1/4 right-1/4 h-2 bg-gray-700 rounded"
                     style={{ transform: 'translateZ(15px)' }} />

                {/* Efectos de luz */}
                <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black/20 rounded-lg" />
                
                {/* Partículas AR */}
                {Array.from({ length: 8 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-[#FF6600] rounded-full"
                    animate={{
                      x: [0, Math.cos(i * 45 * Math.PI / 180) * 150],
                      y: [0, Math.sin(i * 45 * Math.PI / 180) * 150],
                      opacity: [0, 1, 0]
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      delay: i * 0.2,
                      ease: "easeOut"
                    }}
                    style={{
                      left: '50%',
                      top: '50%',
                      transform: 'translate(-50%, -50%)'
                    }}
                  />
                ))}
              </motion.div>

              {/* Información flotante */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5 }}
                className="absolute -bottom-20 left-1/2 transform -translate-x-1/2 bg-black/80 backdrop-blur-sm rounded-lg px-6 py-3 min-w-max border border-[#FF6600]/30"
              >
                <p className="text-white font-bold text-lg">{monument.name}</p>
                <p className="text-[#FF6600] text-sm">{monument.culture} • {monument.period}</p>
                {!isFromTour && (
                  <Badge className="mt-2 bg-green-500 text-white">
                    ¡Primera visita!
                  </Badge>
                )}
              </motion.div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Header Controls */}
      <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between safe-area-pt z-30">
        <button
          onClick={onBack}
          className="w-12 h-12 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20"
        >
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>

        <div className="flex items-center space-x-2">
          <Badge className={`${isFromTour ? 'bg-purple-500' : 'bg-green-500'} text-white`}>
            {isFromTour ? 'Tour' : 'En Vivo'}
          </Badge>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsLiked(!isLiked)}
            className={`w-12 h-12 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20 ${
              isLiked ? 'bg-red-500' : 'bg-black/50'
            }`}
          >
            <Heart className={`w-5 h-5 ${isLiked ? 'text-white fill-current' : 'text-white'}`} />
          </button>
          <button className="w-12 h-12 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20">
            <Share className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      {/* Bottom Controls */}
      {!isLoading && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="absolute bottom-0 left-0 right-0 p-4 safe-area-pb z-30"
        >
          {/* Main Control Panel */}
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Button
              onClick={handleRotateY}
              className="w-16 h-16 bg-[#FF6600] hover:bg-[#E55A00] rounded-full shadow-lg"
              style={{ backgroundColor: '#FF6600' }}
            >
              <RotateCcw className="w-6 h-6 text-white" />
            </Button>

            <Button
              onClick={handleZoomOut}
              className="w-16 h-16 bg-[#FF6600] hover:bg-[#E55A00] rounded-full shadow-lg"
              style={{ backgroundColor: '#FF6600' }}
            >
              <ZoomOut className="w-6 h-6 text-white" />
            </Button>

            <Button
              onClick={handle360Rotation}
              className="w-20 h-20 bg-white hover:bg-gray-100 rounded-full shadow-xl text-black font-bold"
            >
              360°
            </Button>

            <Button
              onClick={handleZoomIn}
              className="w-16 h-16 bg-[#FF6600] hover:bg-[#E55A00] rounded-full shadow-lg"
              style={{ backgroundColor: '#FF6600' }}
            >
              <ZoomIn className="w-6 h-6 text-white" />
            </Button>

            <Button
              onClick={() => setShowInfo(!showInfo)}
              className={`w-16 h-16 rounded-full shadow-lg transition-colors ${
                showInfo ? 'bg-white text-[#FF6600]' : 'bg-[#FF6600] text-white hover:bg-[#E55A00]'
              }`}
              style={!showInfo ? { backgroundColor: '#FF6600' } : {}}
            >
              <Info className="w-6 h-6" />
            </Button>
          </div>

          {/* Secondary Controls */}
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Button
              onClick={handleRotateX}
              variant="outline"
              size="sm"
              className="bg-black/30 backdrop-blur-sm border-white/30 text-white hover:bg-black/50"
            >
              ↕️ X
            </Button>
            <Button
              onClick={handleRotateZ}
              variant="outline"
              size="sm"
              className="bg-black/30 backdrop-blur-sm border-white/30 text-white hover:bg-black/50"
            >
              🔄 Z
            </Button>
            <Button
              onClick={handleReset}
              variant="outline"
              size="sm"
              className="bg-black/30 backdrop-blur-sm border-white/30 text-white hover:bg-black/50"
            >
              Reset
            </Button>
          </div>

          {/* Info Panel */}
          {showInfo && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="bg-black/80 backdrop-blur-sm border-[#FF6600]/30">
                <CardContent className="p-4">
                  <h3 className="text-white font-bold mb-3">{monument.name}</h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-gray-400">Tipo</p>
                      <p className="text-white">{monument.type}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Cultura</p>
                      <p className="text-white">{monument.culture}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Período</p>
                      <p className="text-white">{monument.period}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Distrito</p>
                      <p className="text-white">{monument.district}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Triángulos</p>
                      <p className="text-white">{modelInfo.triangles}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Vértices</p>
                      <p className="text-white">{modelInfo.vertices}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Tamaño</p>
                      <p className="text-white">{modelInfo.fileSize}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Calidad</p>
                      <p className="text-white">{modelInfo.quality}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-700">
                    <div className="text-xs text-gray-400">
                      Zoom: {(zoom * 100).toFixed(0)}% | Rotación: Y{rotation.y}°
                    </div>
                    <Button
                      size="sm"
                      className="bg-[#FF6600] hover:bg-[#E55A00] text-white"
                      style={{ backgroundColor: '#FF6600' }}
                    >
                      <Download className="w-4 h-4 mr-1" />
                      Guardar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Instructions */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2, duration: 1 }}
            className="text-center mt-4"
          >
            <p className="text-white/60 text-sm">
              Usa los controles para girar, ampliar o ver información del modelo 3D
            </p>
          </motion.div>
        </motion.div>
      )}

      {/* AR Tracking Indicators */}
      {!isLoading && (
        <>
          <motion.div
            animate={{ 
              scale: [1, 1.3, 1],
              opacity: [0.7, 1, 0.7]
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute top-1/4 left-8 w-2 h-2 bg-[#FF6600] rounded-full"
          />
          <motion.div
            animate={{ 
              scale: [1, 1.3, 1],
              opacity: [0.7, 1, 0.7]
            }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.7 }}
            className="absolute top-1/3 right-12 w-2 h-2 bg-[#FF6600] rounded-full"
          />
          <motion.div
            animate={{ 
              scale: [1, 1.3, 1],
              opacity: [0.7, 1, 0.7]
            }}
            transition={{ duration: 2, repeat: Infinity, delay: 1.4 }}
            className="absolute bottom-1/3 left-16 w-2 h-2 bg-[#FF6600] rounded-full"
          />
        </>
      )}
    </div>
  )
}