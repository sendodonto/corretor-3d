'use client'

import Link from 'next/link'
import { site } from '@/config/site'
import { linkDemo, linkWhatsApp } from '@/lib/whatsapp'
import { useCorretor } from '@/lib/personalizacao'
import { Marca } from './Header'
import { Logo } from './Logo'

export function Footer() {
  const c = useCorretor()
  // Na prévia personalizada, os contatos fictícios da demonstração não aparecem.
  const contatos = c.personalizado ? [site.contato.horario] : [site.contato.instagram, site.contato.endereco, site.contato.horario]
  const assinatura = [c.nome, c.cargo, c.creci].filter(Boolean).join(' · ')
  return (
    <footer className="border-t border-linha bg-papel pb-28 pt-16 md:pb-12">
      <div className="mx-auto grid max-w-[1240px] gap-12 px-5 md:grid-cols-[1.4fr_1fr_1fr_1fr] md:px-8">
        <div>
          <Link href="/" className="inline-flex" aria-label="Início">
            <Marca />
          </Link>
          <p className="mt-4 max-w-[32ch] text-[14.5px] leading-relaxed text-suave">
            {assinatura}. {site.regiao}.
          </p>
        </div>
        <nav aria-label="Imóveis" className="text-[14.5px]">
          <p className="font-medium">Imóveis</p>
          <ul className="mt-4 grid gap-2.5 text-suave">
            <li><Link className="hover:text-tinta" href="/imoveis">Todos os imóveis</Link></li>
            <li><Link className="hover:text-tinta" href="/imoveis?tour=3d">Com tour 3D</Link></li>
            <li><Link className="hover:text-tinta" href="/imoveis?finalidade=Aluguel">Para alugar</Link></li>
            <li><Link className="hover:text-tinta" href="/#anunciar">Anunciar meu imóvel</Link></li>
          </ul>
        </nav>
        <nav aria-label="Site" className="text-[14.5px]">
          <p className="font-medium">Site</p>
          <ul className="mt-4 grid gap-2.5 text-suave">
            <li><Link className="hover:text-tinta" href="/#explore">Tour 3D</Link></li>
            <li><Link className="hover:text-tinta" href="/#como-funciona">Como funciona</Link></li>
            <li><Link className="hover:text-tinta" href="/#corretor">Quem atende</Link></li>
          </ul>
        </nav>
        <div className="text-[14.5px]">
          <p className="font-medium">Contato</p>
          <ul className="mt-4 grid gap-2.5 text-suave">
            <li><a className="hover:text-tinta" href={linkWhatsApp()} target="_blank" rel="noopener">WhatsApp</a></li>
            {!c.personalizado && (
              <li><a className="hover:text-tinta" href={`mailto:${site.contato.email}`}>{site.contato.email}</a></li>
            )}
            {contatos.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </div>
      </div>
      <div className="mx-auto mt-14 flex max-w-[1240px] flex-col gap-4 border-t border-linha px-5 pt-6 text-[12.5px] leading-relaxed text-suave md:flex-row md:items-center md:justify-between md:px-8">
        <p>
          © {new Date().getFullYear()} {c.personalizado ? c.nome : site.marca}. Imagens meramente ilustrativas.
        </p>
        {site.demo.ativo && (
          <a href={linkDemo()} target="_blank" rel="noopener" className="inline-flex items-center gap-2 text-tinta-2 hover:text-tinta">
            Site criado pela
            <Logo className="h-[15px]" />
          </a>
        )}
      </div>
    </footer>
  )
}
