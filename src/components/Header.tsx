'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { ArrowUpRight, Menu, X } from 'lucide-react'
import { site } from '@/config/site'
import { linkDemo } from '@/lib/whatsapp'
import { useAgendamento } from './ScheduleVisit'
import { Logo } from './Logo'

const LINKS = [
  { href: '/imoveis', rotulo: 'Imóveis' },
  { href: '/#explore', rotulo: 'Tour 3D' },
  { href: '/#anunciar', rotulo: 'Anunciar' },
  { href: '/#corretor', rotulo: 'Sobre' },
]

/** Faixa escura no topo: avisa que é uma demonstração e leva ao WhatsApp da Módulo. */
function FaixaDemo() {
  return (
    <div className="flex h-9 items-center justify-center gap-3 bg-tinta px-4 text-[12.5px] text-white/75">
      <span className="hidden sm:inline">Site de demonstração criado pela</span>
      <span className="sm:hidden">Demonstração ·</span>
      <Logo className="h-[15px] text-white" />
      <a
        href={linkDemo()}
        target="_blank"
        rel="noopener"
        className="ml-1 inline-flex items-center gap-1 rounded-full bg-white/12 px-2.5 py-1 font-medium text-white transition-colors hover:bg-white/20"
      >
        Quero um site assim
        <ArrowUpRight size={13} strokeWidth={2} aria-hidden />
      </a>
    </div>
  )
}

/** Logotipo de texto da corretora. */
export function Marca({ className = '' }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden>
        <rect x="2" y="2" width="20" height="20" rx="5" fill="currentColor" />
        <path d="M7 17V9.5L12 6l5 3.5V17h-3.2v-4.2h-3.6V17z" fill="var(--color-papel)" />
      </svg>
      <span className="text-[18px] font-semibold tracking-[-0.035em]">
        {site.marcaCurta}
        <span className="font-normal text-suave"> Imóveis</span>
      </span>
    </span>
  )
}

/** Transparente sobre o topo; branco translúcido com desfoque depois de rolar. */
export function Header() {
  const [rolou, setRolou] = useState(false)
  const [menu, setMenu] = useState(false)
  const caminho = usePathname()
  const { abrir } = useAgendamento()

  useEffect(() => {
    const aoRolar = () => setRolou(scrollY > 12)
    aoRolar()
    addEventListener('scroll', aoRolar, { passive: true })
    return () => removeEventListener('scroll', aoRolar)
  }, [])

  const solido = rolou || menu
  return (
    <header className="fixed inset-x-0 top-0 z-50">
      {site.demo.ativo && <FaixaDemo />}
      <div
        className={`transition-[background-color,box-shadow,backdrop-filter] duration-300 ${
          solido ? 'bg-white/78 shadow-[0_1px_0_rgb(0_0_0/0.07)] backdrop-blur-xl backdrop-saturate-150' : 'bg-transparent'
        }`}
      >
        <div className="mx-auto flex h-16 max-w-[1240px] items-center justify-between gap-6 px-5 md:px-8">
          <Link href="/" aria-label={`${site.marca} — início`}>
            <Marca />
          </Link>

          <nav className="hidden items-center gap-1 md:flex" aria-label="Principal">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`rounded-full px-3.5 py-2 text-[14px] font-medium transition-colors hover:text-tinta ${
                  caminho.startsWith(l.href) && l.href !== '/' ? 'text-tinta' : 'text-suave'
                }`}
              >
                {l.rotulo}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button type="button" onClick={() => abrir()} className="botao botao-primario hidden !min-h-10 !px-4 !text-[14px] md:inline-flex">
              Agendar visita
            </button>
            <button
              type="button"
              className="grid size-10 place-items-center rounded-full md:hidden"
              aria-label={menu ? 'Fechar menu' : 'Abrir menu'}
              aria-expanded={menu}
              onClick={() => setMenu((m) => !m)}
            >
              {menu ? <X size={20} strokeWidth={1.6} /> : <Menu size={20} strokeWidth={1.6} />}
            </button>
          </div>
        </div>

        {menu && (
          <nav className="border-t border-linha px-5 pb-6 pt-2 md:hidden" aria-label="Menu">
            {LINKS.map((l) => (
              <Link key={l.href} href={l.href} onClick={() => setMenu(false)} className="block border-b border-linha py-4 text-[17px] font-medium tracking-[-0.02em]">
                {l.rotulo}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  )
}
