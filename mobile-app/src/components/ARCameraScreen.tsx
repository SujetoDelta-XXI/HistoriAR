import { useState, useEffect } from 'react'
import { motion } from 'motion/react'
import { Button } from './ui/button'
import { ArrowLeft, RotateCcw, ZoomIn, ZoomOut, Info, Maximize, Settings } from 'lucide-react'
import { Card, CardContent } from './ui/card'

interface ARCameraScreenProps {
  huaca: any
  onBack: () => void
}

export function ARCameraScreen({ huaca, onBack }: ARCameraScreenProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [showInfo, setShowInfo] = useState(false)
  const [zoom, setZoom] = useState(1)
  const [rotation, setRotation] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)

  useEffect(() => {
    // Simular carga de RA
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  const handleRotate = () => {
    setRotation(prev => prev + 90)
  }

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.2, 3))
  }

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.2, 0.5))
  }

  return (
    <div className="h-screen bg-black relative overflow-hidden">
      {/* Camera View */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-800 to-gray-900">
        {/* Simulated camera background */}
        <div className="w-full h-full bg-gradient-radial from-gray-600 to-gray-900 relative">
          {/* Grid overlay to simulate AR tracking */}
          <div className="absolute inset-0 opacity-20">
            <div className="grid grid-cols-8 grid-rows-12 h-full w-full">
              {Array.from({ length: 96 }).map((_, i) => (
                <div key={i} className="border border-[#FF6600]/30" />
              ))}
            </div>
          </div>

          {/* AR Loading Animation */}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="text-center text-white">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="w-16 h-16 border-4 border-[#FF6600] border-t-transparent rounded-full mx-auto mb-4"
                />
                <p className="text-lg mb-2">Iniciando Realidad Aumentada</p>
                <p className="text-sm text-gray-300">Apunta tu cámara hacia el sitio arqueológico</p>
              </div>
            </motion.div>
          )}

          {/* AR Content */}
          {!isLoading && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ 
                opacity: 1, 
                scale: zoom,
                rotate: rotation
              }}
              transition={{ duration: 0.8 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              {/* 3D Model Placeholder */}
              <div className="relative">
                <motion.div
                  animate={{ rotateY: 360 }}
                  transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                  className="w-64 h-64 bg-gradient-to-br from-[#FF6600] to-yellow-500 rounded-lg shadow-2xl relative overflow-hidden"
                >
                  {/* Simulated 3D structure */}
                  <div className="absolute inset-4 bg-gradient-to-t from-gray-700 to-gray-500 rounded transform -skew-y-12" />
                  <div className="absolute inset-8 bg-gradient-to-b from-yellow-600 to-orange-700 rounded transform skew-x-12" />
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white rounded-full opacity-80" />
                </motion.div>

                {/* AR Markers */}
                <div className="absolute -top-2 -left-2 w-4 h-4 border-l-4 border-t-4 border-[#FF6600]" />
                <div className="absolute -top-2 -right-2 w-4 h-4 border-r-4 border-t-4 border-[#FF6600]" />
                <div className="absolute -bottom-2 -left-2 w-4 h-4 border-l-4 border-b-4 border-[#FF6600]" />
                <div className="absolute -bottom-2 -right-2 w-4 h-4 border-r-4 border-b-4 border-[#FF6600]" />

                {/* Info Label */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1, duration: 0.6 }}
                  className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 bg-black/80 backdrop-blur-sm rounded-lg px-4 py-2 min-w-max"
                >
                  <p className="text-white font-medium">{huaca.name}</p>
                  <p className="text-[#FF6600] text-sm">{huaca.period}</p>
                </motion.div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Header Controls */}
      <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between safe-area-pt z-10">
        <button
          onClick={onBack}
          className="w-12 h-12 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center"
        >
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="w-12 h-12 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center"
          >
            <Maximize className="w-5 h-5 text-white" />
          </button>
          <button className="w-12 h-12 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center">
            <Settings className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      {/* Bottom Controls */}
      {!isLoading && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="absolute bottom-0 left-0 right-0 p-4 safe-area-pb"
        >
          {/* Control Panel */}
          <div className="flex items-center justify-center space-x-4 mb-4">
            <button
              onClick={handleRotate}
              className="w-14 h-14 bg-[#FF6600] rounded-full flex items-center justify-center shadow-lg"
            >
              <RotateCcw className="w-6 h-6 text-white" />
            </button>

            <button
              onClick={handleZoomOut}
              className="w-14 h-14 bg-[#FF6600] rounded-full flex items-center justify-center shadow-lg"
            >
              <ZoomOut className="w-6 h-6 text-white" />
            </button>

            <button
              onClick={handleZoomIn}
              className="w-14 h-14 bg-[#FF6600] rounded-full flex items-center justify-center shadow-lg"
            >
              <ZoomIn className="w-6 h-6 text-white" />
            </button>

            <button
              onClick={() => setShowInfo(!showInfo)}
              className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-colors ${
                showInfo ? 'bg-white text-[#FF6600]' : 'bg-[#FF6600] text-white'
              }`}
            >
              <Info className="w-6 h-6" />
            </button>
          </div>

          {/* Info Panel */}
          {showInfo && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="bg-black/80 backdrop-blur-sm border-gray-600">
                <CardContent className="p-4">
                  <h3 className="text-white font-bold mb-2">{huaca.name}</h3>
                  <p className="text-gray-300 text-sm mb-2">{huaca.description}</p>
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span>Zoom: {(zoom * 100).toFixed(0)}%</span>
                    <span>Rotación: {rotation}°</span>
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
            <p className="text-white/70 text-sm">
              Toca los controles para rotar, ampliar o ver información
            </p>
          </motion.div>
        </motion.div>
      )}

      {/* AR Tracking Indicators */}
      {!isLoading && (
        <>
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute top-1/4 left-8 w-3 h-3 bg-[#FF6600] rounded-full"
          />
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
            className="absolute top-1/3 right-12 w-3 h-3 bg-[#FF6600] rounded-full"
          />
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity, delay: 1 }}
            className="absolute bottom-1/3 left-16 w-3 h-3 bg-[#FF6600] rounded-full"
          />
        </>
      )}
    </div>
  )
}