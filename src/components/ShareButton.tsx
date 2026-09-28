'use client'

import { useState } from 'react'
import { Check, Share2 } from 'lucide-react'

/** Compartilhar: menu nativo no celular; no desktop, copia o link. */
export function ShareButton({ titulo }: { titulo: string }) {
  const [copiado, setCopiado] = useState(false)
  const compartilhar = async () => {
    const url = location.href
    if (navigator.share) {
      try {
        await navigator.share({ title: titulo, url })
      } catch {
        /* cancelado */
      }
      return
    }
    await navigator.clipboard?.writeText(url)
    setCopiado(true)
    setTimeout(() => setCopiado(false), 2000)
  }
  return (
    <button type="button" onClick={compartilhar} className="botao botao-secundario !min-h-10 !px-4 !text-[14px]">
      {copiado ? <Check size={16} strokeWidth={1.8} aria-hidden /> : <Share2 size={16} strokeWidth={1.8} aria-hidden />}
      <span aria-live="polite">{copiado ? 'Link copiado' : 'Compartilhar'}</span>
    </button>
  )
}
