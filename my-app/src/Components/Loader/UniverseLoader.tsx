// components/UniverseLoader.tsx
import { motion } from 'framer-motion'

export const UniverseLoader = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0C0F3A]">
      {/* Центральная сфера */}
      <motion.div
        className="w-20 h-20 rounded-full bg-gradient-to-br from-[#00C2D1] to-[#CE67D3] shadow-[0_0_40px_10px_rgba(0,194,209,0.3)]"
        animate={{
          scale: [1, 1.2, 1],
          boxShadow: [
            '0 0 20px 5px rgba(0, 194, 209, 0.3)',
            '0 0 40px 20px rgba(206, 103, 211, 0.4)',
            '0 0 20px 5px rgba(0, 194, 209, 0.3)'
          ]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      />
      
      {/* Орбитальные частицы */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-4 h-4 rounded-full bg-[#00FFF7]"
          initial={{ opacity: 0 }}
          animate={{
            opacity: [0, 1, 0],
            x: 100 * Math.cos((i * 45 * Math.PI) / 180),
            y: 100 * Math.sin((i * 45 * Math.PI) / 180),
            scale: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 1,
            delay: i * 0.1,
            repeat: Infinity,
            repeatDelay: 0.5,
            ease: 'easeInOut'
          }}
        />
      ))}
      
      {/* Текст */}
      <motion.div
        className="absolute mt-40 text-[#00FFF7] text-xl font-medium"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1, repeat: Infinity }}
      >
        Загрузка...
      </motion.div>
    </div>
  )
}