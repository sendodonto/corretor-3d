'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ChevronLeft, ChevronRight, Images, X } from 'lucide-react'
import type { Foto } from '@/data/imoveis'
import { asset } from '@/lib/base'


/**
 * Galeria em mosaico (1 grande + 4) com lightbox em tela cheia:
 * setas, teclado, arrastar para os lados no celular e contador.
 */
/** Mosaico no desktop: a foto principal ocupa metade; as demais se ajustam à quantidade. */
function mosaico(i: number, n: number) {
  if (i === 0) return n === 1 ? 'md:col-span-4 md:row-span-2' : 'md:col-span-2 md:row-span-2'
  if (n === 2) return 'md:col-span-2 md:row-span-2'
  if (n === 3) return 'md:col-span-2'
  if (n === 4 && i === 1) return 'md:col-span-2'
  return ''
}

export function PropertyGallery({ fotos, titulo }: { fotos: Foto[]; titulo: string }) {
  const [aberta, setAberta] = useState<number | null>(null)
  const visiveis = fotos.slice(0, 5)
  const resto = fotos.length - visiveis.length

  return (
    <>
      <div className="grid gap-2 md:grid-cols-4 md:grid-rows-2 md:[height:min(62vh,600px)]">
        {visiveis.map((f, i) => (
          <button
            key={f.src}
            type="button"
            onClick={() => setAberta(i)}
            className={`group relative overflow-hidden bg-nevoa ${
              i === 0 ? 'aspect-[4/3] rounded-[18px] md:aspect-auto' : 'hidden rounded-[14px] md:block'
            } ${mosaico(i, visiveis.length)}`}
            aria-label={`Abrir foto ${i + 1} de ${fotos.length}: ${f.alt}`}
          >
            <img
              src={asset(i === 0 || visiveis.length < 5 ? f.src : f.mini)}
              alt={f.alt}
              loading={i === 0 ? 'eager' : 'lazy'}
              decoding="async"
              className="size-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.02]"
            />
            {(i === visiveis.length - 1 || i === 0) && (
              <span
                className={`absolute bottom-3 right-3 items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-[13px] font-medium backdrop-blur ${
                  i === 0 ? 'inline-flex md:hidden' : 'hidden md:inline-flex'
                }`}
              >
                <Images size={15} strokeWidth={1.6} aria-hidden />
                {i === 0 ? `${fotos.length} fotos` : resto > 0 ? `+${resto} fotos` : 'Ver todas'}
              </span>
            )}
          </button>
        ))}
      </div>
      <AnimatePresence>
        {aberta !== null && <Lightbox fotos={fotos} inicio={aberta} titulo={titulo} aoFechar={() => setAberta(null)} />}
      </AnimatePresence>
    </>
  )
}

function Lightbox({ fotos, inicio, titulo, aoFechar }: { fotos: Foto[]; inicio: number; titulo: string; aoFechar: () => void }) {
  const [i, setI] = useState(inicio)
  const [direcao, setDirecao] = useState(0)
  const toque = useRef<number | null>(null)
  const ir = useCallback(
    (d: number) => {
      setDirecao(d)
      setI((v) => (v + d + fotos.length) % fotos.length)
    },
    [fotos.length],
  )

  useEffect(() => {
    document.documentElement.classList.add('trava-rolagem')
    const tecla = (e: KeyboardEvent) => {
      if (e.key === 'Escape') aoFechar()
      if (e.key === 'ArrowRight') ir(1)
      if (e.key === 'ArrowLeft') ir(-1)
    }
    addEventListener('keydown', tecla)
    return () => {
      removeEventListener('keydown', tecla)
      document.documentElement.classList.remove('trava-rolagem')
    }
  }, [aoFechar, ir])

  const f = fotos[i]
  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={`Fotos: ${titulo}`}
      className="fixed inset-0 z-[300] flex flex-col bg-[#0c0c0d] text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
    >
      <div className="flex items-center justify-between px-4 py-3 md:px-6">
        <p className="num text-[14px] text-white/70">
          {i + 1} / {fotos.length}
        </p>
        <button type="button" onClick={aoFechar} className="grid size-11 place-items-center rounded-full hover:bg-white/10" aria-label="Fechar galeria" autoFocus>
          <X size={22} strokeWidth={1.6} />
        </button>
      </div>
      <div
        className="relative flex-1 overflow-hidden"
        onTouchStart={(e) => (toque.current = e.touches[0].clientX)}
        onTouchEnd={(e) => {
          if (toque.current === null) return
          const d = e.changedTouches[0].clientX - toque.current
          if (Math.abs(d) > 40) ir(d < 0 ? 1 : -1)
          toque.current = null
        }}
      >
        <AnimatePresence initial={false} custom={direcao}>
          <motion.img
            key={f.src}
            src={asset(f.src)}
            alt={f.alt}
            custom={direcao}
            className="absolute inset-0 m-auto max-h-full max-w-full object-contain px-0 md:px-20"
            initial={{ opacity: 0, x: direcao * 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direcao * -40 }}
            transition={{ type: 'spring', bounce: 0, duration: 0.45 }}
          />
        </AnimatePresence>
        <button type="button" onClick={() => ir(-1)} className="absolute left-3 top-1/2 hidden size-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 backdrop-blur hover:bg-white/20 md:grid" aria-label="Foto anterior">
          <ChevronLeft size={24} strokeWidth={1.6} />
        </button>
        <button type="button" onClick={() => ir(1)} className="absolute right-3 top-1/2 hidden size-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 backdrop-blur hover:bg-white/20 md:grid" aria-label="Próxima foto">
          <ChevronRight size={24} strokeWidth={1.6} />
        </button>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-4 pb-[max(1rem,env(safe-area-inset-bottom))] text-[14px] md:px-6">
        <p className="text-white/85">{f.alt}</p>
      </div>
    </motion.div>
  )
}
