import Link from 'next/link'
import { site } from '@/config/site'
import { linkWhatsApp } from '@/lib/whatsapp'
import { Marca } from './Header'

export function Footer() {
  const c = site.corretor
  return (
    <footer className="border-t border-linha bg-papel pb-28 pt-16 md:pb-12">
      <div className="mx-auto grid max-w-[1240px] gap-12 px-5 md:grid-cols-[1.4fr_1fr_1fr_1fr] md:px-8">
        <div>
          <Link href="/" className="inline-flex items-center gap-2.5">
            <Marca />
            <span className="text-[17px] font-semibold tracking-[-0.03em]">{site.marca}</span>
          </Link>
          <p className="mt-4 max-w-[30ch] text-[14.5px] leading-relaxed text-suave">
            {c.nome}, {c.cargo.toLowerCase()} em {site.regiao}. {c.creci ? `CRECI ${c.creci}.` : 'CRECI em registro.'}
          </p>
        </div>
        <nav aria-label="Imóveis" className="text-[14.5px]">
          <p className="font-medium">Imóveis</p>
          <ul className="mt-4 grid gap-2.5 text-suave">
            <li><Link className="hover:text-tinta" href="/imoveis">Todos os imóveis</Link></li>
            <li><Link className="hover:text-tinta" href="/imoveis?tour=3d">Com tour 3D</Link></li>
            <li><Link className="hover:text-tinta" href="/imoveis?finalidade=Aluguel">Para alugar</Link></li>
          </ul>
        </nav>
        <nav aria-label="Site" className="text-[14.5px]">
          <p className="font-medium">Site</p>
          <ul className="mt-4 grid gap-2.5 text-suave">
            <li><Link className="hover:text-tinta" href="/#explore">Explore em 3D</Link></li>
            <li><Link className="hover:text-tinta" href="/#como-funciona">Como funciona</Link></li>
            <li><Link className="hover:text-tinta" href="/#corretor">Sobre o corretor</Link></li>
          </ul>
        </nav>
        <div className="text-[14.5px]">
          <p className="font-medium">Contato</p>
          <ul className="mt-4 grid gap-2.5 text-suave">
            <li><a className="hover:text-tinta" href={linkWhatsApp()} target="_blank" rel="noopener">WhatsApp</a></li>
            <li><a className="hover:text-tinta" href={`mailto:${site.contato.email}`}>{site.contato.email}</a></li>
            <li>{site.contato.horario}</li>
          </ul>
        </div>
      </div>
      <div className="mx-auto mt-14 flex max-w-[1240px] flex-col gap-2 border-t border-linha px-5 pt-6 text-[12.5px] leading-relaxed text-suave md:flex-row md:justify-between md:px-8">
        <p>© {new Date().getFullYear()} {site.marca}. Imóveis e valores de demonstração.</p>
        <p>Modelos 3D e imagens renderizadas são estudos ilustrativos; fotos marcadas como referência são de banco de imagens (Unsplash).</p>
      </div>
    </footer>
  )
}
