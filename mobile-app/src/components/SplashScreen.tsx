import { useEffect } from 'react'
import { motion } from 'motion/react'

interface SplashScreenProps {
  onComplete: () => void
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete()
    }, 3000)

    return () => clearTimeout(timer)
  }, [onComplete])

  return (
    <div className="h-screen bg-white flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5 }}
        className="text-center"
      >
        <div className="w-32 h-32 mx-auto mb-6 bg-black rounded-full flex items-center justify-center">
          <span className="text-white text-4xl font-bold">HA</span>
        </div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="text-3xl font-bold text-black"
        >
          HistoriAR
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 1 }}
          className="text-lg text-gray-600 mt-2"
        >
          Huacas de Santa Anita
        </motion.p>
        <motion.div
          className="w-8 h-8 border-4 border-[#FF6600] border-t-transparent rounded-full animate-spin mx-auto mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 0.5 }}
        />
      </motion.div>
    </div>
  )
}