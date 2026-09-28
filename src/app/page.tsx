import Link from 'next/link'
import { ArrowDown, ArrowRight, Box, CalendarCheck, MessageCircle } from 'lucide-react'
import { site } from '@/config/site'
import { destaques } from '@/data/imoveis'
import { linkWhatsApp } from '@/lib/whatsapp'
import { Property3DViewer } from '@/components/Property3DViewer'
import { PropertyCard } from '@/components/PropertyCard'
import { SearchBar } from '@/components/SearchBar'
import { ExploreSection } from '@/components/ExploreSection'
import { AgentProfile } from '@/components/AgentProfile'
import { Reveal } from '@/components/Reveal'
import { IconeWhatsApp } from '@/components/WhatsAppCTA'
import { BotaoAgendar } from '@/components/BotaoAgendar'
import { AnunciarImovel } from '@/components/AnunciarImovel'

const PASSOS = [
  {
    icone: Box,
    titulo: 'Explore em 3D',
    texto: 'Gire, aproxime, tire o telhado. Descubra se a planta funciona para você antes de gastar uma tarde de visita.',
  },
  {
    icone: MessageCircle,
    titulo: 'Tire as dúvidas',
    texto: 'Pelo WhatsApp: documentação, condomínio, financiamento, o que você reparou no 3D. Resposta direta, sem call center.',
  },
  {
    icone: CalendarCheck,
    titulo: 'Visite para confirmar',
    texto: 'Você chega sabendo onde fica cada cômodo. A visita serve para sentir a luz, o bairro e o silêncio.',
  },
]

