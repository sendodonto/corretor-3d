'use client'

import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import type { Motor, PosicaoMarcador } from '@/three/motor'
import type { Qualidade } from '@/three/cena'
import type { Orbita } from '@/three/camera'
import { MODELOS } from '@/three/modelos'
import { MODOS, type ModoId } from '@/three/conteudo/casa'
import { asset } from '@/lib/base'

/*
 * <Property3DViewer /> — o imóvel em 3D.
 *
 * Motor próprio em three.js (src/three/): luz de estúdio, sombra suave sobre a
 * página, oclusão de ambiente, pontos HOTSPOT_* lidos do GLB, portas animadas
 * e render sob demanda. O three.js só é baixado quando o 3D abre.
 *
 * Desktop: carrega sozinho ao aparecer na tela. Celular: pôster + botão
 * "Explorar em 3D", que abre em tela cheia (a rolagem da página nunca fica
 * presa no 3D). Aparelhos fracos recebem a versão leve do modelo.
 */

/** Casas com tour 3D: Alameda ('casa'), Horizonte e Serra. */
export type ModeloId = keyof typeof MODOS

const ESTUDIO = { fundo: 0xf7f6f3, chao: 0xe4e2dd, transparente: true }

const telaPequena = () => matchMedia('(max-width: 899px), (pointer: coarse)').matches
const menosMovimento = () => matchMedia('(prefers-reduced-motion: reduce)').matches

function detectarQualidade(): Qualidade {
  const forcada = new URLSearchParams(location.search).get('qualidade')
  if (forcada === 'baixa' || forcada === 'media' || forcada === 'alta') return forcada
  const nav = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } }
  const memoria = nav.deviceMemory ?? 8
  const nucleos = nav.hardwareConcurrency ?? 8
  if (nav.connection?.saveData || memoria <= 3 || nucleos <= 4) return 'baixa'
  if (matchMedia('(pointer: coarse)').matches || memoria <= 4) return 'media'
  return 'alta'
}

const suportaWebGL2 = () => {
  try {
    return !!document.createElement('canvas').getContext('webgl2')
  } catch {
    return false
  }
}

export interface Property3DViewerProps {
  modelo: ModeloId
  /** Nome do imóvel, para leitores de tela. */
  nome: string
  /** 'hero': decorativo, gira sozinho, sem pontos. 'completo': modos, pontos e ferramentas. */
  variante?: 'hero' | 'completo'
  /** Modo inicial (casa). */
  modoInicial?: ModoId
  /** Modo controlado pela seção de fora (as abas só aparecem em tela cheia). */
  modoControlado?: ModoId
  aoTrocarModo?: (modo: ModoId) => void
  poster?: { paisagem: string; retrato: string }
  tamanho?: string
  className?: string
}

