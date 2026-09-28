'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { site } from '@/config/site'
import { useAgendamento } from './ScheduleVisit'
import { Logo } from './Logo'

const LINKS = [
  { href: '/imoveis', rotulo: 'Imóveis' },
  { href: '/#explore', rotulo: 'Explore em 3D' },
  { href: '/#como-funciona', rotulo: 'Como funciona' },
  { href: '/#corretor', rotulo: 'Corretor' },
]

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
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,backdrop-filter] duration-300 ${
        solido
          ? 'bg-white/78 shadow-[0_1px_0_rgb(0_0_0/0.07)] backdrop-blur-xl backdrop-saturate-150'
          : 'bg-transparent'
      }`}
    >
      <div className="mx-auto flex h-16 max-w-[1240px] items-center justify-between gap-6 px-5 md:px-8">
        <Link href="/" className="flex items-center" aria-label={`${site.marca} — início`}>
          <Logo className="h-6 md:h-7" />
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
    </header>
  )
}
