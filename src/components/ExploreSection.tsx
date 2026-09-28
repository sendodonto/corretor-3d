'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Box, Layers, MousePointerClick } from 'lucide-react'
import { modos, type ModoId } from '@/three/conteudo/casa'
import { Property3DViewer } from './Property3DViewer'
import { Reveal } from './Reveal'

const ICONES = { externa: Box, planta: Layers, ambientes: MousePointerClick }
const TEXTOS: Record<ModoId, string> = {
  externa: 'Gire em volta da casa, aproxime da fachada e toque nos pontos para ver garagem, entrada, varanda e lazer.',
  planta: 'Tiramos o telhado e o andar de cima: o térreo inteiro, de cima, com a distribuição real dos cômodos.',
  ambientes: 'Entre na sala, na cozinha, na suíte e no closet. Portas e gavetas abrem quando você toca no ponto.',
}

/** "Não imagine. Explore." — os três modos do tour, com o 3D ao lado. */
export function ExploreSection() {
  const [modo, setModo] = useState<ModoId>('externa')
  return (
    <section id="explore" className="scroll-mt-[var(--topo)] py-24 md:py-32">
      <div className="mx-auto max-w-[1240px] px-5 md:px-8">
        <Reveal className="max-w-[720px]">
          <p className="sobretitulo">Tour 3D</p>
          <h2 className="titulo-l mt-3">Não imagine. Explore.</h2>
          <p className="texto-corpo mt-4 max-w-[54ch]">
            Foto mostra o que o fotógrafo escolheu. No 3D, quem escolhe o ângulo é você: por fora, por cima ou por dentro,
            no seu tempo, antes de sair de casa.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-6 lg:grid-cols-[minmax(0,0.36fr)_minmax(0,0.64fr)] lg:gap-10">
          <div className="grid content-start gap-2" role="tablist" aria-label="Modos do tour">
            {modos.map((m, i) => {
              const Icone = ICONES[m.id]
              const ativo = modo === m.id
              return (
                <Reveal key={m.id} delay={i * 0.06}>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={ativo}
                    onClick={() => setModo(m.id)}
                    className={`group w-full rounded-[18px] p-5 text-left transition-[background-color,box-shadow] duration-300 ${
                      ativo ? 'bg-white shadow-[0_0_0_1px_var(--color-linha),0_16px_40px_-24px_rgb(0_0_0/0.25)]' : 'hover:bg-white/60'
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <span
                        className={`grid size-10 place-items-center rounded-full transition-colors ${
                          ativo ? 'bg-acento text-white' : 'bg-nevoa text-tinta-2'
                        }`}
                      >
                        <Icone size={18} strokeWidth={1.6} aria-hidden />
                      </span>
                      <span className="text-[17px] font-semibold tracking-[-0.02em]">{m.rotulo}</span>
                    </span>
                    <span
                      className={`grid transition-[grid-template-rows,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                        ativo ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0 lg:grid-rows-[1fr] lg:opacity-60'
                      }`}
                    >
                      <span className="overflow-hidden">
                        <span className="block pt-3 text-[15px] leading-relaxed text-suave">{TEXTOS[m.id]}</span>
                      </span>
                    </span>
                  </button>
                </Reveal>
              )
            })}
            <Reveal delay={0.2}>
              <Link href="/imoveis/casa-alameda" className="mt-4 inline-flex items-center gap-1.5 px-5 text-[15px] font-medium text-acento hover:underline">
                Ver a ficha da Casa Alameda
                <ArrowRight size={16} strokeWidth={1.8} aria-hidden />
              </Link>
            </Reveal>
          </div>

          <Reveal className="h-[min(78vh,680px)] min-h-[440px] lg:h-[640px]">
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
        </div>
      </div>
    </section>
  )
}