export default function Home() {
  return (
    <>
      {/* ——— Hero 40/60 ——— */}
      <section className="relative overflow-hidden pt-[var(--topo)]">
        <div className="mx-auto grid max-w-[1400px] items-center lg:min-h-[calc(100svh-var(--topo))] lg:grid-cols-[minmax(0,0.4fr)_minmax(0,0.6fr)]">
          <div className="px-5 pb-6 pt-10 md:px-8 lg:py-16 lg:pl-12 lg:pr-4">
            <Reveal>
              <p className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-[13px] font-medium text-tinta-2 shadow-[0_0_0_1px_var(--color-linha)]">
                <span className="size-1.5 rounded-full bg-acento" aria-hidden />
                Imóveis com tour 3D em {site.cidade}
              </p>
            </Reveal>
            <Reveal delay={0.06}>
              <h1 className="titulo-xl mt-6 max-w-[13ch] text-balance">Explore seu próximo imóvel antes mesmo da visita.</h1>
            </Reveal>
            <Reveal delay={0.12}>
              <p className="texto-corpo mt-6 max-w-[42ch] !text-[1.125rem]">
                Casas e apartamentos em 3D: por fora, por cima e por dentro. Você visita só o que já faz sentido.
              </p>
            </Reveal>
            <Reveal delay={0.18}>
              <div className="mt-9 flex flex-wrap gap-3">
                <Link href="/imoveis" className="botao botao-primario">
                  Ver imóveis
                  <ArrowRight size={17} strokeWidth={1.8} aria-hidden />
                </Link>
                <a href="#explore" className="botao botao-secundario">
                  Como é o tour 3D
                  <ArrowDown size={17} strokeWidth={1.8} aria-hidden />
                </a>
              </div>
            </Reveal>
          </div>

          <div className="relative h-[62svh] min-h-[380px] lg:h-[calc(100svh-var(--topo))] lg:max-h-[860px]">
            <Property3DViewer
              modelo="casa"
              nome="Casa Alameda"
              variante="hero"
              tamanho="5 MB"
              poster={{ paisagem: '/posters/casa-hero.webp', retrato: '/posters/casa-hero-retrato.webp' }}
              className="h-full"
            />
            <Link
              href="/imoveis/casa-alameda"
              className="absolute bottom-5 left-5 z-10 hidden items-center gap-3 rounded-2xl bg-white/80 py-2.5 pl-3 pr-4 shadow-[0_0_0_1px_rgb(0_0_0/0.06)] backdrop-blur-xl transition-colors hover:bg-white lg:flex"
            >
              <span className="text-[13px] leading-tight">
                <span className="block font-semibold">Casa Alameda</span>
                <span className="text-suave">Vila Assunção · 342 m² · 3 quartos</span>
              </span>
              <ArrowRight size={16} strokeWidth={1.8} aria-hidden />
            </Link>
          </div>
        </div>
      </section>

      {/* ——— Busca ——— */}
      <section className="relative z-10 mx-auto mt-6 max-w-[1100px] px-5 md:px-8" aria-label="Busca">
        <Reveal>
          <SearchBar />
        </Reveal>
      </section>

      {/* ——— Destaques ——— */}
      <section className="pt-24 md:pt-32">
        <div className="mx-auto max-w-[1240px] px-5 md:px-8">
          <Reveal className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="sobretitulo">Selecionados</p>
              <h2 className="titulo-l mt-3">Imóveis em destaque</h2>
            </div>
            <Link href="/imoveis" className="inline-flex items-center gap-1.5 text-[15px] font-medium text-tinta hover:text-acento">
              Ver todos
              <ArrowRight size={16} strokeWidth={1.8} aria-hidden />
            </Link>
          </Reveal>
          <div className="trilho mt-10">
            {destaques.map((i, n) => (
              <Reveal key={i.slug} delay={n * 0.06}>
                <PropertyCard imovel={i} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <ExploreSection />

      {/* ——— Como funciona ——— */}
      <section id="como-funciona" className="scroll-mt-[var(--topo)] bg-white py-24 md:py-32">
        <div className="mx-auto max-w-[1240px] px-5 md:px-8">
          <Reveal className="max-w-[640px]">
            <p className="sobretitulo">Como funciona</p>
            <h2 className="titulo-l mt-3">Menos visitas perdidas. Mais certeza em cada uma.</h2>
          </Reveal>
          <ol className="mt-14 grid gap-10 md:grid-cols-3 md:gap-8">
            {PASSOS.map((p, i) => (
              <Reveal key={p.titulo} delay={i * 0.08}>
                <li className="border-t border-linha pt-6">
                  <div className="flex items-center justify-between">
                    <span className="grid size-11 place-items-center rounded-full bg-acento-claro text-acento">
                      <p.icone size={20} strokeWidth={1.6} aria-hidden />
                    </span>
                    <span className="num text-[13px] text-suave">0{i + 1}</span>
                  </div>
                  <h3 className="titulo-m mt-6">{p.titulo}</h3>
                  <p className="mt-3 text-[15.5px] leading-relaxed text-suave">{p.texto}</p>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* ——— Corretor ——— */}
      <section id="corretor" className="scroll-mt-[var(--topo)] py-24 md:py-32">
        <div className="mx-auto max-w-[1240px] px-5 md:px-8">
          <Reveal>
            <AgentProfile />
          </Reveal>
        </div>
      </section>

      {/* ——— Depoimentos (só com depoimentos reais no config) ——— */}
      {site.depoimentos.length > 0 && (
        <section className="bg-white py-24 md:py-32" aria-labelledby="depoimentos">
          <div className="mx-auto max-w-[1240px] px-5 md:px-8">
            <Reveal>
              <p className="sobretitulo">Depoimentos</p>
              <h2 id="depoimentos" className="titulo-l mt-3">Quem comprou com a {site.corretor.nome.split(' ')[0]}</h2>
            </Reveal>
            <div className="trilho mt-12">
              {site.depoimentos.map((d, i) => (
                <Reveal key={d.nome} delay={i * 0.06}>
                  <figure className="h-full rounded-[var(--radius-cartao)] bg-papel p-7">
                    <blockquote className="text-[17px] leading-relaxed tracking-[-0.01em]">“{d.texto}”</blockquote>
                    <figcaption className="mt-6 text-[14px]">
                      <span className="font-semibold">{d.nome}</span>
                      <span className="block text-suave">{d.contexto}</span>
                    </figcaption>
                  </figure>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      <AnunciarImovel />

      {/* ——— CTA ——— */}
      <section className="px-5 pb-24 md:px-8 md:pb-32">
        <Reveal className="mx-auto max-w-[1240px] overflow-hidden rounded-[32px] bg-tinta px-6 py-16 text-white md:px-16 md:py-24">
          <div className="grid items-end gap-10 md:grid-cols-[1.3fr_1fr]">
            <div>
              <h2 className="titulo-l max-w-[16ch] text-balance">Procurando algo específico? Me conte.</h2>
              <p className="mt-5 max-w-[46ch] text-[1.0625rem] leading-relaxed text-white/65">
                Bairro, tamanho, orçamento, o que não pode faltar. Eu filtro, mando os que valem a pena em 3D e a gente só
                visita o que fizer sentido.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 md:justify-end">
              <a href={linkWhatsApp()} target="_blank" rel="noopener" className="botao bg-white text-tinta hover:bg-white/90">
                <span className="text-[#1faa55]">
                  <IconeWhatsApp size={18} />
                </span>
                Falar no WhatsApp
              </a>
              <BotaoAgendar className="botao text-white shadow-[inset_0_0_0_1px_rgb(255_255_255/0.3)] hover:shadow-[inset_0_0_0_1px_white]" />
            </div>
          </div>
        </Reveal>
      </section>
    </>
  )
}
