'use client'

import { useMemo, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { AnimatePresence, motion } from 'motion/react'
import { imoveis } from '@/data/imoveis'
import { PropertyCard } from '@/components/PropertyCard'
import { PropertyFilters, FILTROS_VAZIOS, filtrar, type Filtros } from '@/components/PropertyFilters'

const ORDENS = {
  relevancia: 'Relevância',
  menor: 'Menor preço',
  maior: 'Maior preço',
  area: 'Maior área',
} as const
type Ordem = keyof typeof ORDENS

function lerFiltros(q: URLSearchParams): Filtros {
  const fin = q.get('finalidade')
  return {
    ...FILTROS_VAZIOS,
    finalidade: fin === 'Venda' || fin === 'Aluguel' ? fin : '',
    tipo: q.get('tipo') ?? '',
    bairro: q.get('bairro') ?? '',
    quartos: Number(q.get('quartos')) || 0,
    precoMax: Number(q.get('preco')) || 0,
    tour3d: q.get('tour') === '3d',
  }
}

export function Catalogo() {
  const q = useSearchParams()
  const router = useRouter()
  const caminho = usePathname()
  const filtros = useMemo(() => lerFiltros(new URLSearchParams(q.toString())), [q])
  const [ordem, setOrdem] = useState<Ordem>('relevancia')

  const mudar = (f: Filtros) => {
    const p = new URLSearchParams()
    if (f.finalidade) p.set('finalidade', f.finalidade)
    if (f.tipo) p.set('tipo', f.tipo)
    if (f.bairro) p.set('bairro', f.bairro)
    if (f.quartos) p.set('quartos', String(f.quartos))
    if (f.precoMax) p.set('preco', String(f.precoMax))
    if (f.tour3d) p.set('tour', '3d')
    router.replace(`${caminho}${p.size ? `?${p}` : ''}`, { scroll: false })
  }

  const lista = useMemo(() => {
    const r = filtrar(imoveis, filtros)
    if (ordem === 'menor') r.sort((a, b) => a.preco - b.preco)
    if (ordem === 'maior') r.sort((a, b) => b.preco - a.preco)
    if (ordem === 'area') r.sort((a, b) => b.area - a.area)
    if (ordem === 'relevancia') r.sort((a, b) => Number(!!b.modelo3d) - Number(!!a.modelo3d))
    return r
  }, [filtros, ordem])

  return (
    <div className="mt-10 grid gap-8 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-12">
      <PropertyFilters filtros={filtros} aoMudar={mudar} total={lista.length} contar={(f) => filtrar(imoveis, f).length} />
      <div>
        <div className="mb-6 hidden items-center justify-between lg:flex">
          <p className="num text-[14.5px] text-suave" aria-live="polite">
            {lista.length} {lista.length === 1 ? 'imóvel encontrado' : 'imóveis encontrados'}
          </p>
          <label className="flex items-center gap-2 text-[14px] text-suave">
            Ordenar
            <select className="campo !min-h-10 !w-auto !rounded-full !py-0 text-[14px]" value={ordem} onChange={(e) => setOrdem(e.target.value as Ordem)}>
              {Object.entries(ORDENS).map(([v, r]) => (
                <option key={v} value={v}>
                  {r}
                </option>
              ))}
            </select>
          </label>
        </div>
        {lista.length ? (
          <motion.ul layout className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            <AnimatePresence initial={false}>
              {lista.map((i, n) => (
                <motion.li
                  key={i.slug}
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                >
                  <PropertyCard imovel={i} prioridade={n < 3} />
                </motion.li>
              ))}
            </AnimatePresence>
          </motion.ul>
        ) : (
          <div className="rounded-[var(--radius-cartao)] bg-white px-6 py-16 text-center shadow-[0_0_0_1px_var(--color-linha)]">
            <p className="text-[18px] font-semibold tracking-[-0.02em]">Nenhum imóvel com esses filtros</p>
            <p className="mt-2 text-[15px] text-suave">Tente ampliar o preço ou o bairro. Ou me diga o que procura pelo WhatsApp.</p>
            <button type="button" className="botao botao-secundario mt-6" onClick={() => mudar(FILTROS_VAZIOS)}>
              Limpar filtros
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
