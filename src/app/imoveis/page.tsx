import type { Metadata } from 'next'
import { Suspense } from 'react'
import { site } from '@/config/site'
import { Catalogo } from './Catalogo'

export const metadata: Metadata = {
  title: 'Imóveis',
  description: `Casas e apartamentos à venda e para alugar em ${site.cidade}, vários com tour 3D.`,
}

export default function PaginaImoveis() {
  return (
    <div className="mx-auto max-w-[1240px] px-5 pb-24 pt-28 md:px-8 md:pt-36">
      <p className="sobretitulo">Catálogo</p>
      <h1 className="titulo-l mt-3">Imóveis em {site.cidade}</h1>
      <p className="texto-corpo mt-4 max-w-[56ch]">
        Os marcados com <strong className="font-medium text-tinta">Tour 3D</strong> podem ser explorados por dentro e por fora
        antes da visita.
      </p>
      <Suspense fallback={<div className="mt-10 h-96" />}>
        <Catalogo />
      </Suspense>
    </div>
  )
}
