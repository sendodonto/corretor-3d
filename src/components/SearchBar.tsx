'use client'

import { useId, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search } from 'lucide-react'
import { bairros, tipos } from '@/data/imoveis'
import { FAIXAS_VENDA } from './PropertyFilters'

/** Busca rápida da home: leva ao catálogo já filtrado. */
export function SearchBar() {
  const id = useId()
  const router = useRouter()
  const [tipo, setTipo] = useState('')
  const [bairro, setBairro] = useState('')
  const [quartos, setQuartos] = useState('')
  const [preco, setPreco] = useState('')

  const buscar = (e: React.FormEvent) => {
    e.preventDefault()
    const q = new URLSearchParams()
    if (tipo) q.set('tipo', tipo)
    if (bairro) q.set('bairro', bairro)
    if (quartos) q.set('quartos', quartos)
    if (preco) q.set('preco', preco)
    router.push(`/imoveis${q.size ? `?${q}` : ''}`)
  }

  const campo = 'w-full appearance-none bg-transparent text-[15px] font-medium text-tinta outline-none'
  const bloco = 'relative grid gap-0.5 rounded-2xl px-4 py-3 transition-colors hover:bg-nevoa focus-within:bg-nevoa md:rounded-full md:px-6'
  return (
    <form
      onSubmit={buscar}
      role="search"
      aria-label="Buscar imóveis"
      className="grid gap-1 rounded-[26px] bg-white p-2 shadow-[0_0_0_1px_var(--color-linha),0_24px_60px_-30px_rgb(0_0_0/0.25)] md:grid-cols-[1fr_1fr_0.8fr_1fr_auto] md:items-center md:rounded-full"
    >
      <label className={bloco} htmlFor={`${id}-t`}>
        <span className="text-[12px] text-suave">Tipo</span>
        <select id={`${id}-t`} className={campo} value={tipo} onChange={(e) => setTipo(e.target.value)}>
          <option value="">Todos os tipos</option>
          {tipos.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
      </label>
      <label className={bloco} htmlFor={`${id}-b`}>
        <span className="text-[12px] text-suave">Bairro</span>
        <select id={`${id}-b`} className={campo} value={bairro} onChange={(e) => setBairro(e.target.value)}>
          <option value="">Qualquer bairro</option>
          {bairros.map((b) => (
            <option key={b}>{b}</option>
          ))}
        </select>
      </label>
      <label className={bloco} htmlFor={`${id}-q`}>
        <span className="text-[12px] text-suave">Quartos</span>
        <select id={`${id}-q`} className={campo} value={quartos} onChange={(e) => setQuartos(e.target.value)}>
          <option value="">Qualquer</option>
          {[1, 2, 3, 4].map((q) => (
            <option key={q} value={q}>
              {q}+ quartos
            </option>
          ))}
        </select>
      </label>
      <label className={bloco} htmlFor={`${id}-p`}>
        <span className="text-[12px] text-suave">Preço de venda</span>
        <select id={`${id}-p`} className={campo} value={preco} onChange={(e) => setPreco(e.target.value)}>
          <option value="">Qualquer valor</option>
          {FAIXAS_VENDA.map((p) => (
            <option key={p.valor} value={p.valor}>
              {p.rotulo}
            </option>
          ))}
        </select>
      </label>
      <button type="submit" className="botao botao-primario mt-1 !min-h-14 md:mt-0 md:!size-14 md:!p-0">
        <Search size={19} strokeWidth={1.8} aria-hidden />
        <span className="md:sr-only">Buscar imóveis</span>
      </button>
    </form>
  )
}
