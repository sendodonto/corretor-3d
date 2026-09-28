'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight, BedDouble, Maximize2 } from 'lucide-react'
import { formatarPreco, imoveis, type Imovel } from '@/data/imoveis'
import { asset } from '@/lib/base'
import { PropertyCard } from './PropertyCard'
import { Reveal } from './Reveal'

const FILTROS: { id: string; rotulo: string; testa: (i: Imovel) => boolean }[] = [
  { id: 'todos', rotulo: 'Todos', testa: () => true },
  { id: 'casas', rotulo: 'Casas', testa: (i) => i.tipo.startsWith('Casa') },
  { id: 'aptos', rotulo: 'Apartamentos', testa: (i) => i.tipo === 'Apartamento' || i.tipo === 'Cobertura' },
  { id: 'aluguel', rotulo: 'Para alugar', testa: (i) => i.finalidade === 'Aluguel' },
]
const LIMITE = 6

/** Linha compacta (celular): foto ao lado das informações, fácil de percorrer. */
function Linha({ imovel }: { imovel: Imovel }) {
  const foto = imovel.fotos[0]
  return (
    <Link href={`/imoveis/${imovel.slug}`} className="flex gap-3 rounded-2xl bg-white p-2 shadow-[0_0_0_1px_var(--color-linha)] active:scale-[0.99]">
      <img src={asset(foto.mini)} alt={foto.alt} loading="lazy" decoding="async" className="size-24 flex-none rounded-xl object-cover" />
      <div className="min-w-0 py-1 pr-1">
        <p className="truncate text-[12.5px] text-suave">
          {imovel.tipo} · {imovel.bairro}
        </p>
        <p className="truncate text-[15.5px] font-semibold tracking-[-0.02em]">{imovel.titulo}</p>
        <p className="num mt-0.5 text-[15px] font-semibold tracking-[-0.02em]">{formatarPreco(imovel)}</p>
        <p className="num mt-1 flex gap-3 text-[12.5px] text-tinta-2">
          <span className="inline-flex items-center gap-1">
            <Maximize2 size={12} strokeWidth={1.7} className="text-suave" aria-hidden />
            {imovel.area} m²
          </span>
          <span className="inline-flex items-center gap-1">
            <BedDouble size={13} strokeWidth={1.7} className="text-suave" aria-hidden />
            {imovel.quartos} {imovel.quartos === 1 ? 'quarto' : 'quartos'}
          </span>
          {imovel.modelo3d && <span className="font-medium text-acento">Tour 3D</span>}
        </p>
      </div>
    </Link>
  )
}

/** Os demais imóveis na home, com filtros rápidos e acesso claro ao catálogo. */
export function MaisImoveis() {
  const [filtro, setFiltro] = useState('todos')
  const outros = imoveis.filter((i) => !i.destaque)
  const lista = outros.filter(FILTROS.find((f) => f.id === filtro)!.testa)
  const visiveis = lista.slice(0, LIMITE)

  return (
    <section className="pt-20 md:pt-28" aria-labelledby="mais-imoveis">
      <div className="mx-auto max-w-[1240px] px-5 md:px-8">
        <Reveal className="flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="sobretitulo">Catálogo</p>
            <h2 id="mais-imoveis" className="titulo-l mt-3">
              Mais imóveis
            </h2>
          </div>
          <div role="tablist" aria-label="Filtrar imóveis" className="-mx-5 flex gap-2 overflow-x-auto px-5 [scrollbar-width:none] md:mx-0 md:px-0">
            {FILTROS.map((f) => (
              <button
                key={f.id}
                type="button"
                role="tab"
                aria-selected={filtro === f.id}
                onClick={() => setFiltro(f.id)}
                className={`min-h-10 flex-none rounded-full px-4 text-[14px] font-medium transition-colors ${
                  filtro === f.id ? 'bg-tinta text-white' : 'bg-white text-tinta-2 shadow-[inset_0_0_0_1px_var(--color-linha-forte)] hover:text-tinta'
                }`}
              >
                {f.rotulo}
              </button>
            ))}
          </div>
        </Reveal>

        {/* celular: lista compacta */}
        <ul className="mt-8 grid gap-3 sm:hidden">
          {visiveis.map((i) => (
            <li key={i.slug}>
              <Linha imovel={i} />
            </li>
          ))}
        </ul>
        {/* tablet e desktop: cartões */}
        <ul className="mt-10 hidden gap-6 sm:grid sm:grid-cols-2 lg:grid-cols-3">
          {visiveis.map((i) => (
            <li key={i.slug}>
              <PropertyCard imovel={i} />
            </li>
          ))}
        </ul>

        <div className="mt-10 flex justify-center">
          <Link href="/imoveis" className="botao botao-secundario w-full !min-h-14 sm:w-auto sm:!px-8">
            Ver todos os {imoveis.length} imóveis
            <ArrowRight size={17} strokeWidth={1.8} aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  )
}
