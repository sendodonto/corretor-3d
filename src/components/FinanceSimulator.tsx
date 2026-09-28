'use client'

import { useId, useState } from 'react'
import { Calculator } from 'lucide-react'
import { reais } from '@/data/imoveis'
import { linkWhatsApp } from '@/lib/whatsapp'

// Taxa de referência só para a simulação (juros efetivos ao ano). O valor
// real depende do banco, do perfil e da data da proposta.
const TAXA_ANO = 0.115
const PRAZOS = [15, 20, 30, 35]

/** Simulador simples (tabela Price): entrada, prazo e parcela estimada. */
export function FinanceSimulator({ preco, titulo }: { preco: number; titulo: string }) {
  const id = useId()
  const [entradaPct, setEntradaPct] = useState(30)
  const [anos, setAnos] = useState(30)

  const entrada = Math.round((preco * entradaPct) / 100)
  const financiado = preco - entrada
  const i = Math.pow(1 + TAXA_ANO, 1 / 12) - 1
  const n = anos * 12
  const parcela = (financiado * i) / (1 - Math.pow(1 + i, -n))
  const renda = parcela / 0.3

  const msg = `Olá! Simulei o financiamento do imóvel "${titulo}": entrada de ${reais(entrada)} (${entradaPct}%) em ${anos} anos. Pode me ajudar a simular com o banco?`

  return (
    <section aria-labelledby={`${id}-t`} className="rounded-[var(--radius-cartao)] bg-white p-6 shadow-[0_0_0_1px_var(--color-linha)] md:p-8">
      <div className="flex items-center gap-3">
        <span className="grid size-10 place-items-center rounded-full bg-acento-claro text-acento">
          <Calculator size={19} strokeWidth={1.6} aria-hidden />
        </span>
        <h2 id={`${id}-t`} className="titulo-m">
          Simule o financiamento
        </h2>
      </div>

      <div className="mt-7 grid gap-7 md:grid-cols-2 md:gap-10">
        <div className="grid content-start gap-6">
          <div>
            <div className="flex items-baseline justify-between">
              <label htmlFor={`${id}-e`} className="rotulo-campo !mb-0">
                Entrada
              </label>
              <span className="num text-[15px] font-medium">
                {reais(entrada)} <span className="text-suave">· {entradaPct}%</span>
              </span>
            </div>
            <input
              id={`${id}-e`}
              type="range"
              min={20}
              max={80}
              step={5}
              value={entradaPct}
              onChange={(e) => setEntradaPct(Number(e.target.value))}
              className="mt-3 w-full accent-[var(--color-acento)]"
            />
          </div>
          <fieldset>
            <legend className="rotulo-campo">Prazo</legend>
            <div className="grid grid-cols-4 gap-1.5">
              {PRAZOS.map((p) => (
                <button
                  key={p}
                  type="button"
                  aria-pressed={anos === p}
                  onClick={() => setAnos(p)}
                  className={`num min-h-11 rounded-xl text-[14px] font-medium transition-colors ${
                    anos === p ? 'bg-tinta text-white' : 'bg-white text-tinta-2 shadow-[inset_0_0_0_1px_var(--color-linha-forte)] hover:shadow-[inset_0_0_0_1px_var(--color-tinta)]'
                  }`}
                >
                  {p} anos
                </button>
              ))}
            </div>
          </fieldset>
        </div>

        <div className="rounded-2xl bg-papel p-5">
          <p className="text-[13px] text-suave">Parcela estimada</p>
          <p className="num mt-1 text-[32px] font-semibold tracking-[-0.035em]" aria-live="polite">
            {reais(parcela)}
            <span className="text-[15px] font-normal text-suave">/mês</span>
          </p>
          <dl className="num mt-4 grid grid-cols-2 gap-y-2 border-t border-linha pt-4 text-[14px]">
            <dt className="text-suave">Valor financiado</dt>
            <dd className="text-right font-medium">{reais(financiado)}</dd>
            <dt className="text-suave">Renda sugerida</dt>
            <dd className="text-right font-medium">{reais(renda)}</dd>
          </dl>
          <a href={linkWhatsApp(msg)} target="_blank" rel="noopener" className="botao botao-primario mt-5 w-full">
            Simular com o banco
          </a>
        </div>
      </div>
      <p className="mt-5 text-[12.5px] leading-relaxed text-suave">
        Simulação pela tabela Price com taxa de referência de 11,5% ao ano, sem seguros e tarifas. A parcela real depende da
        análise de crédito do banco.
      </p>
    </section>
  )
}
