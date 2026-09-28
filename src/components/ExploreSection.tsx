'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Box, Hand, Layers, MousePointerClick, ZoomIn } from 'lucide-react'
import { modos, type ModoId } from '@/three/conteudo/casa'
import { Property3DViewer } from './Property3DViewer'
import { Reveal } from './Reveal'

const ICONES = { externa: Box, planta: Layers, ambientes: MousePointerClick }
const TEXTOS: Record<ModoId, string> = {
  externa: 'Gire em volta da casa e toque nos números para ver garagem, entrada, varanda e lazer.',
  planta: 'Sem telhado e sem o andar de cima: o térreo inteiro visto de cima.',
  ambientes: 'Entre na sala, na cozinha, na suíte e no closet. Portas e gavetas abrem ao tocar.',
}
const COMO_USAR = [
  { icone: Hand, texto: 'Arraste para girar' },
  { icone: ZoomIn, texto: 'Pinça ou roda do mouse para aproximar' },
  { icone: MousePointerClick, texto: 'Toque nos números para ver detalhes' },
]

/** "Não imagine. Explore." — um seletor de modo, uma frase e o 3D. */
export function ExploreSection() {
  const [modo, setModo] = useState<ModoId>('externa')
  return (
    <section id="explore" className="scroll-mt-[var(--topo)] py-24 md:py-32">
      <div className="mx-auto max-w-[1240px] px-5 md:px-8">
        <Reveal className="mx-auto max-w-[640px] text-center">
          <p className="sobretitulo">Tour 3D</p>
          <h2 className="titulo-l mt-3">Não imagine. Explore.</h2>
          <p className="texto-corpo mt-4">Por fora, por cima ou por dentro: escolha como quer ver a casa.</p>
        </Reveal>

        <Reveal delay={0.06} className="mt-10 flex flex-col items-center">
          <div role="tablist" aria-label="Modo do tour" className="inline-flex rounded-full bg-white p-1 shadow-[0_0_0_1px_var(--color-linha)]">
            {modos.map((m) => {
              const Icone = ICONES[m.id]
              const ativo = modo === m.id
              return (
                <button
                  key={m.id}
                  type="button"
                  role="tab"
                  aria-selected={ativo}
                  onClick={() => setModo(m.id)}
                  className={`inline-flex min-h-11 items-center gap-2 rounded-full px-4 text-[14px] font-medium transition-colors sm:px-5 sm:text-[15px] ${
                    ativo ? 'bg-tinta text-white' : 'text-suave hover:text-tinta'
                  }`}
                >
                  <Icone size={16} strokeWidth={1.7} aria-hidden className="hidden sm:block" />
                  {m.rotulo}
                </button>
              )
            })}
          </div>
          <p className="mt-4 min-h-[3em] max-w-[52ch] text-center text-[15px] leading-relaxed text-suave sm:min-h-0" aria-live="polite">
            {TEXTOS[modo]}
          </p>
        </Reveal>

        <Reveal delay={0.1} className="mt-6 h-[min(76vh,700px)] min-h-[440px]">
          <Property3DViewer
            modelo="casa"
            nome="Casa Alameda"
            modoControlado={modo}
            aoTrocarModo={setModo}
            tamanho="5 MB"
            poster={{ paisagem: '/posters/casa-explore.webp', retrato: '/posters/casa-explore-retrato.webp' }}
            className="h-full"
          />
        </Reveal>

        <div className="mt-6 flex flex-col items-center justify-between gap-4 md:flex-row">
          <ul className="hidden flex-wrap gap-x-6 gap-y-2 text-[13.5px] text-suave md:flex">
            {COMO_USAR.map((c) => (
              <li key={c.texto} className="inline-flex items-center gap-2">
                <c.icone size={15} strokeWidth={1.7} aria-hidden />
                {c.texto}
              </li>
            ))}
          </ul>
          <Link href="/imoveis/casa-alameda" className="inline-flex items-center gap-1.5 text-[15px] font-medium text-acento hover:underline">
            Ver a ficha da Casa Alameda
            <ArrowRight size={16} strokeWidth={1.8} aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  )
}
