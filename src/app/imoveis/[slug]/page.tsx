import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, ArrowRight, Bath, BedDouble, Car, Check, MapPin, Maximize2, Ruler, Sparkles } from 'lucide-react'
import { formatarPreco, imoveis, porSlug, reais, type Imovel } from '@/data/imoveis'
import { site } from '@/config/site'
import { linkWhatsApp } from '@/lib/whatsapp'
import { PropertyGallery } from '@/components/PropertyGallery'
import { Property3DViewer } from '@/components/Property3DViewer'
import { PropertyCard } from '@/components/PropertyCard'
import { AgentProfile } from '@/components/AgentProfile'
import { BotaoAgendar } from '@/components/BotaoAgendar'
import { FinanceSimulator } from '@/components/FinanceSimulator'
import { ShareButton } from '@/components/ShareButton'
import { IconeWhatsApp } from '@/components/WhatsAppCTA'
import { Reveal } from '@/components/Reveal'

export const dynamicParams = false
export function generateStaticParams() {
  return imoveis.map((i) => ({ slug: i.slug }))
}

export async function generateMetadata({ params }: PageProps<'/imoveis/[slug]'>): Promise<Metadata> {
  const i = porSlug((await params).slug)
  if (!i) return {}
  return { title: i.titulo, description: `${i.tipo} em ${i.bairro}, ${i.area} m², ${i.quartos} quartos. ${i.resumo}` }
}

const POSTERS = {
  casa: { paisagem: '/posters/casa-explore.webp', retrato: '/posters/casa-explore-retrato.webp' },
  sala: { paisagem: '/posters/sala.webp', retrato: '/posters/sala-retrato.webp' },
  cozinha: { paisagem: '/posters/cozinha.webp', retrato: '/posters/cozinha-retrato.webp' },
  closet: { paisagem: '/posters/closet.webp', retrato: '/posters/closet-retrato.webp' },
}

/** Mesma finalidade, preferindo mesmo tipo e preço próximo. */
function parecidos(i: Imovel) {
  return imoveis
    .filter((o) => o.slug !== i.slug && o.finalidade === i.finalidade)
    .sort((a, b) => Number(b.tipo === i.tipo) - Number(a.tipo === i.tipo) || Math.abs(a.preco - i.preco) - Math.abs(b.preco - i.preco))
    .slice(0, 3)
}