export function Property3DViewer({
  modelo,
  nome,
  variante = 'completo',
  modoInicial = 'externa',
  modoControlado,
  aoTrocarModo,
  poster,
  tamanho,
  className,
}: Property3DViewerProps) {
  const palco = useRef<HTMLDivElement>(null)
  const alvoCanvas = useRef<HTMLDivElement>(null)
  const motorRef = useRef<Motor | null>(null)
  const marcadores = useRef(new Map<string, HTMLButtonElement>())
  const modoAplicado = useRef<ModoId | null>(null)

  const [estado, setEstado] = useState<'ocioso' | 'carregando' | 'ativo' | 'erro'>('ocioso')
  const [progresso, setProgresso] = useState(0)
  const [pedido, setPedido] = useState(false)
  const [imersivo, setImersivo] = useState(false)
  const [dica, setDica] = useState(true)
  const [modoInterno, setModo] = useState<ModoId>(modoInicial)
  const modo = modoControlado ?? modoInterno
  const [ativo, setAtivo] = useState<string | null>(null)
  const [dadosGlb, setDadosGlb] = useState<Record<string, { titulo: string; descricao: string; animacao?: string }>>({})

  const cfg = MODELOS[modelo]
  const modosCasa = MODOS[modelo]
  const completo = variante === 'completo' || imersivo
  const modoAtual = modosCasa.find((m) => m.id === modo)!

  const pontos = useMemo(() => {
    return modoAtual.pontos.map((p, i) => ({
      ...p,
      numero: i + 1,
      titulo: p.titulo ?? dadosGlb[p.no]?.titulo ?? p.rotulo,
      descricao: dadosGlb[p.no]?.descricao ?? '',
      animacao: dadosGlb[p.no]?.animacao,
    }))
  }, [modoAtual, dadosGlb])
  const pontoAtivo = pontos.find((p) => p.no === ativo) ?? null

  const pedir = useCallback(() => {
    if (!suportaWebGL2()) {
      setEstado('erro')
      return
    }
    setEstado('carregando')
    setProgresso(0)
    setPedido(true)
  }, [])

  // ——— Desktop: carrega quando o palco se aproxima da tela e libera a GPU
  // quando fica longe (a home tem dois 3D; o arquivo volta do cache). ———
  const imersivoRef = useRef(false)
  useEffect(() => {
    imersivoRef.current = imersivo
  }, [imersivo])
  useEffect(() => {
    const el = palco.current
    if (!el || (telaPequena() && !new URLSearchParams(location.search).has('auto3d'))) return
    const nav = navigator as Navigator & { connection?: { saveData?: boolean } }
    if (nav.connection?.saveData) return
    let carregado = false
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !carregado) {
          carregado = true
          pedir()
        } else if (!e.isIntersecting && carregado && !imersivoRef.current) {
          carregado = false
          setPedido(false)
          setEstado('ocioso')
          setAtivo(null)
          setDica(true)
        }
      },
      { rootMargin: '120% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [pedir])

  // ——— Cria e destrói o motor ———
  useEffect(() => {
    if (!pedido) return
    let cancelado = false
    ;(async () => {
      try {
        const { criarMotor } = await import('@/three/motor')
        if (cancelado || !alvoCanvas.current) return
        const qualidade = detectarQualidade()
        const arquivo = cfg.arquivoLeve && qualidade !== 'alta' ? cfg.arquivoLeve : cfg.arquivo
        const todos = modosCasa.flatMap((m) => m.pontos)
        const motor = await criarMotor({
          container: alvoCanvas.current,
          modelo: asset(arquivo),
          config: cfg,
          estudio: ESTUDIO,
          qualidade,
          reduzirMovimento: menosMovimento(),
          girarSozinho: variante === 'hero',
          // ?gravacao: qualidade máxima em todo quadro (gravação de vídeos)
          sempreCompleto: new URLSearchParams(location.search).has('gravacao'),
          vistas: Object.fromEntries(todos.map((p) => [p.no, { ...p.vista, alvo: [0, 0, 0] as Orbita['alvo'] }])),
          aoProgredir: (f) => setProgresso(f),
          aoMoverMarcadores: (lista: PosicaoMarcador[]) => {
            for (const m of lista) {
              const el = marcadores.current.get(m.no)
              if (!el) continue
              el.style.transform = `translate3d(${m.x.toFixed(1)}px, ${m.y.toFixed(1)}px, 0)`
              el.classList.toggle('is-oculto', !m.visivel)
            }
          },
          aoToqueVazio: () => setAtivo(null),
          aoInteragir: () => setDica(false),
          aoPerderContexto: () => {
            motorRef.current?.dispose()
            motorRef.current = null
            setEstado('erro')
          },
        })
        if (cancelado) {
          motor.dispose()
          return
        }
        motorRef.current = motor
        // ?gravacao: o script de gravação controla a câmera diretamente
        if (new URLSearchParams(location.search).has('gravacao')) (window as unknown as { __motor?: Motor }).__motor = motor
        setDadosGlb(Object.fromEntries(motor.hotspots.map((h) => [h.no, { titulo: h.titulo, descricao: h.descricao, animacao: h.animacao }])))
        setEstado('ativo')
      } catch (e) {
        console.error(e)
        if (!cancelado) setEstado('erro')
      }
    })()
    return () => {
      cancelado = true
      motorRef.current?.dispose()
      motorRef.current = null
      modoAplicado.current = null
    }
  }, [pedido, modelo, cfg, modosCasa, variante])

  // ——— Modo da casa: grupos ocultos + câmera ———
  useEffect(() => {
    const m = motorRef.current
    if (!m || estado !== 'ativo' || !modoAtual) return
    const primeiro = modoAplicado.current === null
    if (modoAplicado.current === modoAtual.id) return
    modoAplicado.current = modoAtual.id
    m.ocultar(modoAtual.ocultar)
    if (primeiro && !modoAtual.orbita) return
    if (modoAtual.orbita) m.irPara(modoAtual.orbita, modoAtual.limites)
    else m.vistaInicial()
  }, [estado, modoAtual])

  // ——— Ponto ativo: câmera + porta/gaveta ———
  useEffect(() => {
    const m = motorRef.current
    if (!m || estado !== 'ativo') return
    if (ativo) m.focar(ativo)
    m.animar(pontos.find((p) => p.no === ativo)?.animacao ?? null)
  }, [ativo, estado, pontos])

  // ——— Área livre: a câmera centraliza o modelo fora das barras ———
  useEffect(() => {
    const m = motorRef.current
    if (!m || estado !== 'ativo') return
    m.definirMargens({ direita: 0, topo: completo ? 64 : 0, base: completo && pontos.length ? 72 : 0 })
    m.permitirRoda(imersivo)
  }, [estado, imersivo, completo, pontos.length])

  // ——— Pausa fora da tela e com a aba oculta ———
  useEffect(() => {
    const el = palco.current
    if (!el || estado !== 'ativo') return
    let naTela = true
    const atualizar = () => motorRef.current?.pausar(!naTela || document.hidden || (telaPequena() && !imersivo))
    const io = new IntersectionObserver(([e]) => {
      naTela = e.isIntersecting
      atualizar()
    })
    io.observe(el)
    document.addEventListener('visibilitychange', atualizar)
    atualizar()
    return () => {
      io.disconnect()
      document.removeEventListener('visibilitychange', atualizar)
    }
  }, [estado, imersivo])

  // ——— Tela cheia: trava a rolagem; "voltar" do sistema fecha ———
  const sairImersivo = useCallback((doHistorico = false) => {
    setImersivo(false)
    document.documentElement.classList.remove('trava-rolagem')
    if (!doHistorico && history.state?.visualizador3d) history.back()
  }, [])
  const entrarImersivo = () => {
    setImersivo(true)
    document.documentElement.classList.add('trava-rolagem')
    history.pushState({ ...history.state, visualizador3d: true }, '')
  }
  useEffect(() => {
    const aoVoltar = () => {
      if (document.documentElement.classList.contains('trava-rolagem')) sairImersivo(true)
    }
    addEventListener('popstate', aoVoltar)
    return () => removeEventListener('popstate', aoVoltar)
  }, [sairImersivo])

  useEffect(() => {
    if (!imersivo && !ativo) return
    const tecla = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      if (ativo) setAtivo(null)
      else sairImersivo()
    }
    addEventListener('keydown', tecla)
    return () => removeEventListener('keydown', tecla)
  }, [ativo, imersivo, sairImersivo])

  const abrir = () => {
    if (!pedido) pedir()
    if (telaPequena()) entrarImersivo()
  }
  const trocarModo = (id: ModoId) => {
    setAtivo(null)
    setModo(id)
    aoTrocarModo?.(id)
  }
  const passo = (d: number) => {
    const i = pontos.findIndex((p) => p.no === ativo)
    setAtivo(pontos[((i < 0 ? 0 : i + d) + pontos.length) % pontos.length].no)
  }

  const mostrarCapa = estado === 'ocioso' || (telaPequena() && !imersivo && estado === 'ativo')
  // Em tela cheia a lista de modos da seção fica escondida: as abas aparecem no 3D.
  const mostrarAbas = completo && (!modoControlado || imersivo)

  return (
    <div
      className={`v3d v3d-${variante} ${imersivo ? 'is-imersivo' : ''} ${className ?? ''}`}
      data-estado={estado}
    >
      <div
        ref={palco}
        className="v3d-palco"
        role="group"
        aria-roledescription="visualizador 3D"
        aria-label={`${nome} em 3D. Arraste para girar.`}
      >
        {poster && (
          <picture>
            <source media="(max-width: 899px)" srcSet={asset(poster.retrato)} />
            <img className="v3d-poster" src={asset(poster.paisagem)} alt="" decoding="async" />
          </picture>
        )}
        <div ref={alvoCanvas} className="v3d-canvas" />

        {completo && (
          <div className="v3d-marcadores" aria-hidden={estado !== 'ativo'}>
            {pontos.map((p) => (
              <button
                key={p.no}
                type="button"
                tabIndex={-1}
                ref={(el) => {
                  if (el) marcadores.current.set(p.no, el)
                  else marcadores.current.delete(p.no)
                }}
                className={`v3d-marcador is-oculto ${ativo === p.no ? 'is-ativo' : ''}`}
                onClick={() => setAtivo(p.no)}
                aria-label={`${p.numero}. ${p.titulo}`}
              >
                {p.numero}
              </button>
            ))}
          </div>
        )}

        {mostrarAbas && (
          <div className="v3d-modos" role="tablist" aria-label="Modo de visualização">
            {modosCasa.map((m) => (
              <button
                key={m.id}
                type="button"
                role="tab"
                aria-selected={modo === m.id}
                className={modo === m.id ? 'is-ativo' : ''}
                onClick={() => trocarModo(m.id)}
              >
                {m.rotulo}
              </button>
            ))}
          </div>
        )}

        {mostrarCapa && (
          <div className="v3d-capa">
            <button type="button" className="v3d-iniciar" onClick={abrir}>
              <svg viewBox="0 0 24 24" aria-hidden width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9zM12 12l8-4.5M12 12v9M12 12L4 7.5" />
              </svg>
              Explorar em 3D
              {tamanho ? <span className="v3d-tamanho">{tamanho}</span> : null}
            </button>
          </div>
        )}

        {estado === 'carregando' && (!telaPequena() || imersivo) && (
          <div className="v3d-carregando" role="status">
            <span>Preparando experiência 3D…</span>
            <span className="v3d-barra" style={{ '--p': progresso } as CSSProperties} />
          </div>
        )}

        {estado === 'ativo' && dica && !ativo && (!telaPequena() || imersivo) && (
          <div className="v3d-dica" aria-hidden>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M7 12h10M7 12l3-3M7 12l3 3M17 12l-3-3M17 12l-3 3" />
            </svg>
            Arraste para explorar
          </div>
        )}

        {estado === 'erro' && (
          <div className="v3d-erro" role="alert">
            <span>Não foi possível abrir o 3D neste aparelho. As fotos continuam disponíveis abaixo.</span>
            {pedido && (
              <button
                type="button"
                onClick={() => {
                  setPedido(false)
                  setTimeout(pedir, 0)
                }}
              >
                Tentar de novo
              </button>
            )}
          </div>
        )}

        {estado === 'ativo' && (!telaPequena() || imersivo) && (completo || imersivo) && (
          <div className="v3d-ferramentas" role="toolbar" aria-label="Controles do 3D">
            {completo && (
              <>
                <button type="button" onClick={() => motorRef.current?.aproximar(0.75)} aria-label="Aproximar" title="Aproximar">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </button>
                <button type="button" onClick={() => motorRef.current?.aproximar(1.33)} aria-label="Afastar" title="Afastar">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
                    <path d="M5 12h14" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAtivo(null)
                    const m = motorRef.current
                    if (!m) return
                    if (modoAtual?.orbita) m.irPara(modoAtual.orbita, modoAtual.limites)
                    else m.vistaInicial()
                  }}
                  aria-label="Voltar à vista inicial"
                  title="Vista inicial"
                >
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
                    <path d="M4 12a8 8 0 1 0 2.4-5.7M4 4v4h4" />
                  </svg>
                </button>
              </>
            )}
            {!imersivo && (
              <button type="button" onClick={entrarImersivo} aria-label="Tela cheia" title="Tela cheia">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
                  <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" />
                </svg>
              </button>
            )}
          </div>
        )}

        {imersivo && (
          <button type="button" className="v3d-fechar" onClick={() => sairImersivo()}>
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
            Fechar
          </button>
        )}

        {completo && pontoAtivo && estado === 'ativo' && (
          <article className="v3d-ficha" aria-live="polite">
            <header>
              <span className="v3d-num">{String(pontoAtivo.numero).padStart(2, '0')}</span>
              <h3>{pontoAtivo.titulo}</h3>
            </header>
            {pontoAtivo.descricao && <p className="v3d-resumo">{pontoAtivo.descricao}</p>}
            <ul>
              {pontoAtivo.detalhes.map((d) => (
                <li key={d}>{d}</li>
              ))}
            </ul>
            <nav>
              <button type="button" onClick={() => passo(-1)} aria-label="Ponto anterior">
                ←
              </button>
              <button type="button" onClick={() => passo(1)} aria-label="Próximo ponto">
                →
              </button>
              <button type="button" className="v3d-fechar-ficha" onClick={() => setAtivo(null)}>
                Fechar
              </button>
            </nav>
          </article>
        )}

        {completo && pontos.length > 0 && (
          <div className="v3d-pontos" role="group" aria-label="Pontos de interesse">
            {pontos.map((p) => (
              <button
                key={p.no}
                type="button"
                className={`v3d-chip ${ativo === p.no ? 'is-ativo' : ''}`}
                aria-pressed={ativo === p.no}
                onClick={() => {
                  if (estado !== 'ativo') abrir()
                  setAtivo(ativo === p.no ? null : p.no)
                }}
              >
                <span className="v3d-num">{p.numero}</span>
                {p.rotulo}
              </button>
            ))}
          </div>
        )}

        {completo && !pontos.length && estado === 'ativo' && (
          <p className="v3d-legenda">{modoAtual.legenda}</p>
        )}
      </div>
    </div>
  )
}
