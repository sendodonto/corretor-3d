import { asset } from '@/lib/base'
import { site } from '@/config/site'

/**
 * Logo da Módulo. O arquivo é usado como máscara: a cor vem do texto
 * (currentColor), então funciona sobre fundo claro e escuro.
 * `simbolo` = só o cubo em "M".
 */
export function Logo({ simbolo = false, className = 'h-6' }: { simbolo?: boolean; className?: string }) {
  const arquivo = asset(simbolo ? '/marca/modulo-simbolo.png' : '/marca/modulo-logo.png')
  const proporcao = simbolo ? '294 / 260' : '943 / 268'
  return (
    <span
      role="img"
      aria-label={site.marca}
      className={`inline-block bg-current ${className}`}
      style={{
        aspectRatio: proporcao,
        maskImage: `url(${arquivo})`,
        WebkitMaskImage: `url(${arquivo})`,
        maskSize: 'contain',
        WebkitMaskSize: 'contain',
        maskRepeat: 'no-repeat',
        WebkitMaskRepeat: 'no-repeat',
      }}
    />
  )
}
