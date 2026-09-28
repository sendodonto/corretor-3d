'use client'

import { createContext, useCallback, useContext, useEffect, useId, useRef, useState, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { CalendarDays, X } from 'lucide-react'
import { linkWhatsApp } from '@/lib/whatsapp'

/*
 * <ScheduleVisit /> — agendamento de visita. Não há servidor: o pedido
 * (nome, WhatsApp, data, horário, imóvel) vira uma mensagem de WhatsApp
 * pronta, que o visitante só precisa enviar.
 */

type Contexto = { abrir: (imovel?: string) => void }
const Ctx = createContext<Contexto>({ abrir: () => {} })
export const useAgendamento = () => useContext(Ctx)

const HORARIOS = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00', '18:00']

export function AgendamentoProvider({ children }: { children: ReactNode }) {
  const [aberto, setAberto] = useState(false)
  const [imovel, setImovel] = useState<string | undefined>()
  const abrir = useCallback((i?: string) => {
    setImovel(i)
    setAberto(true)
  }, [])
  return (
    <Ctx.Provider value={{ abrir }}>
      {children}
      <AnimatePresence>{aberto && <ScheduleVisit imovel={imovel} aoFechar={() => setAberto(false)} />}</AnimatePresence>
    </Ctx.Provider>
  )
}

function hojeISO(somaDias = 0) {
  const d = new Date()
  d.setDate(d.getDate() + somaDias)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}
const mascararTelefone = (v: string) => {
  const d = v.replace(/\D/g, '').slice(0, 11)
  if (d.length <= 2) return d
  if (d.length <= 7) return `(${d.slice(0, 2)}) ${d.slice(2)}`
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`
}

export function ScheduleVisit({ imovel, aoFechar }: { imovel?: string; aoFechar: () => void }) {
  const id = useId()
  const painel = useRef<HTMLDivElement>(null)
  const [nome, setNome] = useState('')
  const [fone, setFone] = useState('')
  const [data, setData] = useState(hojeISO(1))
  const [hora, setHora] = useState('10:00')
  const [erro, setErro] = useState('')

  useEffect(() => {
    const anterior = document.activeElement as HTMLElement | null
    document.documentElement.classList.add('trava-rolagem')
    painel.current?.querySelector<HTMLInputElement>('input')?.focus()
    const tecla = (e: KeyboardEvent) => {
      if (e.key === 'Escape') aoFechar()
      // mantém o foco dentro do diálogo
      if (e.key === 'Tab' && painel.current) {
        const f = painel.current.querySelectorAll<HTMLElement>('button, input, select, a[href]')
        const [primeiro, ultimo] = [f[0], f[f.length - 1]]
        if (e.shiftKey && document.activeElement === primeiro) {
          e.preventDefault()
          ultimo.focus()
        } else if (!e.shiftKey && document.activeElement === ultimo) {
          e.preventDefault()
          primeiro.focus()
        }
      }
    }
    addEventListener('keydown', tecla)
    return () => {
      removeEventListener('keydown', tecla)
      document.documentElement.classList.remove('trava-rolagem')
      anterior?.focus()
    }
  }, [aoFechar])

  const enviar = (e: React.FormEvent) => {
    e.preventDefault()
    if (nome.trim().length < 2) return setErro('Informe seu nome.')
    if (fone.replace(/\D/g, '').length < 10) return setErro('Informe um WhatsApp com DDD.')
    const [a, m, d] = data.split('-')
    const msg = [
      'Olá! Quero agendar uma visita.',
      imovel ? `Imóvel: ${imovel}` : null,
      `Nome: ${nome.trim()}`,
      `WhatsApp: ${fone}`,
      `Data: ${d}/${m}/${a}`,
      `Horário: ${hora}`,
    ]
      .filter(Boolean)
      .join('\n')
    window.open(linkWhatsApp(msg), '_blank', 'noopener')
    aoFechar()
  }

  return (
    <motion.div
      className="fixed inset-0 z-[300] flex items-end justify-center sm:items-center sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className="absolute inset-0 bg-black/35 backdrop-blur-[2px]" onClick={aoFechar} aria-hidden />
      <motion.div
        ref={painel}
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${id}-t`}
        className="relative w-full max-w-[460px] rounded-t-[26px] bg-white p-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] shadow-2xl sm:rounded-[26px] sm:p-8"
        initial={{ y: 40, opacity: 0.6 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 40, opacity: 0 }}
        transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
      >
        <button type="button" onClick={aoFechar} className="absolute right-4 top-4 grid size-10 place-items-center rounded-full text-suave hover:bg-nevoa hover:text-tinta" aria-label="Fechar">
          <X size={20} strokeWidth={1.6} />
        </button>
        <span className="grid size-11 place-items-center rounded-full bg-acento-claro text-acento">
          <CalendarDays size={20} strokeWidth={1.6} />
        </span>
        <h2 id={`${id}-t`} className="mt-4 text-[24px] font-semibold tracking-[-0.03em]">
          Agendar visita
        </h2>
        <p className="mt-1.5 text-[15px] leading-relaxed text-suave">
          {imovel ? <>Visita ao imóvel <strong className="font-medium text-tinta">{imovel}</strong>. </> : null}
          Escolha dia e horário; a confirmação chega pelo WhatsApp.
        </p>

        <form onSubmit={enviar} className="mt-6 grid gap-4" noValidate>
          <div>
            <label htmlFor={`${id}-n`} className="rotulo-campo">Nome</label>
            <input id={`${id}-n`} className="campo" value={nome} onChange={(e) => setNome(e.target.value)} autoComplete="name" required />
          </div>
          <div>
            <label htmlFor={`${id}-w`} className="rotulo-campo">WhatsApp</label>
            <input
              id={`${id}-w`}
              className="campo num"
              inputMode="tel"
              autoComplete="tel-national"
              placeholder="(51) 99999-9999"
              value={fone}
              onChange={(e) => setFone(mascararTelefone(e.target.value))}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor={`${id}-d`} className="rotulo-campo">Data</label>
              <input id={`${id}-d`} type="date" className="campo num" min={hojeISO()} value={data} onChange={(e) => setData(e.target.value)} required />
            </div>
            <div>
              <label htmlFor={`${id}-h`} className="rotulo-campo">Horário</label>
              <select id={`${id}-h`} className="campo num" value={hora} onChange={(e) => setHora(e.target.value)}>
                {HORARIOS.map((h) => (
                  <option key={h}>{h}</option>
                ))}
              </select>
            </div>
          </div>
          {erro && (
            <p role="alert" className="text-[14px] text-[#b3261e]">
              {erro}
            </p>
          )}
          <button type="submit" className="botao botao-acento mt-2 w-full">
            Enviar pelo WhatsApp
          </button>
          <p className="text-center text-[12.5px] text-suave">Seus dados vão só na mensagem. Nada fica salvo no site.</p>
        </form>
      </motion.div>
    </motion.div>
  )
}
