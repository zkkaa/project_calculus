'use client'

import { motion } from 'framer-motion'
import Button from '@/components/ui/Button'

interface SurrenderConfirmProps {
  onConfirm: () => void
  onCancel: () => void
}

export default function SurrenderConfirm({ onConfirm, onCancel }: SurrenderConfirmProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 flex items-center justify-center z-40 bg-black/40 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.85, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-sm mx-4 flex flex-col items-center gap-5"
      >
        <div className="text-5xl">🏳️</div>

        <div className="text-center">
          <p className="text-xl font-bold text-gray-800 mb-1">Menyerah?</p>
          <p className="text-sm text-gray-500">
            Kalau kamu menyerah, lawan otomatis jadi pemenang. Yakin ingin keluar?
          </p>
        </div>

        <div className="flex gap-3 w-full">
          <Button
            variant="secondary"
            onClick={onCancel}
            className="flex-1"
          >
            Lanjut Main
          </Button>
          <Button
            variant="danger"
            onClick={onConfirm}
            className="flex-1"
          >
            Ya, Menyerah
          </Button>
        </div>
      </motion.div>
    </motion.div>
  )
}