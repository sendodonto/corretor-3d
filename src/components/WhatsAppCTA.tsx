'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { linkWhatsApp } from '@/lib/whatsapp'
import { site } from '@/config/site'
import { imoveis } from '@/data/imoveis'
import { useAgendamento } from './ScheduleVisit'

export function IconeWhatsApp({ size = 20 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden>
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21c5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2Zm0 18.15c-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24 4.54 0 8.24 3.7 8.24 8.24 0 4.55-3.7 8.24-8.24 8.24Zm4.52-6.16c-.25-.12-1.47-.72-1.7-.8-.23-.09-.39-.13-.56.12-.16.25-.64.8-.78.97-.15.16-.29.18-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.5.11-.11.25-.29.37-.43.13-.15.17-.25.25-.42.08-.16.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.43h-.48c-.16 0-.43.06-.66.31-.22.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.15-1.18-.06-.1-.23-.16-.48-.29Z" />
    </svg>
  )
}

/** Mensagem do WhatsApp conforme a página (na página do imóvel, cita o imóvel). */
function useContextoImovel() {
  const caminho = usePathname()
  const slug = caminho.match(/\/imoveis\/([^/]+)/)?.[1]
  return imoveis.find((i) => i.slug === slug)
}

/**
 * Botão flutuante (desktop) e barra fixa inferior (celular):
 * [Falar no WhatsApp] [Agendar visita]. A barra só aparece depois do topo
 * da página, para não competir com o hero.
 */
export function WhatsAppCTA() {
  const imovel = useContextoImovel()
  const { abrir } = useAgendamento()
  const [visivel, setVisivel] = useState(false)
  const mensagem = imovel ? site.mensagens.imovel(imovel.titulo, imovel.codigo) : site.mensagens.geral

  useEffect(() => {
    const aoRolar = () => setVisivel(scrollY > 320)
    aoRolar()
    addEventListener('scroll', aoRolar, { passive: true })
    return () => removeEventListener('scroll', aoRolar)
  }, [])

  return (
    <>
      <a
        href={linkWhatsApp(mensagem)}
        target="_blank"
        rel="noopener"
        className={`fixed bottom-6 right-6 z-40 hidden items-center gap-2.5 rounded-full bg-tinta py-3 pl-3.5 pr-5 text-[14px] font-medium text-white shadow-[0_12px_32px_rgb(0_0_0/0.2)] transition-[transform,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-black md:inline-flex ${
          visivel ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0'
        }`}
      >
        <span className="grid size-7 place-items-center rounded-full bg-[#25d366] text-white">
          <IconeWhatsApp size={16} />
        </span>
        Falar no WhatsApp
      </a>

      <div
        className={`fixed inset-x-0 bottom-0 z-40 border-t border-black/[0.06] bg-white/85 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur-xl backdrop-saturate-150 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] md:hidden ${
          visivel ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div className="grid grid-cols-2 gap-2">
          <a href={linkWhatsApp(mensagem)} target="_blank" rel="noopener" className="botao botao-secundario !min-h-12 !gap-1.5 !px-2 !text-[14px]">
            <span className="text-[#1faa55]">
              <IconeWhatsApp size={18} />
            </span>
            Falar no WhatsApp
          </a>
          <button type="button" onClick={() => abrir(imovel?.titulo)} className="botao botao-primario !min-h-12 !px-2 !text-[14px]">
            Agendar visita
          </button>
        </div>
      </div>
    </>
  )
}