export default async function PaginaImovel({ params }: PageProps<'/imoveis/[slug]'>) {
  const i = porSlug((await params).slug)
  if (!i) notFound()

  const porM2 = Math.round(i.preco / i.area)
  const caracteristicas = [
    { icone: Maximize2, valor: `${i.area} m²`, rotulo: 'Área privativa' },
    { icone: BedDouble, valor: String(i.quartos), rotulo: i.quartos === 1 ? 'Quarto' : 'Quartos' },
    { icone: Sparkles, valor: String(i.suites), rotulo: i.suites === 1 ? 'Suíte' : 'Suítes' },
    { icone: Bath, valor: String(i.banheiros), rotulo: i.banheiros === 1 ? 'Banheiro' : 'Banheiros' },
    { icone: Car, valor: String(i.vagas), rotulo: i.vagas === 1 ? 'Vaga' : 'Vagas' },
    { icone: Ruler, valor: reais(porM2), rotulo: i.finalidade === 'Venda' ? 'Valor do m²' : 'Aluguel por m²' },
  ]
  const d = 0.008
  const mapa = `https://www.openstreetmap.org/export/embed.html?bbox=${i.mapa.lng - d * 1.6},${i.mapa.lat - d},${i.mapa.lng + d * 1.6},${i.mapa.lat + d}&layer=mapnik&marker=${i.mapa.lat},${i.mapa.lng}`
  const semelhantes = parecidos(i)
  const mensagem = site.mensagens.imovel(i.titulo, i.codigo)

  return (
    <article className="mx-auto max-w-[1240px] px-5 pb-24 pt-[calc(var(--topo)+1.5rem)] md:px-8 md:pt-[calc(var(--topo)+2.5rem)]">
      <div className="flex items-center justify-between gap-4">
        <Link href="/imoveis" className="inline-flex min-h-10 items-center gap-1.5 text-[14px] font-medium text-suave hover:text-tinta">
          <ArrowLeft size={16} strokeWidth={1.8} aria-hidden />
          Todos os imóveis
        </Link>
        <ShareButton titulo={i.titulo} />
      </div>

      {/* ——— Cabeçalho ——— */}
      <header className="mt-4 flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="flex flex-wrap items-center gap-2 text-[14px] text-suave">
            <span>{i.tipo}</span>
            <span aria-hidden>·</span>
            <span className="inline-flex items-center gap-1">
              <MapPin size={14} strokeWidth={1.8} aria-hidden />
              {i.bairro}, {i.cidade}
            </span>
            {i.modelo3d && <span className="rounded-full bg-acento-claro px-2.5 py-0.5 text-[12px] font-medium text-acento">Tour 3D</span>}
          </p>
          <h1 className="titulo-l mt-3">{i.titulo}</h1>
          <p className="mt-3 max-w-[60ch] text-[1.0625rem] leading-relaxed text-suave">{i.resumo}</p>
        </div>
        <div className="md:text-right">
          <p className="text-[13px] text-suave">
            {i.finalidade === 'Venda' ? 'Valor de venda' : 'Aluguel'} · <span className="num">Cód. {i.codigo}</span>
          </p>
          <p className="num text-[clamp(1.8rem,3vw,2.4rem)] font-semibold tracking-[-0.035em]">{formatarPreco(i)}</p>
        </div>
      </header>

      {/* ——— Galeria ——— */}
      <div className="mt-8">
        <PropertyGallery fotos={i.fotos} titulo={i.titulo} />
      </div>

      {/* ——— Características ——— */}
      <ul className="mt-6 grid grid-cols-3 gap-px overflow-hidden rounded-[var(--radius-cartao)] bg-linha shadow-[0_0_0_1px_var(--color-linha)] lg:grid-cols-6">
        {caracteristicas.map((c) => (
          <li key={c.rotulo} className="bg-white px-4 py-5 md:px-6">
            <c.icone size={18} strokeWidth={1.6} className="text-suave" aria-hidden />
            <p className="num mt-3 text-[clamp(1.05rem,2.2vw,1.375rem)] font-semibold tracking-[-0.03em]">{c.valor}</p>
            <p className="text-[13px] text-suave">{c.rotulo}</p>
          </li>
        ))}
      </ul>

      <div className="mt-16 grid gap-12 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-16">
        <div className="grid gap-16">
          {/* ——— 3D ——— */}
          {i.modelo3d && (
            <section aria-labelledby="t-3d">
              <Reveal>
                <p className="sobretitulo">Tour 3D</p>
                <h2 id="t-3d" className="titulo-m mt-2">
                  {i.titulo3d ?? 'Explore a casa por fora, por cima e por dentro'}
                </h2>
                <p className="mt-2 text-[15px] text-suave">
                  Arraste para girar, use dois dedos ou a roda do mouse para aproximar e toque nos números para ver os detalhes.
                </p>
              </Reveal>
              <div className="mt-6 h-[min(72vh,620px)] min-h-[420px]">
                <Property3DViewer modelo={i.modelo3d} nome={i.titulo} tamanho={i.tamanho3d} poster={POSTERS[i.modelo3d]} className="h-full" />
              </div>
              <p className="mt-3 text-[12.5px] text-suave">
                Modelo 3D ilustrativo, com medidas aproximadas. Confirme metragens e acabamentos na visita e na documentação.
              </p>
            </section>
          )}

          {/* ——— Descrição ——— */}
          <section aria-labelledby="t-desc">
            <h2 id="t-desc" className="titulo-m">Sobre o imóvel</h2>
            <div className="mt-5 grid max-w-[64ch] gap-4">
              {i.descricao.map((p) => (
                <p key={p} className="texto-corpo">
                  {p}
                </p>
              ))}
            </div>
            <dl className="mt-8 grid max-w-[560px] grid-cols-2 gap-y-3 border-t border-linha pt-6 text-[15px]">
              {i.condominio !== undefined && (
                <>
                  <dt className="text-suave">Condomínio</dt>
                  <dd className="num text-right font-medium">{reais(i.condominio)}/mês</dd>
                </>
              )}
              {i.iptu !== undefined && (
                <>
                  <dt className="text-suave">IPTU</dt>
                  <dd className="num text-right font-medium">{reais(i.iptu)}/mês</dd>
                </>
              )}
              <dt className="text-suave">Finalidade</dt>
              <dd className="text-right font-medium">{i.finalidade}</dd>
              <dt className="text-suave">Código</dt>
              <dd className="num text-right font-medium">{i.codigo}</dd>
            </dl>
          </section>

          {/* ——— Diferenciais ——— */}
          <section aria-labelledby="t-dif">
            <h2 id="t-dif" className="titulo-m">Diferenciais</h2>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {i.diferenciais.map((d) => (
                <li key={d} className="flex items-start gap-3 rounded-2xl bg-white px-4 py-3.5 text-[15px] shadow-[0_0_0_1px_var(--color-linha)]">
                  <span className="mt-0.5 grid size-5 flex-none place-items-center rounded-full bg-acento-claro text-acento">
                    <Check size={13} strokeWidth={2.2} aria-hidden />
                  </span>
                  {d}
                </li>
              ))}
            </ul>
          </section>

          {/* ——— Financiamento (venda) ——— */}
          {i.finalidade === 'Venda' && <FinanceSimulator preco={i.preco} titulo={i.titulo} />}

          {/* ——— Localização ——— */}
          <section aria-labelledby="t-loc">
            <h2 id="t-loc" className="titulo-m">Localização</h2>
            <p className="mt-2 text-[15px] text-suave">
              {i.bairro}, {i.cidade}. Localização aproximada; o endereço exato é enviado no agendamento.
            </p>
            <div className="mt-6 overflow-hidden rounded-[var(--radius-cartao)] shadow-[0_0_0_1px_var(--color-linha)]">
              <iframe
                title={`Mapa: ${i.bairro}, ${i.cidade}`}
                src={mapa}
                loading="lazy"
                className="block h-[320px] w-full border-0 grayscale-[0.4] md:h-[380px]"
              />
            </div>
            <ul className="mt-6 grid gap-x-10 sm:grid-cols-2">
              {i.proximidades.map((p) => (
                <li key={p.lugar} className="flex items-baseline justify-between gap-4 border-b border-linha py-3.5 text-[15px]">
                  <span>{p.lugar}</span>
                  <span className="num text-suave">{p.distancia}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* ——— Lateral ——— */}
        <div className="lg:sticky lg:top-[calc(var(--topo)+1.5rem)] lg:self-start">
          <div className="grid gap-4">
            <div className="rounded-[var(--radius-cartao)] bg-white p-6 shadow-[0_0_0_1px_var(--color-linha)]">
              <p className="text-[13px] text-suave">
                {i.titulo} · <span className="num">{i.codigo}</span>
              </p>
              <p className="num mt-1 text-[26px] font-semibold tracking-[-0.03em]">{formatarPreco(i)}</p>
              <div className="mt-5 grid gap-2">
                <BotaoAgendar imovel={`${i.titulo} (${i.codigo})`} className="botao botao-primario w-full" />
                <a href={linkWhatsApp(mensagem)} target="_blank" rel="noopener" className="botao botao-secundario w-full">
                  <span className="text-[#1faa55]">
                    <IconeWhatsApp size={18} />
                  </span>
                  Falar no WhatsApp
                </a>
              </div>
            </div>
            <AgentProfile compacto semAcoes imovel={i.titulo} />
          </div>
        </div>
      </div>

      {/* ——— Parecidos ——— */}
      {semelhantes.length > 0 && (
        <section aria-labelledby="t-par" className="mt-24 border-t border-linha pt-16">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 id="t-par" className="titulo-m">
              Imóveis parecidos
            </h2>
            <Link href="/imoveis" className="inline-flex items-center gap-1.5 text-[15px] font-medium hover:text-acento">
              Ver todos
              <ArrowRight size={16} strokeWidth={1.8} aria-hidden />
            </Link>
          </div>
          <div className="trilho mt-8">
            {semelhantes.map((o) => (
              <PropertyCard key={o.slug} imovel={o} />
            ))}
          </div>
        </section>
      )}
    </article>
  )
}
