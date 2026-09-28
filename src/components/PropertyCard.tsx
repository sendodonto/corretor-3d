import Link from 'next/link'
import { BedDouble, Car, Maximize2 } from 'lucide-react'
import { formatarPreco, type Imovel } from '@/data/imoveis'
import { asset } from '@/lib/base'

/** Cartão de imóvel: foto, selo 3D, preço e três números essenciais. */
export function PropertyCard({ imovel, prioridade = false }: { imovel: Imovel; prioridade?: boolean }) {
  const foto = imovel.fotos[0]
  return (
    <Link
      href={`/imoveis/${imovel.slug}`}
      className="group block rounded-[var(--radius-cartao)] bg-white p-2 shadow-[0_0_0_1px_var(--color-linha)] transition-[box-shadow,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:shadow-[0_0_0_1px_var(--color-linha),0_24px_48px_-24px_rgb(0_0_0/0.22)]"
    >
      <div className="relative aspect-[4/3] overflow-hidden rounded-[14px] bg-nevoa">
        <img
          src={asset(foto.mini)}
          alt={foto.alt}
          loading={prioridade ? 'eager' : 'lazy'}
          decoding="async"
          className="size-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]"
        />
        <div className="absolute left-3 top-3 flex gap-1.5">
          {imovel.modelo3d && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/90 px-2.5 py-1 text-[12px] font-medium text-tinta backdrop-blur">
              <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
                <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9zM12 12l8-4.5M12 12v9M12 12L4 7.5" />
              </svg>
              Tour 3D
            </span>
          )}
          <span className="rounded-full bg-black/55 px-2.5 py-1 text-[12px] font-medium text-white backdrop-blur">{imovel.finalidade}</span>
        </div>
      </div>
      <div className="px-3 pb-3 pt-4">
        <p className="text-[13px] text-suave">
          {imovel.tipo} · {imovel.bairro}
        </p>
        <h3 className="mt-1 text-[18px] font-semibold tracking-[-0.025em]">{imovel.titulo}</h3>
        <p className="num mt-2 text-[20px] font-semibold tracking-[-0.03em]">{formatarPreco(imovel)}</p>
        <ul className="num mt-3 flex flex-wrap gap-x-4 gap-y-1 border-t border-linha pt-3 text-[13.5px] text-tinta-2">
          <li className="inline-flex items-center gap-1.5">
            <Maximize2 size={14} strokeWidth={1.6} className="text-suave" aria-hidden />
            {imovel.area} m²
          </li>
          <li className="inline-flex items-center gap-1.5">
            <BedDouble size={15} strokeWidth={1.6} className="text-suave" aria-hidden />
            {imovel.quartos} {imovel.quartos === 1 ? 'quarto' : 'quartos'}
          </li>
          {imovel.vagas > 0 && (
            <li className="inline-flex items-center gap-1.5">
              <Car size={15} strokeWidth={1.6} className="text-suave" aria-hidden />
              {imovel.vagas} {imovel.vagas === 1 ? 'vaga' : 'vagas'}
            </li>
          )}
        </ul>
      </div>
    </Link>
  )
}
