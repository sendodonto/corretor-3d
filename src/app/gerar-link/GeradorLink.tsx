'use client'

import { useId, useRef, useState } from 'react'
import { Check, Copy, ExternalLink, ImagePlus, LoaderCircle, X } from 'lucide-react'
import { site } from '@/config/site'
import { enviarFoto, fotoDisponivel, urlDaFoto } from '@/lib/fotos'

/** Escolha da foto: envia na hora e mostra a miniatura. */
function CampoFoto({ arquivo, aoMudar }: { arquivo: string; aoMudar: (nome: string) => void }) {
  const entrada = useRef<HTMLInputElement>(null)
  const [estado, setEstado] = useState<'livre' | 'enviando' | 'erro'>('livre')
  const [erro, setErro] = useState('')
  const [previa, setPrevia] = useState('')

  const escolher = async (f: File | undefined) => {
    if (!f) return
    setPrevia(URL.createObjectURL(f))
    setEstado('enviando')
    try {
      aoMudar(await enviarFoto(f))
      setEstado('livre')
    } catch (e) {
      setErro(e instanceof Error ? e.message : 'O envio falhou.')
      setEstado('erro')
      aoMudar('')
    }
  }
  const limpar = () => {
    aoMudar('')
    setPrevia('')
    setEstado('livre')
    if (entrada.current) entrada.current.value = ''
  }

  if (!fotoDisponivel()) return <p className="text-[14px] text-suave">Envio de fotos não configurado neste site.</p>
  const imagem = previa || (arquivo ? urlDaFoto(arquivo) : '')
  return (
    <div className="flex items-center gap-4">
      <button
        type="button"
        onClick={() => entrada.current?.click()}
        className="relative grid size-24 flex-none place-items-center overflow-hidden rounded-2xl bg-white shadow-[inset_0_0_0_1.5px_var(--color-linha-forte)] transition-shadow hover:shadow-[inset_0_0_0_1.5px_var(--color-tinta)]"
        aria-label={imagem ? 'Trocar foto' : 'Escolher foto'}
      >
        {imagem ? <img src={imagem} alt="" className="size-full object-cover" /> : <ImagePlus size={26} strokeWidth={1.5} className="text-suave" aria-hidden />}
        {estado === 'enviando' && (
          <span className="absolute inset-0 grid place-items-center bg-white/70">
            <LoaderCircle size={24} strokeWidth={1.8} className="animate-spin" aria-hidden />
          </span>
        )}
      </button>
      <div className="min-w-0 text-[14px]">
        {estado === 'enviando' && <p className="text-suave">Enviando foto…</p>}
        {estado === 'erro' && <p role="alert" className="text-[#b3261e]">{erro}</p>}
        {estado === 'livre' && (arquivo ? <p className="font-medium text-acento">Foto enviada.</p> : <p className="text-suave">Toque no quadrado para escolher uma foto. Sem foto, aparecem as iniciais.</p>)}
        {(arquivo || estado === 'erro') && (
          <button type="button" onClick={limpar} className="mt-2 inline-flex items-center gap-1 text-suave hover:text-tinta">
            <X size={14} strokeWidth={2} aria-hidden />
            Remover foto
          </button>
        )}
      </div>
      <input ref={entrada} type="file" accept="image/*" className="hidden" onChange={(e) => escolher(e.target.files?.[0])} />
    </div>
  )
}

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
  if (foto) q.set('f', foto)
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
        <p className="rotulo-campo">Foto do corretor (opcional)</p>
        <CampoFoto arquivo={foto} aoMudar={setFoto} />
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
