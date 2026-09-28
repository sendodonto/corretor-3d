'use client'

import { useAgendamento } from './ScheduleVisit'

/** Botão que abre o agendamento (para usar dentro de componentes de servidor). */
export function BotaoAgendar({ imovel, className = 'botao botao-secundario', children = 'Agendar visita' }: { imovel?: string; className?: string; children?: React.ReactNode }) {
  const { abrir } = useAgendamento()
  return (
    <button type="button" className={className} onClick={() => abrir(imovel)}>
      {children}
    </button>
  )
}
