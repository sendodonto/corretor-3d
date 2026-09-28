'use client'

import { BadgeCheck } from 'lucide-react'
import { site } from '@/config/site'
import { linkWhatsApp } from '@/lib/whatsapp'
import { asset } from '@/lib/base'
import { IconeWhatsApp } from './WhatsAppCTA'
import { useAgendamento } from './ScheduleVisit'

const iniciais = (nome: string) =>
  nome
    .split(' ')
    .filter(Boolean)
    .map((p) => p[0])
    .slice(0, 2)
    .join('')

/** Foto real do corretor quando existir; até lá, monograma (nunca foto de banco). */
function Retrato({ grande = false }: { grande?: boolean }) {
  const c = site.corretor
  const tam = grande ? 'size-full' : 'size-14'
  if (c.foto) return <img src={asset(c.foto)} alt={c.nome} className={`${tam} rounded-[inherit] object-cover`} />
  return (
    <span
      className={`${tam} grid place-items-center rounded-[inherit] bg-[radial-gradient(120%_120%_at_30%_20%,#2a7a65_0%,#1e5f4e_45%,#123a30_100%)] font-semibold tracking-[-0.04em] text-white ${
        grande ? 'text-[clamp(4rem,9vw,7rem)]' : 'text-[20px]'
      }`}
      aria-hidden
    >
      {iniciais(c.nome)}
    </span>
  )
}

/** Perfil do corretor. `compacto` = cartão lateral da página do imóvel. */
export function AgentProfile({ compacto = false, imovel, semAcoes = false }: { compacto?: boolean; imovel?: string; semAcoes?: boolean }) {
  const c = site.corretor
  const { abrir } = useAgendamento()
  const msg = imovel ? site.mensagens.imovel(imovel) : site.mensagens.geral

  if (compacto) {
    return (
      <aside className="rounded-[var(--radius-cartao)] bg-white p-6 shadow-[0_0_0_1px_var(--color-linha)]">
        <div className="flex items-center gap-4">
          <span className="block size-14 overflow-hidden rounded-full">
            <Retrato />
          </span>
          <div>
            <p className="text-[16px] font-semibold tracking-[-0.02em]">{c.nome}</p>
            <p className="text-[13.5px] text-suave">
              {c.cargo} · {c.creci ? `CRECI ${c.creci}` : 'CRECI em registro'}
            </p>
          </div>
        </div>
        <p className="mt-4 text-[14.5px] leading-relaxed text-suave">
          Respondo em horário comercial. Posso enviar planta, 3D e documentação antes da visita.
        </p>
        {!semAcoes && <div className="mt-5 grid gap-2">
          <button type="button" onClick={() => abrir(imovel)} className="botao botao-primario w-full">
            Agendar visita
          </button>
          <a href={linkWhatsApp(msg)} target="_blank" rel="noopener" className="botao botao-secundario w-full">
            <span className="text-[#1faa55]">
              <IconeWhatsApp size={18} />
            </span>
            Falar no WhatsApp
          </a>
        </div>}
      </aside>
    )
  }

  return (
    <div className="grid items-center gap-10 md:grid-cols-[0.9fr_1.1fr] md:gap-16">
      <div className="relative aspect-[5/4] overflow-hidden rounded-[28px] md:aspect-[4/5] md:max-w-[440px]">
        <Retrato grande />
        {!c.foto && (
          <span className="absolute bottom-4 left-4 rounded-full bg-black/30 px-3 py-1.5 text-[12px] text-white/85 backdrop-blur">
            Foto do corretor em breve
          </span>
        )}
      </div>
      <div>
        <p className="sobretitulo">Seu corretor</p>
        <h2 className="titulo-l mt-3">{c.nome}</h2>
        <p className="mt-2 inline-flex items-center gap-1.5 text-[15px] text-tinta-2">
          <BadgeCheck size={17} strokeWidth={1.6} className="text-acento" aria-hidden />
          {c.cargo} · {c.creci ? `CRECI ${c.creci}` : 'CRECI em registro'} · {site.cidade}
        </p>
        <div className="mt-6 grid max-w-[56ch] gap-4">
          {c.bio.map((p) => (
            <p key={p} className="texto-corpo">
              {p}
            </p>
          ))}
        </div>
        <ul className="mt-6 flex flex-wrap gap-2">
          {c.especialidades.map((e) => (
            <li key={e} className="rounded-full bg-white px-3.5 py-1.5 text-[13.5px] text-tinta-2 shadow-[0_0_0_1px_var(--color-linha)]">
              {e}
            </li>
          ))}
        </ul>
        {c.numeros.length > 0 && (
          <dl className="mt-8 grid grid-cols-3 gap-4 border-t border-linha pt-6">
            {c.numeros.map((n) => (
              <div key={n.rotulo}>
                <dt className="text-[13px] text-suave">{n.rotulo}</dt>
                <dd className="num mt-1 text-[26px] font-semibold tracking-[-0.03em]">{n.valor}</dd>
              </div>
            ))}
          </dl>
        )}
        <div className="mt-8 flex flex-wrap gap-3">
          <a href={linkWhatsApp(msg)} target="_blank" rel="noopener" className="botao botao-primario">
            <IconeWhatsApp size={18} />
            Falar no WhatsApp
          </a>
          <button type="button" onClick={() => abrir()} className="botao botao-secundario">
            Agendar visita
          </button>
        </div>
      </div>
    </div>
  )
}
