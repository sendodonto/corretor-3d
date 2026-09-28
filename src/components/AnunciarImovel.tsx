'use client'

import { useId, useState } from 'react'
import { Box, Camera, Megaphone } from 'lucide-react'
import { linkWhatsApp } from '@/lib/whatsapp'
import { Reveal } from './Reveal'

const VANTAGENS = [
  { icone: Box, texto: 'Tour 3D do seu imóvel, para o comprador visitar antes de marcar.' },
  { icone: Camera, texto: 'Fotos profissionais e anúncio nos principais portais.' },
  { icone: Megaphone, texto: 'Divulgação para uma carteira de compradores já qualificados.' },
]

/** Captação: donos de imóvel mandam os dados básicos pelo WhatsApp. */
export function AnunciarImovel() {
  const id = useId()
  const [nome, setNome] = useState('')
  const [tipo, setTipo] = useState('Casa')
  const [finalidade, setFinalidade] = useState('Vender')
  const [bairro, setBairro] = useState('')

  const enviar = (e: React.FormEvent) => {
    e.preventDefault()
    const msg = [
      `Olá! Quero ${finalidade.toLowerCase()} meu imóvel.`,
      `Tipo: ${tipo}`,
      bairro.trim() ? `Bairro: ${bairro.trim()}` : null,
      nome.trim() ? `Nome: ${nome.trim()}` : null,
    ]
      .filter(Boolean)
      .join('\n')
    window.open(linkWhatsApp(msg), '_blank', 'noopener')
  }

  return (
    <section id="anunciar" className="scroll-mt-[var(--topo)] py-24 md:py-32">
      <div className="mx-auto grid max-w-[1240px] gap-12 px-5 md:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
        <Reveal>
          <p className="sobretitulo">Para proprietários</p>
          <h2 className="titulo-l mt-3 max-w-[14ch] text-balance">Quer vender ou alugar seu imóvel?</h2>
          <p className="texto-corpo mt-5 max-w-[48ch]">
            Anuncie com quem mostra o imóvel do jeito que ele merece. Menos visitas curiosas, mais visitas de quem já decidiu.
          </p>
          <ul className="mt-9 grid gap-5">
            {VANTAGENS.map((v) => (
              <li key={v.texto} className="flex items-start gap-4">
                <span className="grid size-10 flex-none place-items-center rounded-full bg-acento-claro text-acento">
                  <v.icone size={18} strokeWidth={1.6} aria-hidden />
                </span>
                <span className="pt-2 text-[15.5px] leading-relaxed text-tinta-2">{v.texto}</span>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={0.08}>
          <form onSubmit={enviar} className="grid gap-4 rounded-[26px] bg-white p-6 shadow-[0_0_0_1px_var(--color-linha),0_24px_60px_-40px_rgb(0_0_0/0.3)] md:p-8">
            <fieldset>
              <legend className="rotulo-campo">Eu quero</legend>
              <div className="grid grid-cols-2 gap-1 rounded-full bg-nevoa p-1">
                {['Vender', 'Alugar'].map((v) => (
                  <button
                    key={v}
                    type="button"
                    aria-pressed={finalidade === v}
                    onClick={() => setFinalidade(v)}
                    className={`min-h-10 rounded-full text-[14px] font-medium transition-colors ${
                      finalidade === v ? 'bg-white text-tinta shadow-[0_1px_3px_rgb(0_0_0/0.1)]' : 'text-suave hover:text-tinta'
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </fieldset>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor={`${id}-t`} className="rotulo-campo">Tipo de imóvel</label>
                <select id={`${id}-t`} className="campo" value={tipo} onChange={(e) => setTipo(e.target.value)}>
                  {['Casa', 'Casa em condomínio', 'Apartamento', 'Cobertura', 'Terreno', 'Sala comercial'].map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor={`${id}-b`} className="rotulo-campo">Bairro</label>
                <input id={`${id}-b`} className="campo" value={bairro} onChange={(e) => setBairro(e.target.value)} placeholder="Ex.: Moinhos de Vento" />
              </div>
            </div>
            <div>
              <label htmlFor={`${id}-n`} className="rotulo-campo">Seu nome</label>
              <input id={`${id}-n`} className="campo" value={nome} onChange={(e) => setNome(e.target.value)} autoComplete="name" />
            </div>
            <button type="submit" className="botao botao-primario mt-2 w-full">
              Enviar pelo WhatsApp
            </button>
            <p className="text-center text-[12.5px] text-suave">Avaliação gratuita e sem compromisso.</p>
          </form>
        </Reveal>
      </div>
    </section>
  )
}
