'use client'

import { site } from '@/config/site'
import { useCorretor } from '@/lib/personalizacao'
import { Reveal } from './Reveal'

/** Depoimentos (só aparecem com a lista preenchida no config). */
export function Depoimentos() {
  const c = useCorretor()
  if (!site.depoimentos.length) return null
  // Os textos citam a corretora da demonstração pelo primeiro nome.
  const nomeDemo = site.corretor.nome.split(' ')[0]
  return (
    <section className="bg-white py-24 md:py-32" aria-labelledby="depoimentos">
      <div className="mx-auto max-w-[1240px] px-5 md:px-8">
        <Reveal>
          <p className="sobretitulo">Depoimentos</p>
          <h2 id="depoimentos" className="titulo-l mt-3">
            Quem já comprou
          </h2>
        </Reveal>
        <div className="trilho mt-12">
          {site.depoimentos.map((d, i) => (
            <Reveal key={d.nome} delay={i * 0.06}>
              <figure className="h-full rounded-[var(--radius-cartao)] bg-papel p-7">
                <blockquote className="text-[17px] leading-relaxed tracking-[-0.01em]">“{d.texto.replaceAll(nomeDemo, c.primeiroNome)}”</blockquote>
                <figcaption className="mt-6 text-[14px]">
                  <span className="font-semibold">{d.nome}</span>
                  <span className="block text-suave">{d.contexto}</span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
