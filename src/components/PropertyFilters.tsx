'use client'

import { useEffect, useId, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { SlidersHorizontal, X } from 'lucide-react'
import { bairros, tipos, type Imovel } from '@/data/imoveis'

export interface Filtros {
  finalidade: '' | 'Venda' | 'Aluguel'
  tipo: string
  bairro: string
  quartos: number
  precoMax: number
  tour3d: boolean
}
export const FILTROS_VAZIOS: Filtros = { finalidade: '', tipo: '', bairro: '', quartos: 0, precoMax: 0, tour3d: false }

export const FAIXAS_VENDA = [
  { valor: 1_000_000, rotulo: 'Até R$ 1 mi' },
  { valor: 2_000_000, rotulo: 'Até R$ 2 mi' },
  { valor: 3_500_000, rotulo: 'Até R$ 3,5 mi' },
  { valor: 5_000_000, rotulo: 'Até R$ 5 mi' },
]
export const FAIXAS_ALUGUEL = [
  { valor: 3_000, rotulo: 'Até R$ 3 mil/mês' },
  { valor: 5_000, rotulo: 'Até R$ 5 mil/mês' },
  { valor: 10_000, rotulo: 'Até R$ 10 mil/mês' },
]

export function filtrar(lista: Imovel[], f: Filtros) {
  return lista.filter(
    (i) =>
      (!f.finalidade || i.finalidade === f.finalidade) &&
      (!f.tipo || i.tipo === f.tipo) &&
      (!f.bairro || i.bairro === f.bairro) &&
      (!f.quartos || i.quartos >= f.quartos) &&
      (!f.precoMax || i.preco <= f.precoMax) &&
      (!f.tour3d || !!i.modelo3d),
  )
}

export const contarAtivos = (f: Filtros) =>
  [f.finalidade, f.tipo, f.bairro, f.quartos, f.precoMax, f.tour3d].filter(Boolean).length

function Campos({ f, mudar, id }: { f: Filtros; mudar: (p: Partial<Filtros>) => void; id: string }) {
  const faixas = f.finalidade === 'Aluguel' ? FAIXAS_ALUGUEL : FAIXAS_VENDA
  return (
    <>
      <fieldset>
        <legend className="rotulo-campo">Finalidade</legend>
        <div className="grid grid-cols-3 gap-1 rounded-full bg-nevoa p-1">
          {(['', 'Venda', 'Aluguel'] as const).map((v) => (
            <button
              key={v || 'todas'}
              type="button"
              aria-pressed={f.finalidade === v}
              onClick={() => mudar({ finalidade: v, precoMax: 0 })}
              className={`min-h-10 rounded-full text-[14px] font-medium transition-colors ${
                f.finalidade === v ? 'bg-white text-tinta shadow-[0_1px_3px_rgb(0_0_0/0.1)]' : 'text-suave hover:text-tinta'
              }`}
            >
              {v || 'Todas'}
            </button>
          ))}
        </div>
      </fieldset>
      <div>
        <label htmlFor={`${id}-t`} className="rotulo-campo">Tipo</label>
        <select id={`${id}-t`} className="campo" value={f.tipo} onChange={(e) => mudar({ tipo: e.target.value })}>
          <option value="">Todos</option>
          {tipos.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor={`${id}-b`} className="rotulo-campo">Bairro</label>
        <select id={`${id}-b`} className="campo" value={f.bairro} onChange={(e) => mudar({ bairro: e.target.value })}>
          <option value="">Todos</option>
          {bairros.map((b) => (
            <option key={b}>{b}</option>
          ))}
        </select>
      </div>
      <fieldset>
        <legend className="rotulo-campo">Quartos</legend>
        <div className="grid grid-cols-5 gap-1.5">
          {[0, 1, 2, 3, 4].map((q) => (
            <button
              key={q}
              type="button"
              aria-pressed={f.quartos === q}
              onClick={() => mudar({ quartos: q })}
              className={`num min-h-11 rounded-xl text-[14px] font-medium transition-colors ${
                f.quartos === q ? 'bg-tinta text-white' : 'bg-white text-tinta-2 shadow-[inset_0_0_0_1px_var(--color-linha-forte)] hover:shadow-[inset_0_0_0_1px_var(--color-tinta)]'
              }`}
            >
              {q === 0 ? 'Todos' : `${q}+`}
            </button>
          ))}
        </div>
      </fieldset>
      <div>
        <label htmlFor={`${id}-p`} className="rotulo-campo">Preço</label>
        <select id={`${id}-p`} className="campo" value={f.precoMax} onChange={(e) => mudar({ precoMax: Number(e.target.value) })}>
          <option value={0}>Qualquer valor</option>
          {faixas.map((p) => (
            <option key={p.valor} value={p.valor}>
              {p.rotulo}
            </option>
          ))}
        </select>
      </div>
      <label className="flex min-h-12 cursor-pointer items-center justify-between gap-3 rounded-xl bg-white px-4 shadow-[inset_0_0_0_1px_var(--color-linha-forte)]">
        <span className="text-[14.5px] font-medium">Só imóveis com tour 3D</span>
        <input type="checkbox" className="peer sr-only" checked={f.tour3d} onChange={(e) => mudar({ tour3d: e.target.checked })} />
        <span className="relative h-6 w-10 rounded-full bg-linha-forte transition-colors after:absolute after:left-0.5 after:top-0.5 after:size-5 after:rounded-full after:bg-white after:shadow after:transition-transform peer-checked:bg-acento peer-checked:after:translate-x-4 peer-focus-visible:outline-2 peer-focus-visible:outline-acento" aria-hidden />
      </label>
    </>
  )
}

/**
 * <PropertyFilters /> — desktop: coluna lateral fixa. Celular: botão
 * "Filtros" que abre um painel em tela cheia com o total de resultados.
 */
export function PropertyFilters({
  filtros,
  aoMudar,
  total,
  contar,
}: {
  filtros: Filtros
  aoMudar: (f: Filtros) => void
  total: number
  contar: (f: Filtros) => number
}) {
  const id = useId()
  const [aberto, setAberto] = useState(false)
  const [rascunho, setRascunho] = useState(filtros)
  const ativos = contarAtivos(filtros)

  useEffect(() => {
    if (!aberto) return
    document.documentElement.classList.add('trava-rolagem')
    const tecla = (e: KeyboardEvent) => e.key === 'Escape' && setAberto(false)
    addEventListener('keydown', tecla)
    return () => {
      document.documentElement.classList.remove('trava-rolagem')
      removeEventListener('keydown', tecla)
    }
  }, [aberto])

  return (
    <>
      {/* desktop */}
      <aside className="sticky top-[calc(var(--topo)+1.5rem)] hidden self-start lg:block" aria-label="Filtros">
        <div className="grid gap-5">
          <Campos id={`${id}-d`} f={filtros} mudar={(p) => aoMudar({ ...filtros, ...p })} />
          {ativos > 0 && (
            <button type="button" onClick={() => aoMudar(FILTROS_VAZIOS)} className="justify-self-start text-[14px] font-medium text-acento hover:underline">
              Limpar filtros
            </button>
          )}
        </div>
      </aside>

      {/* celular */}
      <div className="flex items-center justify-between gap-3 lg:hidden">
        <p className="num text-[14.5px] text-suave">
          {total} {total === 1 ? 'imóvel' : 'imóveis'}
        </p>
        <button
          type="button"
          onClick={() => {
            setRascunho(filtros)
            setAberto(true)
          }}
          className="botao botao-secundario !min-h-11"
        >
          <SlidersHorizontal size={17} strokeWidth={1.6} aria-hidden />
          Filtros
          {ativos > 0 && <span className="num grid size-5 place-items-center rounded-full bg-tinta text-[11px] text-white">{ativos}</span>}
        </button>
      </div>

      <AnimatePresence>
        {aberto && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Filtros"
            className="fixed inset-0 z-[300] flex flex-col bg-papel lg:hidden"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', bounce: 0, duration: 0.42 }}
          >
            <div className="flex items-center justify-between border-b border-linha px-5 py-3">
              <button type="button" onClick={() => setRascunho(FILTROS_VAZIOS)} className="min-h-11 text-[15px] font-medium text-acento">
                Limpar
              </button>
              <p className="text-[16px] font-semibold tracking-[-0.02em]">Filtros</p>
              <button type="button" onClick={() => setAberto(false)} className="grid size-11 place-items-center rounded-full hover:bg-nevoa" aria-label="Fechar filtros">
                <X size={22} strokeWidth={1.6} />
              </button>
            </div>
            <div className="grid flex-1 content-start gap-6 overflow-y-auto px-5 py-6">
              <Campos id={`${id}-m`} f={rascunho} mudar={(p) => setRascunho((r) => ({ ...r, ...p }))} />
            </div>
            <div className="border-t border-linha px-5 pb-[max(1rem,env(safe-area-inset-bottom))] pt-4">
              <button
                type="button"
                className="botao botao-primario w-full"
                onClick={() => {
                  aoMudar(rascunho)
                  setAberto(false)
                }}
              >
                Ver {contar(rascunho)} {contar(rascunho) === 1 ? 'imóvel' : 'imóveis'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
