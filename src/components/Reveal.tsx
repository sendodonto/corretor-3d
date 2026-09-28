'use client'

import { motion, useReducedMotion } from 'motion/react'
import type { ReactNode } from 'react'

/** Entrada sutil ao rolar: sobe 16 px e aparece. Uma vez só. */
export function Reveal({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  const reduzir = useReducedMotion()
  return (
    <motion.div
      className={className}
      initial={reduzir ? { opacity: 0 } : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -8% 0px' }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}
