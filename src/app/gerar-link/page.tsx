import type { Metadata } from 'next'
import { GeradorLink } from './GeradorLink'

// Ferramenta interna da Módulo (fora do menu e dos buscadores).
export const metadata: Metadata = {
  title: 'Gerar prévia personalizada',
  robots: { index: false, follow: false },
}

export default function Pagina() {
  return (
    <div className="mx-auto max-w-[720px] px-5 pb-24 pt-[calc(var(--topo)+3rem)] md:px-8">
      <p className="sobretitulo">Uso interno · Módulo</p>
      <h1 className="titulo-l mt-3">Prévia personalizada</h1>
      <p className="texto-corpo mt-4">
        Gere um link da demonstração com o nome do corretor que vai receber. O site abre com a marca dele no topo, no perfil e
        no rodapé.
      </p>
      <GeradorLink />
    </div>
  )
}
