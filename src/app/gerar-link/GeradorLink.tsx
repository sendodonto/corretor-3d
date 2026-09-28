'use client'

import { useId, useState } from 'react'
import { Check, Copy, ExternalLink } from 'lucide-react'
import { site } from '@/config/site'

const CARGOS = ['Corretora de imóveis', 'Corretor de imóveis', 'Corretagem de imóveis']

function Copiar({ texto, rotulo }: { texto: string; rotulo: string }) {
  const [ok, setOk] = useState(false)
  return (
    <button
      type="button"
      disabled={!texto}
      className="botao botao-primario disabled:opacity-40"
      onClick={async () => {
        await navigator.clipboard?.writeText(texto)
        setOk(true)
        setTimeout(() => setOk(false), 1800)
      }}
    >
      {ok ? <Check size={17} strokeWidth={1.8} aria-hidden /> : <Copy size={17} strokeWidth={1.8} aria-hidden />}
      {ok ? 'Copiado' : rotulo}
    </button>
  )
}

export function GeradorLink() {
  const id = useId()
  const [nome, setNome] = useState('')
  const [marca, setMarca] = useState('')
  const [cargo, setCargo] = useState(CARGOS[0])
  const [foto, setFoto] = useState('')
  const [creci, setCreci] = useState('')

  const q = new URLSearchParams()
  if (nome.trim()) q.set('para', nome.trim())
  if (marca.trim()) q.set('marca', marca.trim())
  if (nome.trim()) q.set('cargo', cargo)
  if (foto.trim()) q.set('foto', foto.trim())
  if (creci.trim()) q.set('creci', creci.trim())
  const link = nome.trim() ? `${site.url}?${q}` : ''
  const primeiro = nome.trim().split(/\s+/)[0]
  const mensagem = link
    ? `${primeiro}, montei uma prévia de como ficaria o seu site, com tour 3D dos imóveis 👇\n\n${link}\n\nOs imóveis ainda são de exemplo; na versão final entram os seus.`
    : ''

  return (
    <div className="mt-10 grid gap-5 [&>*]:min-w-0">
      <div>
        <label htmlFor={`${id}-n`} className="rotulo-campo">Nome do corretor *</label>
        <input id={`${id}-n`} className="campo" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Ana Ferreira" />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor={`${id}-m`} className="rotulo-campo">Nome na marca (opcional)</label>
          <input id={`${id}-m`} className="campo" value={marca} onChange={(e) => setMarca(e.target.value)} placeholder="Padrão: sobrenome" />
        </div>
        <div>
          <label htmlFor={`${id}-c`} className="rotulo-campo">Como aparece</label>
          <select id={`${id}-c`} className="campo" value={cargo} onChange={(e) => setCargo(e.target.value)}>
            {CARGOS.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <label htmlFor={`${id}-f`} className="rotulo-campo">Link da foto (opcional)</label>
        <input id={`${id}-f`} className="campo" value={foto} onChange={(e) => setFoto(e.target.value)} placeholder="https://… (sem foto aparecem as iniciais)" />
      </div>
      <div>
        <label htmlFor={`${id}-r`} className="rotulo-campo">CRECI real (opcional)</label>
        <input id={`${id}-r`} className="campo" value={creci} onChange={(e) => setCreci(e.target.value)} placeholder="Sem CRECI, ele não aparece" />
      </div>

      <div className="mt-4 grid gap-5 rounded-[var(--radius-cartao)] bg-white p-6 shadow-[0_0_0_1px_var(--color-linha)] [&>*]:min-w-0">
          <div>
            <p className="rotulo-campo">Link</p>
            <p className={`truncate rounded-xl bg-papel p-3 text-[14px] ${link ? '' : 'text-suave'}`} title={link}>
              {link || 'Digite o nome do corretor para gerar o link'}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Copiar texto={link} rotulo="Copiar link" />
              <a
                href={link || undefined}
                target="_blank"
                rel="noopener"
                aria-disabled={!link}
                className={`botao botao-secundario ${link ? '' : 'pointer-events-none opacity-40'}`}
              >
                <ExternalLink size={17} strokeWidth={1.8} aria-hidden />
                Abrir prévia
              </a>
            </div>
          </div>
          <div>
            <p className="rotulo-campo">Mensagem sugerida</p>
            <p className="h-40 overflow-y-auto whitespace-pre-line [overflow-wrap:anywhere] rounded-xl bg-papel p-3 text-[14px] leading-relaxed">
              {mensagem || <span className="text-suave">A mensagem aparece aqui.</span>}
            </p>
            <div className="mt-3">
              <Copiar texto={mensagem} rotulo="Copiar mensagem" />
            </div>
          </div>
      </div>
    </div>
  )
}
